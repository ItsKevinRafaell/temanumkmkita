"""IndexNow + sitemap pinger for newly published articles.

Dipanggil saat ada artikel transisi draft → published.
Two strategies:
  1. Sitemap ping (Google + Bing): kasih tahu crawler sitemap berubah.
  2. IndexNow (Bing + Yandex): instant submit URL individual.

Quota IndexNow: 10k URL/hari, gratis, no auth.
Quota sitemap ping: best-effort, ga ada quota resmi (rate-limited per IP).
"""

from __future__ import annotations

import logging
import os
from typing import Iterable

import httpx

logger = logging.getLogger(__name__)

SITE_URL = os.getenv("FRONTEND_URL", "https://www.temanumkmkita.com").rstrip("/")
SITEMAP_URL = f"{SITE_URL}/sitemap.xml"
INDEXNOW_KEY = os.getenv("INDEXNOW_KEY", "").strip()

INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow"

# Search engines that accept "sitemap changed" pings.
PING_ENDPOINTS = {
    "google": f"https://www.google.com/ping?sitemap={SITEMAP_URL}",
    "bing": f"https://www.bing.com/ping?sitemap={SITEMAP_URL}",
}


async def _ping_search_engines(client: httpx.AsyncClient) -> dict[str, bool]:
    results = {}
    for name, url in PING_ENDPOINTS.items():
        try:
            resp = await client.get(url, timeout=10)
            results[name] = resp.status_code == 200
            logger.info("Sitemap ping %s -> %s", name, resp.status_code)
        except Exception as e:
            logger.warning("Sitemap ping %s failed: %s", name, e)
            results[name] = False
    return results


async def _indexnow_submit(client: httpx.AsyncClient, urls: list[str]) -> bool:
    if not INDEXNOW_KEY or not urls:
        return False
    payload = {
        "host": SITE_URL.replace("https://", "").replace("http://", ""),
        "key": INDEXNOW_KEY,
        "urlList": urls,
    }
    try:
        resp = await client.post(INDEXNOW_ENDPOINT, json=payload, timeout=10)
        ok = resp.status_code in (200, 202)
        logger.info(
            "IndexNow submit %d urls -> %s", len(urls), resp.status_code
        )
        return ok
    except Exception as e:
        logger.warning("IndexNow submit failed: %s", e)
        return False


async def ping_after_publish(urls: Iterable[str]) -> dict:
    """Panggil setelah publish. `urls` = list path absolut (https://...)."""
    url_list = [u for u in urls if u]
    async with httpx.AsyncClient() as client:
        sitemap_results = await _ping_search_engines(client)
        indexnow_ok = await _indexnow_submit(client, url_list) if url_list else None
    return {"sitemap": sitemap_results, "indexnow": indexnow_ok}
