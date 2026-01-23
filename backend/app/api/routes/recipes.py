from typing import Optional
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.models.ingredient import Ingredient
from app.models.recipe import Recipe
from app.schemas.recipe import RecipeCreate, RecipeResponse
from app.services.audio_chunker import chunk_audio
from app.services.ocr import extract_text_from_image
from app.services.recipe_parser import parse_recipe_from_text
from app.services.transcription_online_chunked import transcribe
from app.services.youtube_audio import download_youtube_audio

router = APIRouter()


@router.post("/import", response_model=RecipeResponse)
async def ingest_recipe(
        recipe: RecipeCreate = Depends(RecipeCreate.as_form),
        image: Optional[UploadFile] = File(None),
        db: Session = Depends(get_db)):
    """
    Import a recipe from either:
    - an uploaded image (cookbook screenshot)
    - a source URL (YouTube / social media / recipe site)
    """

    if not image and not recipe.source_url:
        raise HTTPException(
            status_code=400,
            detail="Provide either an image or a source URL"
        )

    if image:
        try:
            raw_text = await extract_text_from_image(image)
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Failed to extract image content: {str(e)}",
            )
        parsed = parse_recipe_from_text(raw_text)
        title = parsed["title"]
        ingredients = parsed["ingredients"]
        steps = parsed["steps"]
        source_url = None
    else:
        try:
            audio_path = download_youtube_audio(recipe.source_url)
            chunk_paths = chunk_audio(audio_path)
            raw_text = transcribe(chunk_paths)
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Failed to extract video content: {str(e)}",
            )
        parsed = parse_recipe_from_text(raw_text)
        title = parsed["title"]
        ingredients = parsed["ingredients"]
        steps = parsed["steps"]
        source_url = recipe.source_url

    db_recipe = Recipe(
        title=title,
        source_url=source_url,
        cook_time=30,
        servings=2,
        steps="\n".join(steps)
    )

    db.add(db_recipe)
    db.flush()  # get recipe.id without committing

    db_ingredients = [
        Ingredient(
            name=ingredient,
            recipe_id=db_recipe.id
        )
        for ingredient in ingredients
    ]

    db.add_all(db_ingredients)
    db.commit()

    db.refresh(db_recipe)

    return RecipeResponse(
        id=db_recipe.id,
        title=title,
        ingredients=ingredients,
        steps=steps,
        source_url=source_url,
        cook_time=30,
        servings=2
    )
