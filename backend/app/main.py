from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import agent, recipes
from app.core.config import settings
from app.db.init_db import create_database_if_not_exists
from app.db.base import Base
from app.db.session import engine
# import models so SQLAlchemy sees them
from app.models import recipe, ingredient, user, meal_plan

app = FastAPI(
    title="MealAgent API",
    description="Backend service for the MealAgent agentic AI cooking app",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(agent.router, prefix="/agent", tags=["Agent"])
app.include_router(recipes.router, prefix="/recipes", tags=["Recipes"])

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Welcome to MealAgent API"}


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

# create_database_if_not_exists()
# Base.metadata.create_all(bind=engine)