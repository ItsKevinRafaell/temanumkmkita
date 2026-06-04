import uuid
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models import ContentTopic
from app.schemas import TopicCreate, TopicOut, TopicUpdate
from app.core.security import require_auth
from app.core.utils import now_iso

router = APIRouter(prefix="/api/topics", tags=["topics"])


@router.get("", response_model=list[TopicOut], dependencies=[Depends(require_auth)])
def list_topics(
    pillar_id: str | None = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(ContentTopic)
    if pillar_id:
        q = q.filter(ContentTopic.pillar_id == pillar_id)
    return q.order_by(ContentTopic.created_at.asc()).all()


@router.post("", response_model=TopicOut, dependencies=[Depends(require_auth)])
def create_topic(data: TopicCreate, db: Session = Depends(get_db)):
    topic = ContentTopic(
        id=str(uuid.uuid4()),
        created_at=now_iso(),
        position_x=0,
        position_y=0,
        **data.model_dump(),
    )
    db.add(topic)
    db.commit()
    db.refresh(topic)
    return topic


@router.put("/{topic_id}", response_model=TopicOut, dependencies=[Depends(require_auth)])
def update_topic(topic_id: str, data: TopicUpdate, db: Session = Depends(get_db)):
    topic = db.query(ContentTopic).filter(ContentTopic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(topic, field, value)
    db.commit()
    db.refresh(topic)
    return topic


@router.delete("/{topic_id}", dependencies=[Depends(require_auth)])
def delete_topic(topic_id: str, db: Session = Depends(get_db)):
    topic = db.query(ContentTopic).filter(ContentTopic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    db.delete(topic)
    db.commit()
    return {"ok": True}
