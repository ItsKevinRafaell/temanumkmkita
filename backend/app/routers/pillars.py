import uuid
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models import ContentPillar
from app.schemas import PillarCreate, PillarOut, PillarUpdate
from app.core.security import require_auth
from app.core.utils import now_iso

router = APIRouter(prefix="/api/pillars", tags=["pillars"])


@router.get("", response_model=list[PillarOut], dependencies=[Depends(require_auth)])
def list_pillars(db: Session = Depends(get_db)):
    return db.query(ContentPillar).order_by(ContentPillar.created_at.asc()).all()


@router.post("", response_model=PillarOut, dependencies=[Depends(require_auth)])
def create_pillar(data: PillarCreate, db: Session = Depends(get_db)):
    pillar = ContentPillar(
        id=str(uuid.uuid4()),
        created_at=now_iso(),
        position_x=0,
        position_y=0,
        **data.model_dump(),
    )
    db.add(pillar)
    db.commit()
    db.refresh(pillar)
    return pillar


@router.put("/{pillar_id}", response_model=PillarOut, dependencies=[Depends(require_auth)])
def update_pillar(pillar_id: str, data: PillarUpdate, db: Session = Depends(get_db)):
    pillar = db.query(ContentPillar).filter(ContentPillar.id == pillar_id).first()
    if not pillar:
        raise HTTPException(status_code=404, detail="Pillar not found")
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(pillar, field, value)
    db.commit()
    db.refresh(pillar)
    return pillar


@router.delete("/{pillar_id}", dependencies=[Depends(require_auth)])
def delete_pillar(pillar_id: str, db: Session = Depends(get_db)):
    pillar = db.query(ContentPillar).filter(ContentPillar.id == pillar_id).first()
    if not pillar:
        raise HTTPException(status_code=404, detail="Pillar not found")
    db.delete(pillar)
    db.commit()
    return {"ok": True}
