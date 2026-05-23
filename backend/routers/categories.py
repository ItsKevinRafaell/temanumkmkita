import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import ArticleCategory
from schemas import ArticleCategoryBase, ArticleCategoryOut
from auth import require_auth

router = APIRouter(prefix="/api/categories", tags=["categories"])


@router.get("", response_model=list[ArticleCategoryOut])
def list_categories(db: Session = Depends(get_db)):
    return db.query(ArticleCategory).all()


@router.post("", response_model=ArticleCategoryOut, dependencies=[Depends(require_auth)])
def create_category(data: ArticleCategoryBase, db: Session = Depends(get_db)):
    existing = db.query(ArticleCategory).filter(ArticleCategory.slug == data.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")
    category = ArticleCategory(id=str(uuid.uuid4()), **data.model_dump())
    db.add(category)
    db.commit()
    db.refresh(category)
    return category
