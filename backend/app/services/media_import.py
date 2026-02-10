from sqlalchemy.orm import Session

from app.models.imports import Import
from app.models.ingredient import Ingredient
from app.models.recipe import Recipe
from app.services.audio_chunker import chunk_audio
from app.services.ocr import extract_text_from_blob
from app.services.recipe_parser import parse_recipe_from_text
from app.services.transcription_online_chunked import transcribe
from app.services.youtube_audio import download_audio


def run_import(imp: Import, db: Session) -> int:
    if imp.source_type == "file":
        raw_text = extract_text_from_blob(imp.source_url)
        parsed = parse_recipe_from_text(raw_text)
        title = parsed["title"]
        ingredients = parsed["ingredients"]
        steps = parsed["steps"]
        source_url = None
    else:
        audio_path = download_audio(imp.source_url)
        chunk_paths = chunk_audio(audio_path)
        raw_text = transcribe(chunk_paths)
        parsed = parse_recipe_from_text(raw_text)
        title = parsed["title"]
        ingredients = parsed["ingredients"]
        steps = parsed["steps"]
        source_url = imp.source_url

    db_recipe = Recipe(
        title=title,
        source_url=source_url,
        cook_time=30,
        servings=2,
        steps="\n".join(steps),
        raw=raw_text,
        user_id=imp.user_id
    )

    db.add(db_recipe)
    db.flush()  # get recipe.id without committing

    db_ingredients = [
        Ingredient(
            raw=ingredient["raw"],
            name=ingredient["name"],
            amount=ingredient.get("amount"),
            unit=ingredient.get("unit"),
            recipe_id=db_recipe.id
        )
        for ingredient in ingredients
    ]

    db.add_all(db_ingredients)
    db.commit()

    db.refresh(db_recipe)

    return db_recipe.id
