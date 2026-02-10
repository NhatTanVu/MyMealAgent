from sqlalchemy import Boolean, Column, DateTime, Integer, String, UniqueConstraint, func
from app.db.base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, nullable=True, index=True)
    password_hash = Column(String, nullable=True)

    google_sub = Column(String, nullable=True, index=True)
    apple_sub = Column(String, nullable=True, index=True)

    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        UniqueConstraint("email", name="uq_users_email"),
        UniqueConstraint("username", name="uq_users_username"),
        UniqueConstraint("google_sub", name="uq_users_google_sub"),
        UniqueConstraint("apple_sub", name="uq_users_apple_sub"),
    )