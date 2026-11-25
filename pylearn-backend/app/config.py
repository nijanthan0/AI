import os

class Settings:
    PROJECT_NAME: str = "PyLearn Cloud API"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"

    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")

    # Database: Async SQLite for local dev, PostgreSQL for production
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "sqlite+aiosqlite:///./pylearn.db"
    )

    # JWT Authentication (Compatible with Supabase Auth or custom JWT)
    # If using Supabase, paste your project's JWT Secret here
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "pylearn-super-secret-jwt-key-change-in-production-32chars")
    JWT_ALGORITHM: str = "HS256"

    # Pricing Plans (in INR or USD cents)
    MONTHLY_PRICE_INR: int = 499    # ₹499/month
    ANNUAL_PRICE_INR: int = 3999    # ₹3,999/year (Save ~35%)

    # Payment Gateway Keys (Stripe / Razorpay)
    STRIPE_SECRET_KEY: str = os.getenv("STRIPE_SECRET_KEY", "")
    STRIPE_WEBHOOK_SECRET: str = os.getenv("STRIPE_WEBHOOK_SECRET", "")
    
    RAZORPAY_KEY_ID: str = os.getenv("RAZORPAY_KEY_ID", "")
    RAZORPAY_KEY_SECRET: str = os.getenv("RAZORPAY_KEY_SECRET", "")
    RAZORPAY_WEBHOOK_SECRET: str = os.getenv("RAZORPAY_WEBHOOK_SECRET", "")

settings = Settings()
