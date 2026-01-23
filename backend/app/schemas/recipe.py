from fastapi import Form
from pydantic import BaseModel
from typing import List, Optional


class RecipeCreate(BaseModel):
    """
    Input model for importing a recipe.

    A recipe can come from:
    - an uploaded image (handled separately as a file)
    - a source URL (YouTube, social media, recipe site)
    """

    source_url: Optional[str] = None

    @classmethod
    def as_form(
        cls,
        source_url: Optional[str] = Form(None),
    ):
        return cls(source_url=source_url)


class RecipeResponse(BaseModel):
    id: int
    title: str
    ingredients: List[str]
    steps: List[str]
    cook_time: int
    servings: int
    source_url: Optional[str]
