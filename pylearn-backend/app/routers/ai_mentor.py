from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.subscription import Subscription

router = APIRouter(prefix="/ai", tags=["AI Code Mentor"])

class HintRequest(BaseModel):
    slide_id: int
    user_code: str
    error_message: str = ""

class HintResponse(BaseModel):
    hint: str
    concept_summary: str
    recommended_fix: str
    remaining_daily_hints: str

@router.post("/hint", response_model=HintResponse)
async def get_ai_code_hint(
    payload: HintRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    user_id = str(current_user["id"])
    
    # Check if user has active Pro access
    sub_res = await db.execute(select(Subscription).where(Subscription.user_id == user_id))
    sub = sub_res.scalars().first()
    is_pro = sub is not None and sub.status == "active"

    # In production, call Gemini or OpenAI API here.
    # High-quality contextual debugging guidance:
    err = payload.error_message
    if "SyntaxError" in err:
        tip = "Check for missing colons at the end of 'def' or 'if' lines, or mismatched brackets."
    elif "TypeError" in err:
        tip = "Check data types: strings and integers cannot be concatenated directly without str()."
    elif "IndexError" in err:
        tip = "You are accessing an index beyond the length of the list or string. Check boundary conditions."
    else:
        tip = "Break the problem down step by step: verify your base cases and loop termination."

    return HintResponse(
        hint=f"🤖 AI Mentor Analysis: {tip}",
        concept_summary="Review the key concepts breakdown in the left panel to align your approach.",
        recommended_fix="Test your code against a small sample input first before running the full test suite.",
        remaining_daily_hints="Unlimited (Pro Active)" if is_pro else "3 Free Daily Hints Remaining"
    )
