"""Generate varied, magazine-quality cover image prompts per article.

Anti-template design:
- Per-pillar visual archetype (different default subject/composition per category)
- Title keyword extraction → inject specific nouns/objects into prompt
- Scene rotation: 12 scene templates (laptop, workshop, market, etc) → hashed by slug
  so each article gets a different default but 120 total samples are evenly distributed
- Anti-trope guards: banlist for overused stock-photo cliches
- Style anchor: Indonesian editorial photography, warm natural light, no infographics
"""

from __future__ import annotations

import hashlib
import re
from typing import Optional


# ────────────────────────────────────────────────────────────────────────────
# STYLE ANCHOR
# ────────────────────────────────────────────────────────────────────────────
# Tiap prompt di-append style anchor ini di akhir. Result = consistent visual
# brand across all 120 covers tapi subject/composition beda.

STYLE_ANCHOR = (
    "Indonesian editorial photography, magazine-quality cover shot, "
    "natural warm light, shallow depth of field, candid moment, "
    "shot on 35mm lens, muted earth-tone palette (warm cream, terracotta, "
    "deep teal, charcoal), no text overlay, no logos, no infographics, "
    "no charts, no split layout. Aspect ratio 16:9."
)

ANTI_TROPE_BANLIST = [
    "laptop",
    "meeting",
    "presentation",
    "infographic",
    "whiteboard",
    "business meeting",
    "handshake",
    "thumbs up",
    "stack of coins",
    "light bulb idea",
    "typing on keyboard",
    "office desk",
    "smiling at camera",
    "stock photo pose",
    "pointing at chart",
]

# ────────────────────────────────────────────────────────────────────────────
# SCENE POOL
# ────────────────────────────────────────────────────────────────────────────
# 12 scene templates. Vibe-nya beda-beda (market, workshop, warung, dapur,
# jalan, etc) — bukan generic office.

SCENES = [
    {
        "id": "warung_pagi",
        "subject": "Seorang pemilik warung kaki lima sedang melayani pelanggan setia di pagi hari, suasana hangat dan sibuk",
        "setting": "warung kopi sederhana, cahaya pagi masuk dari pintu, asap tipis mengepul dari gelas kopi",
        "mood": "hangat, otentik, bersahaja",
    },
    {
        "id": "workshop_kreator",
        "subject": "Seorang kreator UMKM sedang mengerjakan produk di meja kerja (misal menjahit, merakit, mengemas)",
        "setting": "workshop kecil dengan perkakas dan bahan mentah tertata, cahaya jendela alami",
        "mood": "fokus, craftsmanship, detail tangan bekerja",
    },
    {
        "id": "pasar_malam",
        "subject": "Seorang pedagang UMKM sedang menata barang dagangan di lapak pasar tradisional",
        "setting": "pasar malam, lampu petromak hangat, hiruk-pikuk pembeli di belakang",
        "mood": "enerjik, warna-warni, masyarakat",
    },
    {
        "id": "dapur_produksi",
        "subject": "Tangan-tangan sedang menyiapkan produk UMKM skala kecil di dapur produksi",
        "setting": "dapur rumahan atau dapur produksi kecil, bahan segar tertata, cahaya natural dari jendela",
        "mood": "segat, homemade, sarat proses",
    },
    {
        "id": "etalase_toko",
        "subject": "Etalase toko UMKM lokal yang menarik,展示了 produk-produk signature",
        "setting": "toko kecil dengan signage khas, cahaya showcase, tekstur produk jelas",
        "mood": "curated, inviting, estetik",
    },
    {
        "id": "kolaborasi_tim",
        "subject": "Tim kecil UMKM sedang berdiskusi santai sambil bekerja, suasana kolaboratif",
        "setting": "cafe kecil atau co-working space, meja dengan笔记本 dan alat tulis, suasana rileks",
        "mood": "kolaboratif, hangat, inklusif",
    },
    {
        "id": "lapangan_brand",
        "subject": "Seorang pemilik bisnis sedang berinteraksi langsung dengan pelanggan di lapangan",
        "setting": "lapangan户外, cahaya matahari terik, ekspresi tulus dan percaya diri",
        "mood": "grounded, berani, dekat dengan customer",
    },
    {
        "id": "studio_produk",
        "subject": "Produk UMKM signature ditampilkan sebagai hero shot, dari angle eye-catching",
        "setting": "latar belakang minimal atau tekstur自然, pencahayaan produk profesional",
        "mood": "premium, focal, brand-forward",
    },
    {
        "id": "belajar_online",
        "subject": "Seorang UMKM sedang belajar atau riset online dari perangkat mobile",
        "setting": "kursi rumah, ruang keluarga, ekspresi penasaran dan tekun",
        "mood": "curious, modern, accessible",
    },
    {
        "id": "komunitas_lokal",
        "subject": "Sekelompok orang lokal sedang berinteraksi di ruang komunitas kecil milik UMKM",
        "setting": "ruang bersama sederhana, cahaya masuk dari jendela besar, ada tanaman",
        "mood": "komunal, hangat, impactful",
    },
    {
        "id": "proses_kreatif",
        "subject": "Proses kreatif seorang pelaku UMKM — menulis, menggambar, atau berpikir di depan kanvas/papan",
        "setting": "studio kreatif personal, pins/catatan tempel di dinding, cahaya jendela sore",
        "mood": "introspektif, kreatif, personal",
    },
    {
        "id": "belajar_langsung",
        "subject": "Seorang pelaku UMKM sedangmagang atau training langsung dengan mentor",
        "setting": "workshop atau kelas kecil, fokus pada interaksi manusia dan alat",
        "mood": "mentorship, praktis, hands-on",
    },
]


