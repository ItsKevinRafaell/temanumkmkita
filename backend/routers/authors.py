import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Author
from schemas import AuthorCreate, AuthorUpdate, AuthorOut
from auth import require_auth

router = APIRouter(prefix="/api/authors", tags=["authors"])


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


@router.get("", response_model=list[AuthorOut])
def list_authors(db: Session = Depends(get_db)):
    return db.query(Author).order_by(Author.name).all()


@router.get("/{author_id}", response_model=AuthorOut)
def get_author(author_id: str, db: Session = Depends(get_db)):
    author = db.query(Author).filter(Author.id == author_id).first()
    if not author:
        raise HTTPException(status_code=404, detail="Author not found")
    return author


@router.get("/by-slug/{slug}", response_model=AuthorOut)
def get_author_by_slug(slug: str, db: Session = Depends(get_db)):
    author = db.query(Author).filter(Author.slug == slug).first()
    if not author:
        raise HTTPException(status_code=404, detail="Author not found")
    return author


@router.post("", response_model=AuthorOut, dependencies=[Depends(require_auth)])
def create_author(data: AuthorCreate, db: Session = Depends(get_db)):
    existing = db.query(Author).filter(Author.slug == data.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")
    author = Author(id=str(uuid.uuid4()), created_at=now_iso(), **data.model_dump())
    db.add(author)
    db.commit()
    db.refresh(author)
    return author


@router.put("/{author_id}", response_model=AuthorOut, dependencies=[Depends(require_auth)])
def update_author(author_id: str, data: AuthorUpdate, db: Session = Depends(get_db)):
    author = db.query(Author).filter(Author.id == author_id).first()
    if not author:
        raise HTTPException(status_code=404, detail="Author not found")
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(author, field, value)
    db.commit()
    db.refresh(author)
    return author


@router.delete("/{author_id}", dependencies=[Depends(require_auth)])
def delete_author(author_id: str, db: Session = Depends(get_db)):
    author = db.query(Author).filter(Author.id == author_id).first()
    if not author:
        raise HTTPException(status_code=404, detail="Author not found")
    db.delete(author)
    db.commit()
    return {"ok": True}
