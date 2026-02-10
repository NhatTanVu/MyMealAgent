import datetime
import hashlib
from passlib.context import CryptContext
from jose import jwt

from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    digest = hashlib.sha256(password.encode("utf-8")).hexdigest()
    return pwd_context.hash(digest)


def verify_password(password: str, password_hash: str) -> bool:
    digest = hashlib.sha256(password.encode("utf-8")).hexdigest()
    return pwd_context.verify(digest, password_hash)


def create_access_token(sub: str) -> str:
    exp = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=settings.jwt_expires_min)
    payload = {"sub": sub, "exp": exp}
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_alg)
