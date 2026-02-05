from fastapi import UploadFile
from typing import List, Optional
from urllib.parse import urlparse
import uuid
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.db.session import SessionLocal
from app.models.imports import Import
from app.models.ingredient import Ingredient
from app.models.recipe import Recipe
from app.schemas.recipe import RecipeCreate, RecipeDetail, RecipeImportResponse, RecipeListItem, RecipeResponse
from app.services.audio_chunker import chunk_audio
from app.services.blob_storage import container_client
from app.services.ocr import extract_text_from_image
from app.services.recipe_parser import parse_recipe_from_text
from app.services.transcription_online_chunked import transcribe
from app.services.youtube_audio import download_audio
from app.tasks.import_media import import_media

router = APIRouter()


@router.get("/", response_model=List[RecipeListItem])
def get_recipes(db: Session = Depends(get_db)):
    """
    Return all recipes
    """
    recipes = db.query(Recipe).order_by(Recipe.id.desc()).all()
    return recipes


def build_recipe_detail(recipe: Recipe) -> RecipeDetail:
    return RecipeDetail(
        id=recipe.id,
        title=recipe.title,
        ingredients=[i.name for i in recipe.ingredients],
        steps=recipe.steps_list(),
    )


@router.get("/{id}", response_model=RecipeDetail)
def get_recipe(id: int, db: Session = Depends(get_db)):
    """
    Return a single recipe by ID.
    """
    recipe = db.query(Recipe).filter(Recipe.id == id).first()

    if not recipe:
        raise HTTPException(
            status_code=404,
            detail="Recipe not found"
        )

    return build_recipe_detail(recipe)


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
            audio_path = download_audio(recipe.source_url)
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
        steps="\n".join(steps),
        raw=raw_text
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

    return RecipeResponse(
        id=db_recipe.id,
        title=title,
        ingredients=[i["raw"] for i in ingredients],
        steps=steps,
        source_url=source_url,
        cook_time=30,
        servings=2
    )


def detect_provider(url):
    if not url:
        return "unknown"

    try:
        host = urlparse(url).netloc.lower()
    except Exception:
        return "unknown"

    if host.startswith("www."):
        host = host[4:]

    # TikTok
    if (
        "tiktok.com" in host
        or "vm.tiktok.com" in host
        or "m.tiktok.com" in host
    ):
        return "tiktok"

    # Dailymotion
    if "dailymotion.com" in host or "dai.ly" in host:
        return "dailymotion"

    # YouTube
    if (
        "youtube.com" in host
        or "youtu.be" in host
        or "m.youtube.com" in host
    ):
        return "youtube"

    # Instagram
    if "instagram.com" in host:
        return "instagram"

    return "unknown"


def upload_uploadfile_to_blob(file: UploadFile, prefix="uploads") -> str:
    ext = file.filename.split(".")[-1]
    blob_name = f"{prefix}/{uuid.uuid4()}.{ext}"
    container_client.upload_blob(
        name=blob_name,
        data=file.file,
        overwrite=True
    )
    return container_client.get_blob_client(blob_name).url


@router.post("/imports", response_model=RecipeImportResponse)
async def start_import(
        recipe: RecipeCreate = Depends(RecipeCreate.as_form),
        image: Optional[UploadFile] = File(None),
        db: Session = Depends(get_db)):
    if not image and not recipe.source_url:
        raise HTTPException(
            status_code=400,
            detail="Provide either an image or a source URL"
        )

    if recipe.source_url:
        provider = detect_provider(recipe.source_url)
        if (provider in ["unknown", "youtube", "instagram"]):
            return RecipeImportResponse(
                status="failed",
                error="URL is not supported"
            )

    import_id = str(uuid.uuid4())
    imp = Import(
        id=import_id,
        source_type="url" if recipe.source_url else "file",
        source_url=recipe.source_url if recipe.source_url else
        upload_uploadfile_to_blob(image),
        provider=detect_provider(recipe.source_url),
        status="queued",
    )
    db.add(imp)
    db.commit()
    db.close()

    import_media.delay(import_id)

    return RecipeImportResponse(
        import_id=import_id,
        status="queued"
    )


@router.get("/imports/{import_id}/status", response_model=RecipeImportResponse)
def get_status(
        import_id: str,
        db: Session = Depends(get_db)):
    imp = db.query(Import).get(import_id)

    if not imp:
        raise HTTPException(
            status_code=404,
            detail="Import not found"
        )

    if imp.status != "completed":
        return RecipeImportResponse(
            import_id=imp.id,
            status=imp.status,
            error=imp.error
        )

    return RecipeImportResponse(
        import_id=imp.id,
        status=imp.status,
        recipe=get_recipe(imp.recipe_id, db)
    )
