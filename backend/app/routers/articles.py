import uuid
import math
import hashlib
from fastapi import APIRouter, Depends, HTTPException, Query, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy import func
from sqlalchemy.orm import Session, selectinload

from app.core.database import get_db
from app.models import Article, IntegrationToken
from app.schemas import ArticleCreate, ArticleOut, ArticleUpdate, ArticleSummaryOut, PaginatedArticles, AdminPaginatedArticles
from app.core.security import require_auth, decode_token
from app.core.utils import now_iso

router = APIRouter(prefix="/api/articles", tags=["articles"])
_bearer = HTTPBearer()


def require_auth_or_token(
    credentials: HTTPAuthorizationCredentials = Security(_bearer),
    db: Session = Depends(get_db),
) -> str:
    bearer = credentials.credentials
    try:
        return decode_token(bearer)
    except HTTPException:
        pass
    token_hash = hashlib.sha256(bearer.encode()).hexdigest()
    row = db.query(IntegrationToken).filter(IntegrationToken.token_hash == token_hash).first()
    if row:
        return "integration"
    raise HTTPException(status_code=401, detail="Invalid or expired token")


@router.get("", response_model=PaginatedArticles)
def list_articles(
    category: str | None = Query(None),
    author_id: str | None = Query(None),
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
    items = q.options(selectinload(Article.author)).order_by(Article.published_at.desc()).offset((page - 1) * per_page).limit(per_page).all()
    return {"items": items, "total": total, "page": page, "per_page": per_page, "pages": pages}


@router.get("/admin/all", response_model=AdminPaginatedArticles, dependencies=[Depends(require_auth)])
def list_all_articles(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=500),
    status: str | None = Query(None),
    year: str | None = Query(None),
    month: str | None = Query(None),
    date_from: str | None = Query(None),
    date_to: str | None = Query(None),
    sort: str = Query("desc"),
    db: Session = Depends(get_db),
):
    q = db.query(Article)
    editorial_date = func.coalesce(Article.published_at, Article.created_at)
    if status and status in ("draft", "published"):
        q = q.filter(Article.status == status)
    if month:
        q = q.filter(editorial_date.like(f"{month}%"))
    elif year:
        q = q.filter(editorial_date.like(f"{year}-%"))
    if date_from:
        q = q.filter(editorial_date >= f"{date_from}T00:00:00")
    if date_to:
        q = q.filter(editorial_date <= f"{date_to}T23:59:59")
    total = q.count()
    pages = max(1, math.ceil(total / per_page))
    order = editorial_date.asc() if sort == "asc" else editorial_date.desc()
    items = q.options(selectinload(Article.author)).order_by(order).offset((page - 1) * per_page).limit(per_page).all()
    return {"items": items, "total": total, "page": page, "per_page": per_page, "pages": pages}


@router.get("/{slug}", response_model=ArticleOut)
def get_article(slug: str, db: Session = Depends(get_db)):
    article = db.query(Article).options(selectinload(Article.author)).filter(
        Article.slug == slug, Article.status == "published"
    ).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article


@router.get("/admin/{article_id}", response_model=ArticleOut, dependencies=[Depends(require_auth)])
def get_article_by_id(article_id: str, db: Session = Depends(get_db)):
    article = db.query(Article).options(selectinload(Article.author)).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article


@router.post("", response_model=ArticleOut, dependencies=[Depends(require_auth_or_token)])
def create_article(data: ArticleCreate, db: Session = Depends(get_db)):
    existing = db.query(Article).filter(Article.slug == data.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")
    article = Article(id=str(uuid.uuid4()), created_at=now_iso(), **data.model_dump())
    db.add(article)
    db.commit()
    db.refresh(article)
    return article


@router.put("/{article_id}", response_model=ArticleOut, dependencies=[Depends(require_auth)])
def update_article(article_id: str, data: ArticleUpdate, db: Session = Depends(get_db)):
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    for field, value in data.model_dump(exclude_unset=True).items():
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