# ────────────────────────────────────────────────────────────────────────────
# CATEGORY (PILLAR) TWEAKS
# ────────────────────────────────────────────────────────────────────────────
# Per-pillar, tambahkan context keyword biar prompt lebih relevan ke topik.
# Ini membuat prompt per kategori berbeda konteksnya.

PILLAR_TWEAKS = {
    "Website": (
        "Compositional hint: ada elemen digital subtle di lingkungan "
        "(layar laptop, signage digital, QR code di meja) — tapi bukan subjek utama."
    ),
    "SEO & Google Maps": (
        "Compositional hint: lokasi fisik yang jelas terlihat — peta, plang alamat, "
        "atau landmark kota/lokal. Subjeknya ada di tempat fisik, bukan di belakang layar."
    ),
    "Sosial Media": (
        "Compositional hint: ada暗示 konten digital — papan ide, sketch, sticky notes warna-warni, "
        "atau tangan memegang ponsel dengan angle natural. Bukan orang sedang narsis拍照."
    ),
    "Branding": (
        "Compositional hint: visual identitas kuat — ada elemento desain yang intentional "
        "(warna brand yang berani, tipografi, atau elemen grafis di sekitar produk)."
    ),
    "Maintenance": (
        "Compositional hint: ada unsur teknis yang细微 terlihat — peralatan, perkakas, atau "
        "proses checking; tapi bukan foto industrial stock."
    ),
    "Tips Bisnis": (
        "Compositional hint: momen决策 atau思考 — ekspresi berpikir, mempertimbangkan, "
        "atau interaksi meaningful antara dua orang."
    ),
}


# ────────────────────────────────────────────────────────────────────────────
# TITLE KEYWORD EXTRACTION
# ────────────────────────────────────────────────────────────────────────────

# Bahasa Indonesia stopwords yang sering muncul di judul artikel UMKM.
STOPWORDS = {
    "yang", "untuk", "dengan", "dari", "pada", "adalah", "ini", "itu", "atau",
    "dan", "di", "ke", "oleh", "cara", "agar", "supayu", "biar", "jangan",
    "sudah", "belum", "akan", "tidak", "kalau", "bila", "jika", "saat", "ketika",
    "umkm", "bisnis", "lokal", "indonesia", "tahun", "bulan", "minggu", "hari",
    "sebelum", "sesudah", "setelah", "sebelumnya", "nantinya", "nantinya",
}


def _extract_keywords(
    title: str,
    focus_keyword: str = "",
    tags: list[str] | None = None,
) -> list[str]:
    """Ambil 2-4 token relevan.

    Prioritas: focus_keyword (curated SEO) > title nouns > tags.
    """
    parts: list[str] = []
    seen: set[str] = set()

    if focus_keyword:
        for tok in re.split(r"[\s,]+", focus_keyword.strip()):
            tok = tok.strip()
            if tok and tok.lower() not in STOPWORDS and len(tok) >= 3:
                key = tok.lower()
                if key not in seen:
                    parts.append(tok)
                    seen.add(key)

    for tok in re.findall(r"[A-Za-zÀ-ÿ]+", title):
        if tok.lower() in STOPWORDS:
            continue
        if len(tok) < 4:
            continue
        key = tok.lower()
        if key not in seen:
            parts.append(tok)
            seen.add(key)

    if tags:
        for tag in tags[:3]:
            tag_clean = re.sub(r"[^a-zA-ZÀ-ÿ\s]", "", tag).strip()
            if (
                tag_clean
                and tag_clean.lower() not in seen
                and len(tag_clean) >= 3
            ):
                parts.append(tag_clean)
                seen.add(tag_clean.lower())

    return parts[:4]


