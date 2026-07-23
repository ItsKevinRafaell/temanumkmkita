"""Public tool endpoints untuk UMKM.

Tools gratis yang bantu UMKM selesaiin 1 pekerjaan digital dengan hasil jadi.
Setiap tool wajib: (1) hasil jadi langsung dipakai, (2) rate-limited, (3) kalau pake AI → fallback + error rapi.
"""

import hashlib
import json
import logging
from typing import Any

from fastapi import APIRouter, Depends, Request
from fastapi.responses import JSONResponse

from app.core.mimo_client import generate_gbp_profil
from app.core.security import check_rate_limit
from app.schemas.tool_gbp import GbpProfilIn, GbpProfilOut

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/tools", tags=["tools"])

# ─── In-memory cache ──────────────────────────────────────────────────────────
# Sederhana: cache berdasarkan hash input. TTL tidak diterapkan; cache
# dibersihkan pas process restart (deploy). Ini cukup untuk tool v1.
# Key: SHA256(input JSON) → (parsed dict)
_cache: dict[str, dict[str, Any]] = {}
_MAX_CACHE_ENTRIES = 500


def _cache_key(data: GbpProfilIn) -> str:
    raw = json.dumps(data.model_dump(), sort_keys=True, ensure_ascii=False)
    return hashlib.sha256(raw.encode()).hexdigest()


def _client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for", "")
    if forwarded:
        return forwarded.split(",")[0].strip()[:64]
    return request.client.host if request.client else "unknown"


@router.post("/generate-profil", response_model=GbpProfilOut)
async def generate_profil(data: GbpProfilIn, request: Request):
    """Generate deskripsi + keyword + template balasan Google Business Profile.

    Rate limit: 5 request per 30 menit per IP.
    """
    ip = _client_ip(request)
    check_rate_limit(f"tool:gbp:{ip}", limit=5, window_seconds=1800)

    # In-memory cache — input identik → hasil sama (hemat token).
    key = _cache_key(data)
    cached = _cache.get(key)
    if cached:
        logger.info("gbp cache HIT for ip=%s key=%s", ip, key[:8])
        return cached

    try:
        result = generate_gbp_profil(
            nama_usaha=data.nama_usaha,
            jenis_usaha=data.jenis_usaha,
            kota=data.kota,
            keunikan=data.keunikan,
        )
    except RuntimeError as e:
        logger.error("gbp generate failed for ip=%s: %s", ip, e)
        return JSONResponse(
            status_code=502,
            content={"detail": "Gagal menghasilkan profil. Coba lagi nanti."},
        )

    # Simpan cache, evict oldest kalau penuh.
    if len(_cache) >= _MAX_CACHE_ENTRIES:
        _cache.pop(next(iter(_cache)), None)
    _cache[key] = result

    return result