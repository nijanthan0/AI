from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from typing import Optional, Dict, Any
from app.config import settings

security = HTTPBearer(auto_error=False)

async def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> Optional[Dict[str, Any]]:
    """Extracts user information from JWT token if present, returns None if anonymous."""
    if not credentials:
        return None
    
    token = credentials.credentials

    # Development fallback for instant testing without cloud keys
    if settings.ENVIRONMENT == "development" and token.startswith("mock_"):
        user_id = token.replace("mock_", "")
        return {
            "sub": user_id,
            "id": user_id,
            "email": f"{user_id}@example.com",
            "name": f"Developer ({user_id})",
            "is_dev": True
        }

    try:
        # Standard Supabase or custom HS256 JWT decoding
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
            options={"verify_aud": False}
        )
        # Normalize subject ID
        payload["id"] = payload.get("sub") or payload.get("id")
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session token has expired. Please log in again."
        )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token."
        )

async def get_current_user(
    user: Optional[Dict[str, Any]] = Depends(get_current_user_optional)
) -> Dict[str, Any]:
    """Requires user to be logged in."""
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please log in or sign up to continue."
        )
    return user
