import uuid
import math
from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from database import get_db
from models import Article
from schemas import ArticleCreate, ArticleOut, ArticleUpdate, PaginatedArticles
from auth import require_auth

router = APIRouter(prefix="/api/articles", tags=["articles"])


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


@router.get("", response_model=PaginatedArticles)
def list_articles(
    category: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    per_page: int = Query(6, ge=1, le=50),
    db: Session = Depends(get_db),
):
    q = db.query(Article).filter(Article.status == "published")
    if category and category != "Semua":
        q = q.filter(Article.category == category)
    total = q.count()
    pages = max(1, math.ceil(total / per_page))
    items = q.order_by(Article.published_at.desc()).offset((page - 1) * per_page).limit(per_page).all()
    return {"items": items, "total": total, "page": page, "per_page": per_page, "pages": pages}


@router.get("/admin/all", response_model=PaginatedArticles, dependencies=[Depends(require_auth)])
def list_all_articles(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """Admin: list all articles including drafts."""
    q = db.query(Article)
    total = q.count()
    pages = max(1, math.ceil(total / per_page))
    items = q.order_by(Article.created_at.desc()).offset((page - 1) * per_page).limit(per_page).all()
    return {"items": items, "total": total, "page": page, "per_page": per_page, "pages": pages}


@router.get("/{slug}", response_model=ArticleOut)
def get_article(slug: str, db: Session = Depends(get_db)):
    article = db.query(Article).filter(
        Article.slug == slug, Article.status == "published"
    ).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article


@router.get("/admin/{article_id}", response_model=ArticleOut, dependencies=[Depends(require_auth)])
def get_article_by_id(article_id: str, db: Session = Depends(get_db)):
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article


@router.post("", response_model=ArticleOut, dependencies=[Depends(require_auth)])
def create_article(data: ArticleCreate, db: Session = Depends(get_db)):
    existing = db.query(Article).filter(Article.slug == data.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")
    article = Article(
        id=str(uuid.uuid4()),
        created_at=now_iso(),
        **data.model_dump(),
    )
    db.add(article)
    db.commit()
    db.refresh(article)
    return article


@router.put("/{article_id}", response_model=ArticleOut, dependencies=[Depends(require_auth)])
def update_article(article_id: str, data: ArticleUpdate, db: Session = Depends(get_db)):
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(article, field, value)
    article.updated_at = now_iso()
    db.commit()
    db.refresh(article)
    return article


@router.delete("/{article_id}", dependencies=[Depends(require_auth)])
def delete_article(article_id: str, db: Session = Depends(get_db)):
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    db.delete(article)
    db.commit()
    return {"ok": True}
