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


def _headers() -> dict[str, str]:
    return {
        "Authorization": f"Bearer {IMAGINER_API_KEY}",
        "Content-Type": "application/json",
    }


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
    resp = await client.post(
        f"{IMAGINER_BASE_URL}/api/public/v1/generate",
        json=payload,
        headers=_headers(),
        timeout=30,
    )
    resp.raise_for_status()
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
        resp = await client.get(url, headers=_headers(), timeout=30)
        resp.raise_for_status()
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
