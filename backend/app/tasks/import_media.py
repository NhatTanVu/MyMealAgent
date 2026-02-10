from app.celery_app import celery_app
from app.db.session import SessionLocal
from app.models.user import User
from app.models.imports import Import
from app.services.media_import import run_import


@celery_app.task(bind=True)
def import_media(self, import_id: str):
    db = SessionLocal()
    try:
        imp = db.query(Import).get(import_id)
        if not imp:
            return

        imp.status = "processing"
        db.commit()

        recipe_id = run_import(imp, db)  # yt-dlp / file / OCR logic

        imp.status = "completed"
        imp.recipe_id = recipe_id
        db.commit()

    except Exception as e:
        imp.status = "failed"
        imp.error = str(e)
        db.commit()

    finally:
        db.close()
