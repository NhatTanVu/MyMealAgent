
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.user import User

router = APIRouter(prefix="/webhooks", tags=["webhooks"])

@router.post("/revenuecat")
def revenuecat_webhook(payload: dict, db: Session = Depends(get_db)):
    event = payload.get("event")
    # RevenueCat sends app_user_id as string
    user_id = event.get("app_user_id")

    if not user_id:
        return {"ok": True}

    user = db.get(User, int(user_id))
    if not user:
        return {"ok": True}

    event_type = event.get("type")

    if event_type in ("INITIAL_PURCHASE", "RENEWAL"):
        user.plan = "Premium"

    elif event_type in ("CANCELLATION", "EXPIRATION"):
        user.plan = "Free"

    db.commit()

    return {"ok": True}
