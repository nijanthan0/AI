from sqlalchemy import Column, String, Integer, Boolean, Text, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base

class UserProfile(Base):
    __tablename__ = "profiles"

    id = Column(String(64), primary_key=True, index=True) # UUID from Supabase Auth or Google OAuth
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=True)
    avatar_url = Column(String(512), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    progress = relationship("UserProgress", back_populates="user", cascade="all, delete-orphan")
    subscription = relationship("Subscription", back_populates="user", uselist=False, cascade="all, delete-orphan")

class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(64), ForeignKey("profiles.id", ondelete="CASCADE"), index=True, nullable=False)
    course_id = Column(String(64), nullable=False, index=True)
    slide_id = Column(Integer, nullable=False, index=True)
    completed = Column(Boolean, default=False)
    saved_code = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("UserProfile", back_populates="progress")

    __table_args__ = (
        UniqueConstraint("user_id", "course_id", "slide_id", name="uq_user_course_slide"),
    )
