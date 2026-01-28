from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship
from app.db.base import Base


class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    source_url = Column(String, nullable=True)
    cook_time = Column(Integer)  # minutes
    servings = Column(Integer)
    steps = Column(Text)

    ingredients = relationship(
        "Ingredient",
        backref="recipe",
        cascade="all, delete-orphan"
    )

    # computed property (IMPORTANT)
    def steps_list(self) -> list[str]:
        if not self.steps:
            return []
        return [s.strip() for s in self.steps.split("\n") if s.strip()]
