"""One-shot bulk cover generator — run dari server, iterate ASC by published_at.

Tahan disconnect DB: pakai fresh session per row.
Usage (di server):
    source ~/backend/.env
    /opt/alt/python311/bin/python3.11 scripts/_bulk_one_shot.py
"""
import sys, time, asyncio, re
sys.path.insert(0, '/home/pfjqehkj/backend')
sys.path.insert(0, '/home/pfjqehkj/backend/scripts')

from app.core.imaginer_client import generate_cover_image
from app.core.utils import now_iso
from app.core.database import SessionLocal, engine, Base
from app.models import Article

Base.metadata.create_all(bind=engine)


def fetch_pending_slugs():
    """Fresh DB session each call supaya tahan idle disconnect."""
    db = SessionLocal()
    try:
        rows = (
            db.query(Article.slug, Article.notes)
            .filter((Article.cover_image == None) | (Article.cover_image == ""))
            .order_by(Article.published_at.asc())
            .all()
        )
        return [(r.slug, r.notes) for r in rows]
    finally:
        db.close()


def commit_cover(slug: str, url: str):
    db = SessionLocal()
    try:
        art = db.query(Article).filter(Article.slug == slug).first()
        if not art:
            return
        art.cover_image = url
        art.updated_at = now_iso()
        db.commit()
    finally:
        db.close()


async def run():
    pending = fetch_pending_slugs()
    N = len(pending)
    print(f"processing {N} rows")
    processed = 0
    failed = 0
    for i, (slug, notes) in enumerate(pending, 1):
        m = re.search(
            r"##\s*Cover Image Prompt\s*\n+(.*?)(?:\n##|\Z)", notes, flags=re.DOTALL
        )
        prompt = m.group(1).strip() if m else ""
        if not prompt:
            print(f"[{i}/{N}] skip {slug[:50]}")
            continue
        try:
            t0 = time.time()
            url = await generate_cover_image(prompt, slug)
            dt = time.time() - t0
            commit_cover(slug, url)
            processed += 1
            filename = url.rsplit("/", 1)[-1]
            print(f"[{i}/{N}] ok {dt:.1f}s {filename}")
        except Exception as e:
            failed += 1
            print(f"[{i}/{N}] FAIL {slug[:48]} {type(e).__name__}: {str(e)[:80]}")
        if i < N:
            await asyncio.sleep(22)
    print(f"done. processed={processed} failed={failed}")


asyncio.run(run())
