"""Public tool endpoints untuk UMKM.

Tools gratis yang bantu UMKM selesaiin 1 pekerjaan digital dengan hasil jadi.
Setiap tool wajib: (1) hasil jadi langsung dipakai, (2) rate-limited, (3) kalau pake AI → fallback + error rapi.
"""

import asyncio
import hashlib
import json
import logging
import uuid
from typing import Any

import httpx
from fastapi import APIRouter, BackgroundTasks, Depends, Request
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.core.config import CRM_API_URL, CRM_API_KEY
from app.core.database import SessionLocal, get_db
from app.core.mimo_client import generate_gbp_profil
from app.core.security import check_rate_limit
from app.core.utils import now_iso
from app.models import ContactSubmission
from app.schemas.tool_gbp import GbpProfilIn, GbpProfilOut
from app.schemas.tool_preview_lead import PreviewLeadIn, PreviewLeadOut

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


# ─── Lead capture dari tool Preview Bisnis ────────────────────────────────────
# User isi form preview -> lihat preview GBP + simulasi SEO -> tekan CTA dgn
# WA/email. Lead disimpan ke ContactSubmission (jalur sama dgn contact-form) lalu
# di-forward ke CRM kantorteman. Beda hanya di `source` biar bisa dibedakan.


def _forward_preview_lead_sync(submission_id: str, payload: dict):
    try:
        asyncio.run(_forward_preview_lead(submission_id, payload))
    except Exception as e:  # noqa: BLE001
        logger.error("preview lead CRM sync wrapper failed: %s", e)


async def _forward_preview_lead(submission_id: str, payload: dict):
    if not CRM_API_URL or not CRM_API_KEY:
        logger.info(
            "CRM not configured — preview lead %s saved but NOT forwarded.",
            submission_id,
        )
        return
    db = SessionLocal()
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.post(
                f"{CRM_API_URL.rstrip('/')}/api/leads/external",
                json=payload,
                headers={"X-API-Key": CRM_API_KEY},
            )
            if resp.status_code in (200, 201):
                sub = (
                    db.query(ContactSubmission)
                    .filter(ContactSubmission.id == submission_id)
                    .first()
                )
                if sub:
                    sub.sent_to_crm = True
                    db.commit()
            else:
                logger.warning(
                    "preview lead CRM responded %s: %s",
                    resp.status_code,
                    resp.text[:200],
                )
    except Exception as e:  # noqa: BLE001
        logger.error("preview lead CRM forward failed: %s", e)
    finally:
        db.close()


@router.post("/preview-lead", response_model=PreviewLeadOut, status_code=201)
def submit_preview_lead(
    data: PreviewLeadIn,
    request: Request,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    """Tangkap lead dari tool Preview Bisnis. Rate limit: 10 / 5 menit / IP."""
    ip = _client_ip(request)
    check_rate_limit(f"tool:preview-lead:{ip}", limit=10, window_seconds=300)

    if not data.wa and not data.email:
        return JSONResponse(
            status_code=422,
            content={"detail": "Isi WhatsApp atau email dulu ya."},
        )

    # Kontak utama: WA diprioritaskan (CRM butuh phone_number).
    phone = data.wa or ""
    message = (
        f"Lead dari tool Preview Bisnis. Jenis usaha: {data.jenis_usaha}, "
        f"kota: {data.kota}. Minta versi full / konsultasi."
    )

    submission = ContactSubmission(
        id=str(uuid.uuid4()),
        name=data.nama_usaha,
        phone=phone,
        email=data.email,
        service="seo_google_maps",
        message=message,
        created_at=now_iso(),
        sent_to_crm=False,
    )
    db.add(submission)
    db.commit()

    payload = {
        "business_name": data.nama_usaha,
        "phone_number": phone,
        "email": data.email,
        "message": message,
        "product_interest": "seo_google_maps",
        "source": "website_temanumkmkita_preview",
    }
    background_tasks.add_task(_forward_preview_lead_sync, submission.id, payload)

    return {"success": True, "submission_id": submission.id}