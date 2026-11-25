from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.user import UserProfile
from app.models.subscription import Subscription
from app.schemas.user import UserProfileResponse, UserProfileBase

router = APIRouter(prefix="/auth", tags=["Authentication & Profile"])

@router.get("/me", response_model=UserProfileResponse)
async def get_my_profile(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    user_id = str(current_user["id"])
    
    # Fetch or auto-create profile
    result = await db.execute(select(UserProfile).where(UserProfile.id == user_id))
    profile = result.scalars().first()

    if not profile:
        profile = UserProfile(
            id=user_id,
            email=current_user.get("email", f"{user_id}@pylearn.local"),
            full_name=current_user.get("name") or current_user.get("user_metadata", {}).get("full_name"),
            avatar_url=current_user.get("avatar_url") or current_user.get("user_metadata", {}).get("avatar_url")
        )
        db.add(profile)
        await db.commit()
        await db.refresh(profile)

    # Check subscription status
    sub_res = await db.execute(select(Subscription).where(Subscription.user_id == user_id))
    sub = sub_res.scalars().first()

    is_pro = sub is not None and sub.status == "active"
    plan_type = sub.plan_type if is_pro else "free"

    return UserProfileResponse(
        id=profile.id,
        email=profile.email,
        full_name=profile.full_name,
        avatar_url=profile.avatar_url,
        created_at=profile.created_at,
        is_pro=is_pro,
        plan_type=plan_type
    )

@router.post("/sync", response_model=UserProfileResponse)
async def sync_profile(
    data: UserProfileBase,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    user_id = str(current_user["id"])
    result = await db.execute(select(UserProfile).where(UserProfile.id == user_id))
    profile = result.scalars().first()

    if not profile:
        profile = UserProfile(
            id=user_id,
            email=data.email or current_user.get("email"),
            full_name=data.full_name,
            avatar_url=data.avatar_url
        )
        db.add(profile)
    else:
        if data.full_name: profile.full_name = data.full_name
        if data.avatar_url: profile.avatar_url = data.avatar_url

    await db.commit()
    await db.refresh(profile)

    # Check subscription
    sub_res = await db.execute(select(Subscription).where(Subscription.user_id == user_id))
    sub = sub_res.scalars().first()

    is_pro = sub is not None and sub.status == "active"
    plan_type = sub.plan_type if is_pro else "free"

    return UserProfileResponse(
        id=profile.id,
        email=profile.email,
        full_name=profile.full_name,
        avatar_url=profile.avatar_url,
        created_at=profile.created_at,
        is_pro=is_pro,
        plan_type=plan_type
    )
