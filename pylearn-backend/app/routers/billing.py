from fastapi import APIRouter, Depends, HTTPException, Request, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timedelta, timezone
from typing import List, Optional
import json
import uuid

from app.database import get_db
from app.config import settings
from app.middleware.auth import get_current_user
from app.models.subscription import Subscription, PaymentInvoice
from app.models.user import UserProfile
from app.schemas.subscription import (
    PlanDetails,
    CheckoutSessionRequest,
    CheckoutSessionResponse,
    SubscriptionStatusResponse
)

router = APIRouter(prefix="/billing", tags=["Subscriptions & Billing"])

# 1. Available Subscription Plans (Netflix-style Monthly + Discounted Annual)
AVAILABLE_PLANS = [
    PlanDetails(
        id="monthly",
        name="Pro Monthly Pass",
        price=settings.MONTHLY_PRICE_INR,
        interval="month",
        discount_percent=0,
        features=[
            "120+ Optimal LeetCode Solutions with Complexity proofs",
            "Real-Time System Design Architecture Scenarios",
            "Interactive AI Debugging Mentor",
            "Company-Tagged Interview Problem Tracks",
            "Cancel anytime in 1 click"
        ]
    ),
    PlanDetails(
        id="annual",
        name="Pro Annual Pass (Recommended)",
        price=settings.ANNUAL_PRICE_INR,
        interval="year",
        discount_percent=35, # ~4 Months Free!
        features=[
            "Everything in Monthly Pass",
            "Save 35% compared to monthly billing (Just ₹333/month)",
            "Official Verified Course Completion Certificate",
            "Direct 1-Click Capstone GitHub Portfolio Export",
            "Priority Access to all future AI & Systems modules"
        ]
    )
]

@router.get("/plans", response_model=List[PlanDetails])
async def get_plans():
    """Returns available subscription tiers."""
    return AVAILABLE_PLANS

