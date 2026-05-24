import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
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


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None


@router.put("/{category_id}", response_model=ArticleCategoryOut, dependencies=[Depends(require_auth)])
def update_category(category_id: str, data: CategoryUpdate, db: Session = Depends(get_db)):
    cat = db.query(ArticleCategory).filter(ArticleCategory.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    if data.slug:
        conflict = db.query(ArticleCategory).filter(
            ArticleCategory.slug == data.slug,
            ArticleCategory.id != category_id,
        ).first()
        if conflict:
            raise HTTPException(status_code=400, detail="Slug already exists")
    if data.name is not None:
        cat.name = data.name
    if data.slug is not None:
        cat.slug = data.slug
    db.commit()
    db.refresh(cat)
    return cat


@router.delete("/{category_id}", status_code=204, dependencies=[Depends(require_auth)])
def delete_category(category_id: str, db: Session = Depends(get_db)):
    cat = db.query(ArticleCategory).filter(ArticleCategory.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    db.delete(cat)
    db.commit()
