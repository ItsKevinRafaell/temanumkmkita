import uuid
import math
import hashlib
import os
from datetime import datetime, timezone
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy import func
from sqlalchemy.orm import Session, selectinload

from app.core.database import get_db
from app.core.index_pinger import (
    ping_after_publish,
    ping_transactional,
    transactional_urls,
)
from app.core.utils import now_iso
from app.models import Article, IntegrationToken
from app.schemas import ArticleCreate, ArticleOut, ArticleUpdate, ArticleSummaryOut, PaginatedArticles, AdminPaginatedArticles, BulkPublishIn, BulkPublishOut, BulkReindexIn, BulkReindexOut, BulkReindexResult
from app.core.security import require_auth, decode_token

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
def update_article(
    article_id: str,
    data: ArticleUpdate,
    background: BackgroundTasks,
    db: Session = Depends(get_db),
):
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    was_draft = article.status == "draft"
    new_status = data.status or article.status
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(article, field, value)
    article.updated_at = now_iso()
    db.commit()
    db.refresh(article)

    # Trigger search engine ping kalau baru transisi ke published.
    if was_draft and new_status == "published":
        site_url = os.getenv("FRONTEND_URL", "https://www.temanumkmkita.com").rstrip("/")
        url = f"{site_url}/blog/{article.slug}"
        background.add_task(ping_after_publish, [url])

    return article


@router.post("/admin/bulk-publish", response_model=BulkPublishOut, dependencies=[Depends(require_auth)])
def bulk_publish(payload: BulkPublishIn, background: BackgroundTasks, db: Session = Depends(get_db)):
    """Publish multiple drafts sekaligus, trigger sitemap ping sekali."""
    published: list[str] = []
    skipped: list[str] = []
    urls: list[str] = []
    site_url = os.getenv("FRONTEND_URL", "https://www.temanumkmkita.com").rstrip("/")

    for aid in payload.article_ids:
        article = db.query(Article).filter(Article.id == aid).first()
        if not article:
            skipped.append(aid)
            continue
        if article.status == "published":
            skipped.append(aid)
            continue
        article.status = "published"
        if not article.published_at:
            article.published_at = now_iso()
        article.updated_at = now_iso()
        published.append(article.slug)
        urls.append(f"{site_url}/blog/{article.slug}")

    db.commit()
    if urls:
        background.add_task(ping_after_publish, urls)

    return BulkPublishOut(
        published=published,
        skipped=skipped,
        ping_triggered=bool(urls),
    )


@router.delete("/{article_id}", dependencies=[Depends(require_auth)])
def delete_article(article_id: str, db: Session = Depends(get_db)):
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    db.delete(article)
    db.commit()
    return {"ok": True}


@router.post("/admin/index-transactional", dependencies=[Depends(require_auth)])
async def submit_transactional_urls():
    """Submit halaman ber-CTA ke Google + Bing + IndexNow sekaligus.

    Dipakai setelah deploy page baru atau untuk force re-index halaman utama.
    Quota Google Indexing: 200/hari (aman untuk 11 URL ini).
    """
    urls = transactional_urls()
    result = await ping_transactional()
    return {
        "urls": urls,
        "count": len(urls),
        "result": result,
    }


@router.post("/admin/bulk-reindex", response_model=BulkReindexOut, dependencies=[Depends(require_auth)])
async def bulk_reindex(payload: BulkReindexIn, db: Session = Depends(get_db)):
    """Bulk re-index artikel published.

    Body opsional:
      - article_ids: list ID spesifik. Kalau None → semua published.
      - batch_size: max URL per call (default 100, hard-cap 200 = Google quota harian).
      - sync: True → tunggu hasil Google per URL lalu return detail.
              False (default) → fire-and-forget sitemap+IndexNow, return ringkas.

    Google Indexing API SELALU dijalankan sync (entah via sync atau background)
    karena lib googleapiclient bawaan cuma support sync call. Kalau sync=False,
    tetap dikembalikan jumlah total + status singkat.

    Quota Google Indexing: 200/hari. Untuk 122 artikel → batch_size=100 aman,
    batch kedua (22) bisa langsung tanpa nunggu besok.
    """
    batch_size = min(payload.batch_size or 100, 200)
    site_url = os.getenv("FRONTEND_URL", "https://www.temanumkmkita.com").rstrip("/")

    if payload.article_ids:
        articles = db.query(Article).filter(Article.id.in_(payload.article_ids)).all()
        articles = [a for a in articles if a.status == "published"]
    else:
        articles = db.query(Article).filter(Article.status == "published").all()

    urls = [f"{site_url}/blog/{a.slug}" for a in articles]

    if not urls:
        return BulkReindexOut(
            total=0, submitted=0, succeeded=0, failed=0,
            results=[], skipped_reason="no-published-articles",
        )

    if len(urls) > batch_size:
        urls = urls[:batch_size]

    # Sitemap ping + IndexNow (async, fire-and-forget)
    sitemap_indexnow_result = await ping_after_publish(urls)

    # Google Indexing API — sync call (lib bawaan sync-only)
    google_result = ping_google_indexing_blocking(urls)

    results: list[BulkReindexResult] = []
    succeeded = 0
    failed = 0
    if google_result.get("ok") and "results" in google_result:
        for r in google_result["results"]:
            ok = bool(r.get("ok"))
            results.append(BulkReindexResult(
                url=r["url"], ok=ok,
                error=None if ok else r.get("error"),
            ))
            succeeded += 1 if ok else 0
            failed += 0 if ok else 1
    elif google_result.get("reason"):
        # lib missing / no key / setup fail → tandai semua gagal tapi tetap return
        results = [
            BulkReindexResult(url=u, ok=False, error=google_result.get("reason"))
            for u in urls
        ]
        failed = len(urls)

    return BulkReindexOut(
        total=len(articles),
        submitted=len(urls),
        succeeded=succeeded,
        failed=failed,
        results=results,
        skipped_reason=None,
    )
