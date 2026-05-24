from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import SiteSettings
from schemas import SiteSettingsOut, SiteSettingsUpdate
from auth import require_auth

router = APIRouter(prefix="/api/settings", tags=["settings"])

SETTINGS_ID = "1"


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


@router.get("", response_model=SiteSettingsOut)
def get_settings(db: Session = Depends(get_db)):
    row = db.query(SiteSettings).filter(SiteSettings.id == SETTINGS_ID).first()
    if not row:
        row = SiteSettings(id=SETTINGS_ID)
        db.add(row)
        db.commit()
        db.refresh(row)
    return row


@router.put("", response_model=SiteSettingsOut, dependencies=[Depends(require_auth)])
def update_settings(data: SiteSettingsUpdate, db: Session = Depends(get_db)):
    row = db.query(SiteSettings).filter(SiteSettings.id == SETTINGS_ID).first()
    if not row:
        row = SiteSettings(id=SETTINGS_ID)
        db.add(row)
    for field, value in data.model_dump(exclude_none=False).items():
        setattr(row, field, value)
    row.updated_at = now_iso()
    db.commit()
    db.refresh(row)
    return row
