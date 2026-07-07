"""One-shot bulk cover generator — run dari server, iterate ASC by published_at.

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
db = SessionLocal()
rows = (
    db.query(Article)
    .filter((Article.cover_image == None) | (Article.cover_image == ""))
    .order_by(Article.published_at.asc())
    .all()
)
N = len(rows)
print(f"processing {N} rows")


async def run():
    for i, art in enumerate(rows, 1):
        m = re.search(
            r"##\s*Cover Image Prompt\s*\n+(.*?)(?:\n##|\Z)", art.notes, flags=re.DOTALL
        )
        prompt = m.group(1).strip() if m else ""
        if not prompt:
            print(f"[{i}/{N}] skip {art.slug[:50]}")
            continue
        try:
            t0 = time.time()
            url = await generate_cover_image(prompt, art.slug)
            dt = time.time() - t0
            art.cover_image = url
            art.updated_at = now_iso()
            db.commit()
            filename = url.rsplit("/", 1)[-1]
            print(f"[{i}/{N}] ok {dt:.1f}s {filename}")
        except Exception as e:
            print(f"[{i}/{N}] FAIL {art.slug[:48]} {type(e).__name__}: {str(e)[:80]}")
            db.rollback()
        if i < N:
            await asyncio.sleep(22)


asyncio.run(run())
db.close()
print("done")
