"""Trigger Next.js ISR revalidation for sitemap.xml.

Dipanggil dari artikel publish hooks (single + bulk) supaya sitemap fresh
tanpa nunggu TTL 1 jam. Pakai REVALIDATE_TOKEN env untuk auth.
"""
from __future__ import annotations

import logging
import os

import httpx

logger = logging.getLogger(__name__)

FRONTEND_URL = os.getenv("FRONTEND_URL", "https://www.temanumkmkita.com").rstrip("/")


async def revalidate_frontend_sitemap() -> None:
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