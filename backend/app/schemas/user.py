from typing import Optional
from pydantic import BaseModel

class UserResponse(BaseModel):
    id: int
    email: str
    username: Optional[str]
    plan: str
    recipe_count: int

    class Config:
        from_attributes = True
