from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class PlanDetails(BaseModel):
    id: str                 # 'monthly', 'annual'
    name: str
    price: int              # in INR
    interval: str           # 'month', 'year'
    discount_percent: int   # 0 for monthly, ~35-40 for annual
    features: List[str]

class CheckoutSessionRequest(BaseModel):
    plan_type: str          # 'monthly' or 'annual'
    gateway: Optional[str] = "stripe" # 'stripe' or 'razorpay'

class CheckoutSessionResponse(BaseModel):
    checkout_url: str
    session_id: str
    plan_type: str
    amount: int
    currency: str

class SubscriptionStatusResponse(BaseModel):
    is_pro: bool
    plan_type: str          # 'free', 'monthly', 'annual', 'lifetime'
    status: str             # 'active', 'trialing', 'canceled', 'none'
    current_period_end: Optional[datetime] = None
    cancel_at_period_end: bool = False
    customer_portal_url: Optional[str] = None
