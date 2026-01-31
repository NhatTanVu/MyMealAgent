from sqlalchemy import Column, Float, Integer, String, ForeignKey
from app.db.base import Base

class Ingredient(Base):
    __tablename__ = "ingredients"

    id = Column(Integer,  primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    raw = Column(String, nullable=False)
    amount = Column (Float, nullable=True)
    unit = Column(String, nullable=True)
    recipe_id = Column(
        Integer, 
        ForeignKey("recipes.id", ondelete="CASCADE"),
        nullable=False,
    )