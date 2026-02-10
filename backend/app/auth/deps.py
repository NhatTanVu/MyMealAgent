from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.core.config import settings
from app.models.user import User
from jose import jwt, JWTError

bearer = HTTPBearer()


def get_current_user(
    cred: HTTPAuthorizationCredentials = Depends(bearer),
    db: Session = Depends(get_db)
) -> User:
    try:
        payload = jwt.decode(
            cred.credentials, settings.jwt_secret, algorithms=[settings.jwt_alg])
        user_id = (int)(payload.get("sub"))
        if not user_id:
            raise HTTPException(401, "Invalid token")
    except JWTError:
        raise HTTPException(401, "Invalid token")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(401, "User not found")
    return user
