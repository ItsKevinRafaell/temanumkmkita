"""Generate cover images for articles via Imaginer API.

Single article: POST /api/admin/articles/{id}/generate-cover
Bulk (all without cover): POST /api/admin/articles/generate-covers-bulk
"""

from __future__ import annotations

import asyncio
import logging
import os

import httpx
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.imaginer_client import extract_image_prompt, generate_cover_image
from app.core.security import require_auth
from app.core.utils import now_iso
from app.models import Article
from app.schemas.imaginer import BulkGenerateProgress, GenerateCoverResponse

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/admin/articles", tags=["imaginer"], dependencies=[Depends(require_auth)])

# Delay between bulk generations to respect RPM limits.
BULK_DELAY_SECONDS = 15.0
FRONTEND_URL = os.getenv("FRONTEND_URL", "https://www.temanumkmkita.com").rstrip("/")


async def _revalidate_frontend_sitemap() -> None:
    """Panggil endpoint revalidate Next.js supaya sitemap.xml fresh."""
    token = os.getenv("REVALIDATE_TOKEN", "").strip()
    if not token:
        return
    try:
        async with httpx.AsyncClient() as client:
            await client.post(
                f"{FRONTEND_URL}/api/revalidate-sitemap",
                headers={"Authorization": f"Bearer {token}"},
                timeout=10,
            )
    except Exception as e:
        logger.warning("Revalidate sitemap gagal: %s", e)


@router.post("/{article_id}/generate-cover", response_model=GenerateCoverResponse)
async def generate_single_cover(article_id: str, db: Session = Depends(get_db)):
    """Generate a cover image for one article using its notes/image_prompt."""
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")

    prompt = extract_image_prompt(article.notes)
    if not prompt:
        raise HTTPException(
            status_code=400,
            detail="No image prompt found in article notes. Add a '## Cover Image Prompt' section first.",
        )

    try:
        cover_url = await generate_cover_image(prompt, article.slug)
    except Exception as e:
        logger.exception("Cover generation failed for %s", article.slug)
        raise HTTPException(status_code=502, detail=f"Image generation failed: {e}")

    article.cover_image = cover_url
    article.updated_at = now_iso()
    db.commit()

    return GenerateCoverResponse(
        article_id=article.id,
        slug=article.slug,
        cover_image_url=cover_url,
        prompt_used=prompt,
    )


@router.post("/generate-covers-bulk", response_model=BulkGenerateProgress)
async def generate_bulk_covers(background: BackgroundTasks, db: Session = Depends(get_db)):
    """Generate cover images for all articles that have notes but no cover_image.

    Runs sequentially with a delay between each generation to respect API rate limits.
    """
    articles = (
        db.query(Article)
        .filter(Article.notes.isnot(None), Article.notes != "")
        .filter((Article.cover_image == None) | (Article.cover_image == ""))  # noqa: E711
        .all()
    )

    results: list[GenerateCoverResponse] = []
    errors: list[dict[str, str]] = []
    skipped = 0

    for i, article in enumerate(articles):
        prompt = extract_image_prompt(article.notes)
        if not prompt:
            skipped += 1
            errors.append({"slug": article.slug, "error": "No image prompt in notes"})
            continue

        try:
            cover_url = await generate_cover_image(prompt, article.slug)
            article.cover_image = cover_url
            article.updated_at = now_iso()
            results.append(
                GenerateCoverResponse(
                    article_id=article.id,
                    slug=article.slug,
                    cover_image_url=cover_url,
                    prompt_used=prompt,
                )
            )
            logger.info("Cover generated: %s (%d/%d)", article.slug, i + 1, len(articles))
        except Exception as e:
            logger.exception("Cover generation failed for %s", article.slug)
            errors.append({"slug": article.slug, "error": str(e)})

        # Spread delay between generations (skip after last one)
        if i < len(articles) - 1:
            await asyncio.sleep(BULK_DELAY_SECONDS)

    db.commit()

    # Trigger Next.js sitemap revalidation supaya artikel baru dengan cover muncul di sitemap.xml.
    background.add_task(_revalidate_frontend_sitemap)

    return BulkGenerateProgress(
        total=len(articles),
        completed=len(results),
        failed=len(errors) - skipped,
        skipped=skipped,
        results=results,
        errors=errors,
    )
