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

    class Config:
        from_attributes = True


class RecipeListItem(BaseModel):
    id: int
    title: str

    class Config:
        from_attributes = True


class RecipeDetail(BaseModel):
    id: int
    title: str
    ingredients: List[str]
    steps: List[str]

    class Config:
        from_attributes = True

class RecipeImportResponse(BaseModel):
    status: str
    error: Optional[str] = None
    import_id:Optional[str] = None
    recipe: Optional[RecipeDetail] = None

    class Config:
        from_attributes = True