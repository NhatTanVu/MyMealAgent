from typing import Optional
from pydantic import BaseModel, EmailStr


class RegisterIn(BaseModel):
    username: str
    password: str
    email: Optional[EmailStr] = None

class LoginIn(BaseModel):
    username: str
    password: str

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"

class GoogleLoginIn(BaseModel):
    id_token: str # from Expo Google Sign-In

class AppleLoginIn(BaseModel):
    identity_token: str # JWT string from Apple