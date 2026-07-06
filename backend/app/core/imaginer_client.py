"""Client for Imaginer image generation API.

Docs: https://imaginer.mirava.studio (RESTful, async generation)
"""

from __future__ import annotations

import asyncio
import logging
import os
import re
import uuid
from typing import Any

import httpx

from app.core.config import IMAGINER_API_KEY, IMAGINER_BASE_URL

logger = logging.getLogger(__name__)

# Default generation parameters for cover images.
DEFAULT_MODEL = "gpt-image-2"
DEFAULT_QUALITY = "medium"
DEFAULT_RATIO = "16:9"
DEFAULT_STYLE = "dynamic"

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "public", "uploads", "covers")
API_BASE = os.getenv("API_BASE_URL", "https://api.temanumkmkita.com")

# Rate limit handling.
# Imaginer returns X-RateLimit-Policy header (e.g. "15;w=60" = 15 req per 60s).
# We read remaining budget from each response and self-throttle.
DEFAULT_BUDGET = 12  # Conservative: stay under default 15/60s.
RATE_LIMIT_RETRY_STATUS = (429, 500, 502, 503, 504)
RETRYABLE_GENERATION_STATUSES = {"processing", "polling"}
GENERATION_TRANSIENT_STATUSES = {"processing", "polling"}  # treat as transient


def _headers() -> dict[str, str]:
    return {
        "Authorization": f"Bearer {IMAGINER_API_KEY}",
        "Content-Type": "application/json",
    }


class _RateGate:
    """Token-bucket style gate: tracks remaining budget per minute."""

    def __init__(self, per_minute: int = DEFAULT_BUDGET) -> None:
        self.per_minute = per_minute
        self.remaining = per_minute
        self.window_seconds = 60.0
        self.last_reset = asyncio.get_event_loop().time()

    def update_from_headers(self, headers: httpx.Headers) -> None:
        remaining = headers.get("X-RateLimit-Remaining")
        if remaining is not None:
            try:
                self.remaining = int(remaining)
            except ValueError:
                pass

    async def wait_if_needed(self) -> None:
        loop = asyncio.get_event_loop()
        now = loop.time()
        if now - self.last_reset >= self.window_seconds:
            self.remaining = self.per_minute
            self.last_reset = now
        if self.remaining <= 0:
            wait = max(0.0, self.window_seconds - (now - self.last_reset))
            logger.warning("Rate limit close to 0, sleeping %.1fs before next request", wait)
            await asyncio.sleep(wait + 0.5)
            self.remaining = self.per_minute
            self.last_reset = asyncio.get_event_loop().time()
        self.remaining -= 1


_rate_gate = _RateGate()


async def _post_with_retry(client: httpx.AsyncClient, url: str, json: dict) -> httpx.Response:
    """POST dengan exponential backoff untuk 429/5xx."""
    delays = [5, 15, 45]
    last_exc: Exception | None = None
    for attempt, delay in enumerate([0] + delays):
        if delay:
            logger.warning("Retry POST %s attempt=%d after %ds", url.split("/")[-1], attempt, delay)
            await asyncio.sleep(delay)
        try:
            resp = await client.post(url, json=json, headers=_headers(), timeout=30)
            if resp.status_code in RATE_LIMIT_RETRY_STATUS:
                last_exc = httpx.HTTPStatusError(
                    f"{resp.status_code}", request=resp.request, response=resp
                )
                continue
            resp.raise_for_status()
            _rate_gate.update_from_headers(resp.headers)
            return resp
        except httpx.HTTPStatusError as e:
            last_exc = e
            if e.response.status_code not in RATE_LIMIT_RETRY_STATUS:
                raise
        except httpx.RequestError as e:
            last_exc = e
    raise last_exc  # type: ignore[misc]