# Map kata tro yang sering muncul di prompt lama -> alternatif natural.
_TROPE_REPLACEMENTS: dict[str, str] = {
    "laptop": "perangkat mobile di samping buku catatan",
    "meeting": "diskusi santai",
    "presentation": "bincang ringan",
    "infographic": "visual catatan",
    "whiteboard": "papan tulis sederhana",
    "handshake": "saling melempar senyum",
    "thumbs up": "mengangguk mantap",
    "stack of coins": "wadah kayu berisi",
    "light bulb idea": "momen 'aha'",
    "typing on keyboard": "mencatat tangan",
    "office desk": "meja kerja personal",
    "smiling at camera": "tertawa lepas",
    "stock photo pose": "pose natural candid",
    "pointing at chart": "mengamati hasil kerja",
}


def _strip_tropes(text: str) -> str:
    """Replace kata tro dengan alternatif natural. Aman untuk grammar."""
    out = text
    for trope, replacement in _TROPE_REPLACEMENTS.items():
        out = re.sub(
            rf"\b{re.escape(trope)}\b",
            replacement,
            out,
            flags=re.IGNORECASE,
        )
    return out


# ────────────────────────────────────────────────────────────────────────────
# MAIN PROMPT BUILDER
# ────────────────────────────────────────────────────────────────────────────


def _hash_slug_to_index(slug: str, modulo: int) -> int:
    """Deterministic rotation: same slug → same scene, evenly distributed."""
    h = hashlib.sha256(slug.encode("utf-8")).digest()
    return int.from_bytes(h[:4], "big") % modulo


def _detect_pillar(pillar_name: str) -> str:
    """Map pillar_name ke salah satu 6 kategori (atau default)."""
    pn = (pillar_name or "").lower()
    if "website" in pn:
        return "Website"
    if "seo" in pn or "google maps" in pn or "lokal" in pn:
        return "SEO & Google Maps"
    if "sosial" in pn or "social" in pn:
        return "Sosial Media"
    if "branding" in pn or "logo" in pn:
        return "Branding"
    if "maintenance" in pn:
        return "Maintenance"
    if "digital trust" in pn or "tips" in pn:
        return "Tips Bisnis"
    return "Tips Bisnis"


def build_image_prompt(
    *,
    title: str,
    slug: str,
    pillar_name: str = "",
    focus_keyword: str = "",
    tags: list[str] | None = None,
    original_prompt: str | None = None,
) -> str:
    """Generate one specific, magazine-quality cover prompt.

    Strategy:
    - Pick 1 of 12 scenes deterministically by slug hash (anti-template distribution)
    - Apply per-pillar tweak so subject matches kategori
    - Extract keywords dari focus_keyword + title + tags (SEO-curated first)
    - If original_prompt exists (from notes), keep it as creative brief —
      replace kata tro dengan alternatif natural
    - Append style anchor (consistent brand)
    """
    keywords = _extract_keywords(title, focus_keyword, tags)
    keyword_phrase = ", ".join(keywords) if keywords else "produk UMKM lokal"

    pillar_key = _detect_pillar(pillar_name)
    scene_idx = _hash_slug_to_index(slug, len(SCENES))
    scene = SCENES[scene_idx]
    pillar_tweak = PILLAR_TWEAKS.get(pillar_key, "")

    if original_prompt:
        brief = _strip_tropes(original_prompt.strip()).rstrip(".")
        brief = re.sub(r"\s+", " ", brief).strip()
        scene_context = (
            f"Angle yang lebih otentik: {scene['subject'].lower()} "
            f"({scene['setting']})."
        )
        core = (
            f"Cover untuk artikel '{title}'. "
            f"Fokus visual: {keyword_phrase}. "
            f"{scene_context} "
            f"Brief tambahan: {brief}."
        )
    else:
        core = (
            f"Cover untuk artikel '{title}'. "
            f"Fokus visual: {keyword_phrase}. "
            f"Scene: {scene['subject']}. "
            f"Setting: {scene['setting']}. "
            f"Mood: {scene['mood']}. "
            f"Subjek terasa nyata, personal, dekat dengan kultur {keyword_phrase}."
        )

    if pillar_tweak:
        core += f" {pillar_tweak}"

    return f"{core} {STYLE_ANCHOR}"


def build_image_alt(
    *,
    title: str,
    pillar_name: str = "",
    original_alt: str | None = None,
    focus_keyword: str = "",
) -> str:
    """Generate concise Indonesian alt text, SEO-friendly, anti-template."""
    if original_alt and 10 < len(original_alt) < 140:
        return original_alt.strip()
    keywords = _extract_keywords(title, focus_keyword)
    main_kw = keywords[0] if keywords else "UMKM"
    pillar = _detect_pillar(pillar_name)
    return (
        f"Ilustrasi editorial {main_kw.lower()} untuk topik "
        f"{title[:60].lower().rstrip('.')} — tema {pillar}"
    )
