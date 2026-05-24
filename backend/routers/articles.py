import uuid
import math
import hashlib
from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from database import get_db
from models import Article, Author, IntegrationToken
from schemas import ArticleCreate, ArticleOut, ArticleUpdate, PaginatedArticles
from auth import require_auth, decode_token

router = APIRouter(prefix="/api/articles", tags=["articles"])

_bearer = HTTPBearer()


def require_auth_or_token(
    credentials: HTTPAuthorizationCredentials = Security(_bearer),
    db: Session = Depends(get_db),
) -> str:
    """Accept either a valid JWT Bearer token or a valid integration token."""
    bearer = credentials.credentials

    # 1. Try JWT first
    try:
        return decode_token(bearer)
    except HTTPException:
        pass

    # 2. Try integration token
    token_hash = hashlib.sha256(bearer.encode()).hexdigest()
    row = db.query(IntegrationToken).filter(IntegrationToken.token_hash == token_hash).first()
    if row:
        return "integration"

    raise HTTPException(status_code=401, detail="Invalid or expired token")


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


@router.get("", response_model=PaginatedArticles)
def list_articles(
    category: Optional[str] = Query(None),
    author_id: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    per_page: int = Query(6, ge=1, le=50),
    db: Session = Depends(get_db),
):
    q = db.query(Article).filter(Article.status == "published")
    if category and category != "Semua":
        q = q.filter(Article.category == category)
    if author_id:
        q = q.filter(Article.author_id == author_id)
    total = q.count()
    pages = max(1, math.ceil(total / per_page))
    items = q.order_by(Article.published_at.desc()).offset((page - 1) * per_page).limit(per_page).all()
    for item in items:
        if item.author_id:
            item.author = db.query(Author).filter(Author.id == item.author_id).first()
    return {"items": items, "total": total, "page": page, "per_page": per_page, "pages": pages}


@router.get("/admin/all", response_model=PaginatedArticles, dependencies=[Depends(require_auth)])
def list_all_articles(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=500),
    status: Optional[str] = Query(None),
    month: Optional[str] = Query(None),  # YYYY-MM
    sort: str = Query("desc"),
    db: Session = Depends(get_db),
):
    """Admin: list all articles including drafts."""
    q = db.query(Article)
    if status and status in ("draft", "published"):
        q = q.filter(Article.status == status)
    if month:
        q = q.filter(Article.created_at.like(f"{month}%"))
    total = q.count()
    pages = max(1, math.ceil(total / per_page))
    order = Article.created_at.asc() if sort == "asc" else Article.created_at.desc()
    items = q.order_by(order).offset((page - 1) * per_page).limit(per_page).all()
    return {"items": items, "total": total, "page": page, "per_page": per_page, "pages": pages}


@router.get("/{slug}", response_model=ArticleOut)
def get_article(slug: str, db: Session = Depends(get_db)):
    article = db.query(Article).filter(
        Article.slug == slug, Article.status == "published"
    ).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    if article.author_id:
        article.author = db.query(Author).filter(Author.id == article.author_id).first()
    return article


@router.get("/admin/{article_id}", response_model=ArticleOut, dependencies=[Depends(require_auth)])
def get_article_by_id(article_id: str, db: Session = Depends(get_db)):
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article


@router.post("", response_model=ArticleOut, dependencies=[Depends(require_auth_or_token)])
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
