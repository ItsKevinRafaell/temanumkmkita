"""IndexNow + sitemap ping + Google Indexing API for newly published articles.

Three strategies (urutan prioritas):
  1. Google Indexing API (URL_UPDATED) — instant, ~1-2 menit
  2. IndexNow (Bing + Yandex + Seznam + Naver) — instant
  3. Sitemap ping (Google + Bing) — best-effort

Quota:
- Google Indexing API: 200 requests/hari/project (default).
- IndexNow: 10k URL/hari, gratis, no auth.
- Sitemap ping: best-effort.
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
GOOGLE_INDEXING_KEY_PATH = os.getenv("GOOGLE_INDEXING_KEY_PATH", "").strip()

INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow"

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
        logger.info("IndexNow submit %d urls -> %s", len(urls), resp.status_code)
        return ok
    except Exception as e:
        logger.warning("IndexNow submit failed: %s", e)
        return False


def _google_indexing_publish(urls: list[str]) -> dict:
    """Google Indexing API via service account OAuth. Sync."""
    if not GOOGLE_INDEXING_KEY_PATH or not urls:
        return {"ok": False, "reason": "no-key-or-urls"}
    if not os.path.exists(GOOGLE_INDEXING_KEY_PATH):
        logger.warning("GOOGLE_INDEXING_KEY_PATH tidak ditemukan: %s", GOOGLE_INDEXING_KEY_PATH)
        return {"ok": False, "reason": "key-not-found"}
    try:
        from google.oauth2 import service_account
        from googleapiclient.discovery import build
        from googleapiclient.errors import HttpError
    except ImportError as e:
        logger.warning("Google API client belum terinstall: %s", e)
        return {"ok": False, "reason": "lib-missing"}

    try:
        creds = service_account.Credentials.from_service_account_file(
            GOOGLE_INDEXING_KEY_PATH,
            scopes=["https://www.googleapis.com/auth/indexing"],
        )
        service = build("indexing", "v3", credentials=creds, cache_discovery=False)
        results: list[dict] = []
        for url in urls:
            try:
                body = {"url": url, "type": "URL_UPDATED"}
                resp = service.urlNotifications().publish(body=body).execute()
                results.append({"url": url, "ok": True, "response": str(resp)[:200]})
                logger.info("Google Indexing OK: %s", url)
            except HttpError as e:
                logger.warning("Google Indexing FAIL %s: %s", url, e)
                results.append({"url": url, "ok": False, "error": str(e)[:200]})
        return {"ok": True, "results": results, "count": len(results)}
    except Exception as e:
        logger.exception("Google Indexing API setup/send failed: %s", e)
        return {"ok": False, "reason": str(e)[:200]}


def ping_google_indexing_blocking(urls: Iterable[str]) -> dict:
    url_list = [u for u in urls if u]
    if not url_list:
        return {"ok": False, "reason": "empty"}
    return _google_indexing_publish(url_list)


# Halaman dengan transactional intent (CTA / Konsultasi Gratis).
# Boleh dipanggil manual kapan saja untuk re-ping halaman prioritas.
TRANSACTIONAL_PATHS: list[str] = [
    "/",
    "/layanan",
    "/layanan/web-development",
    "/layanan/web-development-bulanan",
    "/layanan/seo-google-maps",
    "/layanan/kelola-sosial-media",
    "/layanan/desain-logo",
    "/layanan/maintenance",
    "/blog",
    "/kontak",
    "/tentang-kami",
]


def transactional_urls() -> list[str]:
    return [f"{SITE_URL}{p}" for p in TRANSACTIONAL_PATHS]


async def ping_after_publish(urls: Iterable[str]) -> dict:
    url_list = [u for u in urls if u]
    async with httpx.AsyncClient() as client:
        sitemap_results = await _ping_search_engines(client)
        indexnow_ok = await _indexnow_submit(client, url_list) if url_list else None
    google_result = _google_indexing_publish(url_list) if url_list else None
    return {
        "sitemap": sitemap_results,
        "indexnow": indexnow_ok,
        "google_indexing": google_result,
    }


async def ping_transactional() -> dict:
    """Ping all high-priority halaman sekaligus + Google Indexing."""
    urls = transactional_urls()
    return await ping_after_publish(urls)
