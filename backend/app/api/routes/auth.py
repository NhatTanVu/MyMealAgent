# app/api/routes/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.core.config import settings
from app.models.user import User
from app.schemas.auth import RegisterIn, LoginIn, TokenOut, GoogleLoginIn, AppleLoginIn
from app.auth.security import hash_password, verify_password, create_access_token
from app.auth.google import verify_google_id_token
from app.auth.apple import verify_app_identity_token
import os

router = APIRouter()


@router.post("/register", response_model=TokenOut)
def register(data: RegisterIn, db: Session = Depends(get_db)):
    if db.query(User).filter(User.username == data.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")

    if data.email and db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already in use")

    user = User(
        username=data.username,
        email=data.email,
        password_hash=hash_password(data.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return TokenOut(access_token=create_access_token(str(user.id)))


@router.post("/login", response_model=TokenOut)
def login(data: LoginIn, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username).first()
    if not user or not user.password_hash or not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    return TokenOut(access_token=create_access_token(str(user.id)))


@router.post("/google", response_model=TokenOut)
def google_login(data: GoogleLoginIn, db: Session = Depends(get_db)):
    payload = verify_google_id_token(data.id_token)
    sub = payload.get("sub")
    email = payload.get("email")

    if not sub:
        raise HTTPException(401, "Invalid Google token")

    user = db.query(User).filter(User.google_sub == sub).first()
    if not user:
        # link by email if exists
        if email:
            user = db.query(User).filter(User.email == email).first()
        if user:
            user.google_sub = sub
        else:
            user = User(email=email, google_sub=sub)

        db.add(user)
        db.commit()
        db.refresh(user)

    return TokenOut(access_token=create_access_token(str(user.id)))


@router.post("/apple", response_model=TokenOut)
def apple_login(data: AppleLoginIn, db: Session = Depends(get_db)):
    aud = settings.apple_aud
    if not aud:
        raise RuntimeError("APPLE_AUD is not set")

    payload = verify_app_identity_token(
        data.identity_token, expected_aud=aud)
    sub = payload.get("sub")
    email = payload.get("email")  # sometimes only on first consent

    if not sub:
        raise HTTPException(401, "Invalid Apple token")

    user = db.query(User).filter(User.apple_sub == sub).first()
    if not user:
        # link by email if exists
        if email:
            user = db.query(User).filter(User.email == email).first()
        if user:
            user.apple_sub = sub
        else:
            user = User(email=email, apple_sub=sub)

        db.add(user)
        db.commit()
        db.refresh(user)

    return TokenOut(access_token=create_access_token(str(user.id)))