async def _get_with_retry(client: httpx.AsyncClient, url: str) -> httpx.Response:
    """GET dengan exponential backoff (kecuali URL berisi generation_id yang cheap)."""
    delays = [3, 10, 30]
    last_exc: Exception | None = None
    for attempt, delay in enumerate([0] + delays):
        if delay:
            await asyncio.sleep(delay)
        try:
            resp = await client.get(url, headers=_headers(), timeout=30)
            if resp.status_code in RATE_LIMIT_RETRY_STATUS:
                last_exc = httpx.HTTPStatusError(
                    f"{resp.status_code}", request=resp.request, response=resp
                )
                continue
            resp.raise_for_status()
            return resp
        except httpx.HTTPStatusError as e:
            last_exc = e
            if e.response.status_code not in RATE_LIMIT_RETRY_STATUS:
                raise
        except httpx.RequestError as e:
            last_exc = e
    raise last_exc  # type: ignore[misc]


def extract_image_prompt(notes: str | None) -> str | None:
    """Extract image prompt from article notes.

    Looks for `## Cover Image Prompt` section, falls back to first non-empty line.
    """
    if not notes:
        return None
    match = re.search(
        r"##\s*Cover Image Prompt\s*\n+(.*?)(?:\n##|\Z)",
        notes,
        flags=re.DOTALL,
    )
    if match:
        prompt = match.group(1).strip()
        if prompt:
            return prompt
    # Fallback: first non-heading, non-empty line
    for line in notes.splitlines():
        line = line.strip()
        if line and not line.startswith("#"):
            return line
    return None


async def submit_generation(prompt: str, client: httpx.AsyncClient) -> str:
    """Submit a generation request, return generation_id."""
    payload = {
        "model_id": DEFAULT_MODEL,
        "prompt": prompt,
        "quality": DEFAULT_QUALITY,
        "ratio": DEFAULT_RATIO,
        "style": DEFAULT_STYLE,
    }
    await _rate_gate.wait_if_needed()
    resp = await _post_with_retry(
        client, f"{IMAGINER_BASE_URL}/api/public/v1/generate", payload
    )
    data = resp.json()
    return data["generation_id"]


async def poll_generation(
    generation_id: str,
    client: httpx.AsyncClient,
    max_wait: int = 300,
    interval: float = 5.0,
) -> dict[str, Any]:
    """Poll until generation succeeds or fails. Returns full response dict."""
    url = f"{IMAGINER_BASE_URL}/api/public/v1/generate/{generation_id}"
    elapsed = 0.0
    while elapsed < max_wait:
        resp = await _get_with_retry(client, url)
        data = resp.json()
        status = data.get("status")
        if status == "success":
            return data
        if status == "failed":
            raise RuntimeError(f"Generation failed: {data.get('error', 'unknown')}")
        if status == "cancelled":
            raise RuntimeError("Generation was cancelled")
        await asyncio.sleep(interval)
        elapsed += interval
    raise TimeoutError(f"Generation {generation_id} did not complete in {max_wait}s")


async def download_image(url: str, client: httpx.AsyncClient) -> bytes:
    """Download generated image bytes."""
    resp = await client.get(url, timeout=60)
    resp.raise_for_status()
    return resp.content


def save_image(content: bytes, slug: str) -> str:
    """Save image to disk, return public URL path."""
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    filename = f"cover-{slug}-{uuid.uuid4().hex[:8]}.png"
    filepath = os.path.join(UPLOAD_DIR, filename)
    with open(filepath, "wb") as f:
        f.write(content)
    return f"{API_BASE}/uploads/covers/{filename}"


async def generate_cover_image(prompt: str, slug: str) -> str:
    """Full pipeline: submit → poll → download → save. Returns public URL."""
    if not IMAGINER_API_KEY:
        raise RuntimeError("IMAGINER_API_KEY not configured")
    async with httpx.AsyncClient() as client:
        generation_id = await submit_generation(prompt, client)
        logger.info("Generation %s submitted for slug=%s", generation_id, slug)
        result = await poll_generation(generation_id, client)
        image_url = result["urls"][0]
        image_bytes = await download_image(image_url, client)
        return save_image(image_bytes, slug)
