from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserProfileBase(BaseModel):
    email: str
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None

class UserProfileCreate(UserProfileBase):
    id: str

class UserProfileResponse(UserProfileBase):
    id: str
    created_at: datetime
    is_pro: bool = False
    plan_type: Optional[str] = "free"

    class Config:
        from_attributes = True

class ProgressSyncRequest(BaseModel):
    course_id: str
    slide_id: int
    completed: bool = True
    saved_code: Optional[str] = None

class ProgressItemResponse(BaseModel):
    course_id: str
    slide_id: int
    completed: bool
    saved_code: Optional[str] = None
    updated_at: datetime

    class Config:
        from_attributes = True
