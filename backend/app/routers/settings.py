from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models import SiteSettings
from app.schemas import SiteSettingsOut, SiteSettingsUpdate
from app.core.security import require_auth
from app.core.config import SETTINGS_ID
from app.core.utils import now_iso

router = APIRouter(prefix="/api/settings", tags=["settings"])


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
