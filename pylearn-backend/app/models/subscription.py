from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base

class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), ForeignKey("profiles.id", ondelete="CASCADE"), unique=True, index=True, nullable=False)
    plan_type = Column(String(32), nullable=False) # 'monthly', 'annual', 'lifetime'
    status = Column(String(32), nullable=False, default="trialing") # 'active', 'past_due', 'canceled', 'trialing'
    
    gateway_customer_id = Column(String(128), nullable=True)     # Stripe / Razorpay customer ID
    gateway_subscription_id = Column(String(128), nullable=True) # Stripe / Razorpay subscription ID
    
    current_period_start = Column(DateTime, nullable=True)
    current_period_end = Column(DateTime, nullable=True)
    cancel_at_period_end = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("UserProfile", back_populates="subscription")

class PaymentInvoice(Base):
    __tablename__ = "payment_invoices"

    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), ForeignKey("profiles.id", ondelete="CASCADE"), index=True, nullable=False)
    amount = Column(Integer, nullable=False) # in smallest currency unit (cents / paise)
    currency = Column(String(8), default="INR")
    status = Column(String(32), nullable=False) # 'paid', 'failed'
    invoice_pdf_url = Column(String(512), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
