"""Generate cover images for articles via Imaginer API.

Single article: POST /api/admin/articles/{id}/generate-cover
Bulk (all without cover): POST /api/admin/articles/generate-covers-bulk
"""

from __future__ import annotations

import asyncio
import logging

from fastapi import APIRouter, Depends, HTTPException
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
async def generate_bulk_covers(db: Session = Depends(get_db)):
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

    return BulkGenerateProgress(
        total=len(articles),
        completed=len(results),
        failed=len(errors) - skipped,
        skipped=skipped,
        results=results,
        errors=errors,
    )
