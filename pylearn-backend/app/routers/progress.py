from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.user import UserProgress
from app.schemas.user import ProgressSyncRequest, ProgressItemResponse

router = APIRouter(prefix="/progress", tags=["Cloud Progress Sync"])

@router.get("/{course_id}", response_model=List[ProgressItemResponse])
async def get_course_progress(
    course_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    user_id = str(current_user["id"])
    result = await db.execute(
        select(UserProgress).where(
            UserProgress.user_id == user_id,
            UserProgress.course_id == course_id
        )
    )
    items = result.scalars().all()
    return items

@router.post("/sync", response_model=ProgressItemResponse)
async def sync_slide_progress(
    payload: ProgressSyncRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    user_id = str(current_user["id"])
    
    # Check if record exists
    result = await db.execute(
        select(UserProgress).where(
            UserProgress.user_id == user_id,
            UserProgress.course_id == payload.course_id,
            UserProgress.slide_id == payload.slide_id
        )
    )
    progress_item = result.scalars().first()

    if not progress_item:
        progress_item = UserProgress(
            user_id=user_id,
            course_id=payload.course_id,
            slide_id=payload.slide_id,
            completed=payload.completed,
            saved_code=payload.saved_code
        )
        db.add(progress_item)
    else:
        progress_item.completed = payload.completed
        if payload.saved_code is not None:
            progress_item.saved_code = payload.saved_code

    await db.commit()
    await db.refresh(progress_item)
    return progress_item