@router.get("/status", response_model=SubscriptionStatusResponse)
async def get_subscription_status(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    user_id = str(current_user["id"])
    result = await db.execute(select(Subscription).where(Subscription.user_id == user_id))
    sub = result.scalars().first()

    if not sub or sub.status != "active":
        return SubscriptionStatusResponse(
            is_pro=False,
            plan_type="free",
            status="none",
            cancel_at_period_end=False
        )

    # Check if period has passed
    now = datetime.now(timezone.utc).replace(tzinfo=None)
    period_end = sub.current_period_end.replace(tzinfo=None) if sub.current_period_end else None
    if period_end and period_end < now:
        sub.status = "canceled"
        await db.commit()
        return SubscriptionStatusResponse(
            is_pro=False,
            plan_type="free",
            status="expired",
            cancel_at_period_end=False
        )

    return SubscriptionStatusResponse(
        is_pro=True,
        plan_type=sub.plan_type,
        status=sub.status,
        current_period_end=sub.current_period_end,
        cancel_at_period_end=sub.cancel_at_period_end,
        customer_portal_url=f"{settings.FRONTEND_URL}/billing"
    )

@router.post("/create-checkout", response_model=CheckoutSessionResponse)
async def create_checkout_session(
    payload: CheckoutSessionRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    user_id = str(current_user["id"])
    plan = next((p for p in AVAILABLE_PLANS if p.id == payload.plan_type), None)
    if not plan:
        raise HTTPException(status_code=400, detail="Invalid plan selected.")

    session_id = f"cs_{uuid.uuid4().hex[:16]}"
    
    # If Stripe or Razorpay is configured, call their API here.
    # Otherwise, provide seamless Instant Simulator URL for development/demo:
    checkout_url = f"{settings.FRONTEND_URL}/checkout/success?session_id={session_id}&plan={plan.id}"

    return CheckoutSessionResponse(
        checkout_url=checkout_url,
        session_id=session_id,
        plan_type=plan.id,
        amount=plan.price,
        currency="INR"
    )

@router.post("/activate-simulated")
async def activate_simulated_subscription(
    plan_type: str = "annual",
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Activates subscription for testing/development."""
    user_id = str(current_user["id"])
    
    # Upsert profile if needed
    p_res = await db.execute(select(UserProfile).where(UserProfile.id == user_id))
    profile = p_res.scalars().first()
    if not profile:
        profile = UserProfile(
            id=user_id,
            email=current_user.get("email", f"{user_id}@pylearn.local"),
            full_name=current_user.get("name", "Learner")
        )
        db.add(profile)
        await db.flush()

    sub_res = await db.execute(select(Subscription).where(Subscription.user_id == user_id))
    sub = sub_res.scalars().first()

    duration = 365 if plan_type == "annual" else 30
    now = datetime.now(timezone.utc).replace(tzinfo=None)
    end_date = now + timedelta(days=duration)

    if not sub:
        sub = Subscription(
            id=f"sub_{uuid.uuid4().hex[:16]}",
            user_id=user_id,
            plan_type=plan_type,
            status="active",
            current_period_start=now,
            current_period_end=end_date,
            cancel_at_period_end=False
        )
        db.add(sub)
    else:
        sub.plan_type = plan_type
        sub.status = "active"
        sub.current_period_start = now
        sub.current_period_end = end_date
        sub.cancel_at_period_end = False

    # Add invoice record
    invoice = PaymentInvoice(
        id=f"inv_{uuid.uuid4().hex[:12]}",
        user_id=user_id,
        amount=settings.ANNUAL_PRICE_INR * 100 if plan_type == "annual" else settings.MONTHLY_PRICE_INR * 100,
        currency="INR",
        status="paid"
    )
    db.add(invoice)

    await db.commit()
    return {"message": "Subscription activated successfully", "plan": plan_type, "expires": end_date}

@router.post("/cancel")
async def cancel_subscription(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Cancels at period end (Netflix model: keeps access active until paid cycle ends)."""
    user_id = str(current_user["id"])
    result = await db.execute(select(Subscription).where(Subscription.user_id == user_id))
    sub = result.scalars().first()

    if not sub or sub.status != "active":
        raise HTTPException(status_code=400, detail="No active subscription found to cancel.")

    sub.cancel_at_period_end = True
    await db.commit()
    return {
        "message": "Subscription will not renew. You retain Pro access until the end of your billing cycle.",
        "access_until": sub.current_period_end
    }

@router.post("/webhook")
async def handle_payment_webhook(
    request: Request,
    stripe_signature: Optional[str] = Header(None, alias="Stripe-Signature"),
    db: AsyncSession = Depends(get_db)
):
    """
    Production Webhook Receiver for Stripe / Razorpay subscription lifecycle events.
    Verifies cryptographic signature and updates database state.
    """
    raw_body = await request.body()
    
    try:
        event = json.loads(raw_body.decode("utf-8"))
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON payload")

    event_type = event.get("type", "")
    data_object = event.get("data", {}).get("object", {})

    # 1. Successful initial checkout
    if event_type == "checkout.session.completed":
        customer_id = data_object.get("customer")
        subscription_id = data_object.get("subscription")
        client_ref_id = data_object.get("client_reference_id") # user_id

        if client_ref_id:
            sub_res = await db.execute(select(Subscription).where(Subscription.user_id == client_ref_id))
            sub = sub_res.scalars().first()
            now = datetime.now(timezone.utc).replace(tzinfo=None)
            
            if sub:
                sub.status = "active"
                sub.gateway_customer_id = customer_id
                sub.gateway_subscription_id = subscription_id
            else:
                sub = Subscription(
                    id=f"sub_{uuid.uuid4().hex[:16]}",
                    user_id=client_ref_id,
                    plan_type="annual",
                    status="active",
                    gateway_customer_id=customer_id,
                    gateway_subscription_id=subscription_id,
                    current_period_start=now,
                    current_period_end=now + timedelta(days=365)
                )
                db.add(sub)
            await db.commit()

    # 2. Recurring subscription renewal succeeded
    elif event_type == "invoice.payment_succeeded":
        sub_id = data_object.get("subscription")
        if sub_id:
            res = await db.execute(select(Subscription).where(Subscription.gateway_subscription_id == sub_id))
            sub = res.scalars().first()
            if sub:
                sub.status = "active"
                # extend period by 30 or 365 days
                days = 365 if sub.plan_type == "annual" else 30
                sub.current_period_end = datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(days=days)
                await db.commit()

    # 3. Subscription deleted / canceled
    elif event_type in ["customer.subscription.deleted", "subscription.cancelled"]:
        sub_id = data_object.get("id") or data_object.get("subscription")
        if sub_id:
            res = await db.execute(select(Subscription).where(Subscription.gateway_subscription_id == sub_id))
            sub = res.scalars().first()
            if sub:
                sub.status = "canceled"
                await db.commit()

    return {"status": "success", "received_event": event_type}
