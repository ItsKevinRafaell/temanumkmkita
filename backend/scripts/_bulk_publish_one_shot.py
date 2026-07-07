"""One-shot bulk publisher: mark draft → published, trigger pings.

Usage (di server):
    source ~/backend/.env
    /opt/alt/python311/bin/python3.11 scripts/_bulk_publish_one_shot.py
"""
import sys, os, asyncio
sys.path.insert(0, '/home/pfjqehkj/backend')
sys.path.insert(0, '/home/pfjqehkj/backend/scripts')

from app.core.database import SessionLocal, engine
from app.core.index_pinger import ping_after_publish
from app.models import Article
from sqlalchemy import asc
from datetime import datetime, timezone


def fetch_pending_ids():
    db = SessionLocal()
    try:
        rows = (
            db.query(Article.id, Article.slug)
            .filter(Article.status == "draft")
            .filter(Article.cover_image.isnot(None))
            .filter(Article.cover_image != "")
            .order_by(asc(Article.published_at))
            .all()
        )
        return [(r.id, r.slug) for r in rows]
    finally:
        db.close()


def mark_published(article_id: str) -> bool:
    db = SessionLocal()
    try:
        art = db.query(Article).filter(Article.id == article_id).first()
        if not art or art.status == "published":
            return False
        art.status = "published"
        now_iso = datetime.now(timezone.utc).isoformat()
        # Selalu pakai now() kalau published_at kosong ATAU future-date (calendar seed bug).
        # Editorial intent "planned date" lebih baik disimpan di kolom terpisah (scheduled_for)
        # supaya tidak konflik dengan sort/filter frontend.
        if not art.published_at or art.published_at > now_iso:
            art.published_at = now_iso
        art.updated_at = now_iso
        db.commit()
        return True
    finally:
        db.close()


def main():
    pending = fetch_pending_ids()
    print(f"pending: {len(pending)}")
    n = int(os.getenv("N", str(len(pending))))
    pending = pending[:n]
    base = os.getenv("FRONTEND_URL", "https://www.temanumkmkita.com").rstrip("/")
    published = []
    skipped = 0
    for article_id, slug in pending:
        if mark_published(article_id):
            published.append(f"{base}/blog/{slug}")
            print(f"published: {slug}")
        else:
            skipped += 1
    print(f"published={len(published)} skipped={skipped}")
    if published:
        asyncio.run(ping_after_publish(published))
        print(f"pinger triggered for {len(published)} urls")


if __name__ == "__main__":
    main()
