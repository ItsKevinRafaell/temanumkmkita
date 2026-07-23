"""HTTP client untuk 9router (OpenAI-compatible) — model mimo.

Digunakan tool AI teks seperti Generator Profil Google Business.
Polanya mirip imaginer_client.py: httpx, timeout, retry.
"""

from __future__ import annotations

import json
import logging

import httpx

from app.core.config import ROUTER_API_KEY, ROUTER_BASE_URL, ROUTER_MODEL

logger = logging.getLogger(__name__)

_TIMEOUT = 50  # detik — mimo bisa 20+d untuk generate (reasoning verbos)
_MAX_RETRIES = 1

# Token budget per request.
_MAX_TOKENS = 1500


def _headers() -> dict[str, str]:
    return {
        "Authorization": f"Bearer {ROUTER_API_KEY}",
        "Content-Type": "application/json",
    }


def _build_payload(messages: list[dict], **overrides) -> dict:
    return {
        "model": overrides.get("model", ROUTER_MODEL),
        "messages": messages,
        "max_tokens": overrides.get("max_tokens", _MAX_TOKENS),
        "temperature": overrides.get("temperature", 0.7),
        "stream": False,
    }


def _extract_content(raw: dict) -> str:
    """Ambil content dari response, buang reasoning_content.

    9router/mimo sering ngirim `reasoning_content` panjang yang
    bikin output rusak kalau nggak sengaja di-parse sebagai konten.
    """
    choices = raw.get("choices", [])
    if not choices:
        raise ValueError("No choices in router response")
    msg = choices[0].get("message", {})
    # Buang reasoning_content explicit — mimo suka naro paragraf mikir.
    msg.pop("reasoning_content", None)
    content = msg.get("content", "")
    if not content:
        raise ValueError("Empty content in router response")
    return content


def generate_gbp_profil(
    nama_usaha: str,
    jenis_usaha: str,
    kota: str,
    keunikan: str | None = None,
) -> dict:
    """Generate deskripsi, keyword, dan template balasan Google Business Profile.

    Returns dict dengan kunci: deskripsi, keywords[], template_review_baik, template_review_buruk.
    """
    keunikan_line = f"\n- Keunikan: {keunikan}" if keunikan else ""

    system_msg = {
        "role": "system",
        "content": (
            "Kamu adalah asisten profil bisnis untuk UMKM Indonesia. "
            "Balas HANYA dengan JSON valid — tanpa markdown, tanpa penjelasan, tanpa ```json. "
            "Gunakan bahasa Indonesia yang natural, hangat, dan spesifik untuk bisnis ini. "
            "Hindari template generik — buat terdengar seperti manusia beneran yang kenal bisnis ini."
        ),
    }
    user_msg = {
        "role": "user",
        "content": (
            f"Buatkan profil lengkap Google Business Profile untuk bisnis berikut:\n"
            f"- Nama: {nama_usaha}\n"
            f"- Jenis: {jenis_usaha}\n"
            f"- Kota: {kota}{keunikan_line}\n\n"
            "Format JSON EXACT — jangan tambah field lain:\n"
            '{\n'
            '  "deskripsi": "3 paragraf deskripsi bisnis. Ceritakan apa yang membedakan, lokasi, dan kenapa orang harus datang. Maks 300 kata. Bahasa Indonesia natural.",\n'
            '  "keywords": ["12-15 keyword spesifik termasuk lokasi"],\n'
            '  "template_review_baik": "Balasan hangat dan personal untuk review positif. Include nama bisnis. Maks 3 kalimat.",\n'
            '  "template_review_buruk": "Balasan sopan dan profesional untuk review negatif. Tawarkan solusi. Maks 4 kalimat."\n'
            '}\n\n'
            "WAJIB: JSON valid tanpa ```json, tanpa markdown."
        ),
    }

    payload = _build_payload([system_msg, user_msg], temperature=0.7)

    for attempt in range(_MAX_RETRIES + 1):
        try:
            with httpx.Client(timeout=_TIMEOUT) as client:
                resp = client.post(
                    f"{ROUTER_BASE_URL}/chat/completions",
                    headers=_headers(),
                    json=payload,
                )
                resp.raise_for_status()
                raw = resp.json()
                content = _extract_content(raw)
                parsed = json.loads(content)

                # Validasi key minimal
                for key in ("deskripsi", "keywords", "template_review_baik", "template_review_buruk"):
                    if key not in parsed:
                        raise ValueError(f"Missing key '{key}' in generated output")

                if not isinstance(parsed["keywords"], list):
                    parsed["keywords"] = [str(parsed["keywords"])]

                return parsed

        except (json.JSONDecodeError, ValueError, httpx.HTTPStatusError, httpx.RequestError) as e:
            logger.warning("mimo generate attempt %d/%d failed: %s", attempt + 1, _MAX_RETRIES + 1, e)
            if attempt == _MAX_RETRIES:
                raise RuntimeError(f"Gagal generate profil: {e}") from e