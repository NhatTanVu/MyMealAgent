from pydantic import BaseModel
from typing import List, Optional

# Run-related schemas


class IngredientInput(BaseModel):
    name: str
    amount: Optional[float] = None
    unit: Optional[str] = None


class RunRequest(BaseModel):
    recipe_id: int
    ingredients: List[IngredientInput]


class IngredientOutput(BaseModel):
    name: str
    amount: Optional[float] = None
    unit: Optional[str] = None
    raw: str


class RunResponse(BaseModel):
    recipe_id: int
    title: str
    ingredients_have: List[IngredientOutput]
    ingredients_missing: List[IngredientOutput]
    steps: List[str]

# Plan-related schemas


class PlanRequest(BaseModel):
    ingredients: List[dict]
    time_available: int
    servings: int


class PlanCandidate(BaseModel):
    id: int
    title: str
    score_reason: str


class PlanResponse(BaseModel):
    candidates: List[PlanCandidate]
