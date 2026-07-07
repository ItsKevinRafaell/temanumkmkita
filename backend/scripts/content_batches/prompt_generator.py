"""Generate cover image prompts — hand-drawn marker aesthetic.

Output style:
- Background: stylized illustration (bukan photorealistic) — warm pastel palette,
  energetic flat-color shapes, friendly mood
- Overlay: white hand-drawn marker strokes + doodles
- Text in image: 2-3 kata kunci in bold marker font (rendered by Imaginer as part of image)
- Aspect: 16:9 landscape

Per article varies:
- Subject (abstract / object / scene / people)
- Hero word (max 12 chars, from title keywords)
- Doodle elements (3-4 per article, purpose-driven)
- Color accent (1 of 5 palette presets, hashed by slug)

Anti-template:
- Subject variety (8 archetypes, not only "people at laptop")
- No floating tech icons, no infographic, no chart
- Every doodle has a job (not random decoration)

Template mekanism:
- STYLE_BLOCK (gaya konsisten) di-append ke semua prompt → konsistensi visual
- Hero pool keyword → dinamis dari judul artikel
- 10 subject archetypes (rotated by slug hash)
"""

from __future__ import annotations

import hashlib
import random
import re


# ─────────────────────────────────────────────────────────────────────────────
# STYLE BLOCK (konsisten untuk SEMUA cover)
# ─────────────────────────────────────────────────────────────────────────────
# Pakai ini sebagai style anchor sehingga 120 artikel satu vibe.

STYLE_BLOCK = (
    "Cover image, 16:9 landscape, energetic hand-illustrated style. "
    "Background: stylized flat illustration, soft pastel wash (warm cream, "
    "peach, teal, soft mustard, dusty pink), clean shapes, friendly mood. "
    "Subject painted in stylized illustration style (NOT photorealistic, "
    "NOT 3D, NOT corporate stock photo). "
    "Overlay: thick white hand-drawn marker strokes, organic imperfect lines, "
    "slight tilt, like someone drew them with a white paint pen. "
    "Bold white hand-lettered marker text overlaid on the image — large hero "
    "word, confident caps, slightly tilted for energy. "
    "Decorative doodles (white outline only) used purposefully — arrows, "
    "small icons, sparkles, underline squiggles — NOT random symbols, "
    "NO code brackets, NO tech-looking icons. "
    "Vibe: happy, energetic, approachable, fun — like a creative content "
    "creator's blog cover. "
    "Negative space intentional: lower 1/3 of frame usually quieter. "
    "Format: 16:9 landscape, fill edge-to-edge, no white border, no panel."
)

# Variasi tambahan biar nggak tiap-tiap prompt persis mirip.

STYLE_VARIATIONS = [
    "Slight grain texture overlay, like risograph print.",
    "Soft watercolor bleed in the background shapes.",
    "Subtle paper-texture background, warm off-white.",
    "Tiny dotted halftone shading on background shapes.",
    "Gentle color separation effect (slight CMYK misregistration).",
]


# ─────────────────────────────────────────────────────────────────────────────
# SUBJECT ARCHETYPES (variasi, bukan selalu orang)
# ─────────────────────────────────────────────────────────────────────────────
# 10 archetypes — non-people heavy biar variety. Tiap archetype adalah base
# subject + 1 hero word + 3 doodle suggestions.

SUBJECT_ARCHETYPES = [
    {
        "id": "object_floating",
        "subject": "Single hero object floating centered in the frame (notebook, plant, "
                   "camera, vintage typewriter, coffee cup, sneaker, etc) — stylized "
                   "illustration with soft shadow",
        "hero_hint": "main topic word, max 12 chars",
        "doodle_kit": [
            "small sparkle star near hero object",
            "tiny squiggly underline below hero word",
            "tiny arrow pointing down at object",
            "small label tag near corner",
        ],
    },
    {
        "id": "scene_quiet",
        "subject": "Quiet scene of a desk / meja kerja viewed from above with "
                   "stylized elements — notebook, glasses, plant, mug, lamp — soft "
                   "pastel illustration",
        "hero_hint": "topic word, max 12 chars",
        "doodle_kit": [
            "tiny dashed circle around one item",
            "small sparkle near top-left corner",
            "underline squiggle below hero word",
            "tiny '+' near one item",
        ],
    },
    {
        "id": "scene_active",
        "subject": "Active lifestyle scene — person walking, biking, in nature, "
                   "at market, cooking — illustrated in flat-color style (NOT photo, "
                   "NOT 3D)",
        "hero_hint": "main word, max 12 chars",
        "doodle_kit": [
            "speed lines / motion marks",
            "sparkles around main figure",
            "underline squiggle",
            "small star sparkle",
        ],
    },
    {
        "id": "abstract_shapes",
        "subject": "Abstract composition of playful shapes — circles, blobs, "
                   "ribbons, organic curves — in warm pastel palette, energy-filled "
                   "but balanced",
        "hero_hint": "topic word, max 12 chars",
        "doodle_kit": [
            "small wavy underline below hero word",
            "tiny dot clusters in 2 corners",
            "arrow swoosh connecting shapes",
            "small star sparkle",
        ],
    },
    {
        "id": "big_illustration",
        "subject": "Big stylized illustration occupies 2/3 of frame — could be a "
                   "creative concept like a giant lightbulb made of brushstrokes, "
                   "an oversized pencil, a phone showing sketch, a giant checklist "
                   "with checkmarks filled in",
        "hero_hint": "topic word, max 12 chars",
        "doodle_kit": [
            "underlining brushstroke under hero",
            "tiny stars/sparkles around illustration",
            "small detail callout with arrow",
            "small label tag",
        ],
    },
    {
        "id": "people_2",
        "subject": "Two illustrated figures interacting (talking, looking at same "
                   "thing, pointing) — stylized, NOT photorealistic, friendly "
                   "expressions, casual",
        "hero_hint": "topic word, max 12 chars",
        "doodle_kit": [
            "speech-bubble outline shape",
            "sparkle between the two",
            "underline under hero word",
            "small connecting line between figures",
        ],
    },
    {
        "id": "people_one",
        "subject": "One illustrated person (waist-up, stylized friendly face) "
                   "doing the activity — holding laptop, sketching, talking, "
                   "thinking — flat-color style",
        "hero_hint": "topic word, max 12 chars",
        "doodle_kit": [
            "thought bubble outline",
            "sparkles around face",
            "underlining brushstroke",
            "small star near top",
        ],
    },
    {
        "id": "food_object",
        "subject": "Subject is food / drink / product items arranged playfully "
                   "(bowl of noodles, pastries, drinks, packaged goods) — "
                   "stylized illustration, warm inviting vibe",
        "hero_hint": "topic word, max 12 chars",
        "doodle_kit": [
            "steam swirls",
            "small heart sparkle",
            "underline brushstroke",
            "tiny dot pattern",
        ],
    },
    {
        "id": "concept_skeleton",
        "subject": "Concept diagram-ish but fun — like a roadmap with arrows, "
                   "checklist with checkmarks, calendar grid with highlighted dates, "
                   "step-by-step visual — but FLAT ILLUSTRATION style, NOT "
                   "infographic, NO tech UI feel",
        "hero_hint": "topic word, max 12 chars",
        "doodle_kit": [
            "sparkles along the path",
            "small star at endpoint",
            "underline under hero word",
            "tiny dot border in 1 corner",
        ],
    },
    {
        "id": "collage",
        "subject": "Friendly paper-cutout collage style — overlapping shapes, "
                   "torn-paper effect, mixed textures, warm tones — feels "
                   "handcrafted and personal",
        "hero_hint": "topic word, max 12 chars",
        "doodle_kit": [
            "small sparkle in gap between papers",
            "underline brushstroke",
            "tiny stars scattered",
            "small label tag at edge",
        ],
    },
]


# ─────────────────────────────────────────────────────────────────────────────
# COLOR PALETTES (rotate per slug hash)
# ─────────────────────────────────────────────────────────────────────────────

PALETTES = [
    {
        "name": "warm_sunset",
        "primary": "warm peach and cream",
        "accent": "terracotta red",
        "secondary": "soft mustard yellow",
        "background_note": "soft peach background, terracotta accents, mustard highlights",
    },
    {
        "name": "fresh_morning",
        "primary": "mint cream and soft sage",
        "accent": "deep teal",
        "secondary": "warm cream",
        "background_note": "mint wash background, teal accents, cream highlights",
    },
    {
        "name": "happy_coral",
        "primary": "coral pink and cream",
        "accent": "deep berry",
        "secondary": "buttercream",
        "background_note": "coral wash background, berry accents, buttercream highlights",
    },
    {
        "name": "sunny_calm",
        "primary": "warm mustard and dusty pink",
        "accent": "burnt orange",
        "secondary": "light cream",
        "background_note": "mustard wash background, burnt-orange accents, dusty pink highlights",
    },
    {
        "name": "cool_compose",
        "primary": "powder blue and cream",
        "accent": "navy",
        "secondary": "warm peach",
        "background_note": "powder blue background, navy accents, peach highlights",
    },
]


# ─────────────────────────────────────────────────────────────────────────────
# HERO WORD EXTRACTION (judul → 1-3 kata pendek)
# ─────────────────────────────────────────────────────────────────────────────

STOPWORDS = {
    "yang", "untuk", "dengan", "dari", "pada", "adalah", "ini", "itu", "atau",
    "dan", "di", "ke", "oleh", "cara", "agar", "supaya", "biar", "jangan",
    "sudah", "belum", "akan", "tidak", "kalau", "bila", "jika", "saat", "ketika",
    "umkm", "bisnis", "lokal", "indonesia",
}


def _detect_pillar(pillar_name: str) -> str:
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
    return "Tips Bisnis"


def _slug_hash(slug: str, modulo: int, seed: int = 0) -> int:
    """Deterministic slot assignment."""
    h = hashlib.sha256((str(seed) + slug).encode("utf-8")).digest()
    return int.from_bytes(h[:4], "big") % modulo


def _extract_hero_word(title: str, focus_keyword: str = "") -> str:
    """Kasih 1 hero word max 12 char uppercase."""
    candidates: list[str] = []

    if focus_keyword:
        # Ambil 2 kata terakhir dari focus_keyword
        tokens = [
            t for t in re.split(r"[\s,]+", focus_keyword.strip())
            if t.lower() not in STOPWORDS and len(t) >= 3
        ]
        if tokens:
            # Coba 2 kata kalau muat
            if len(tokens) >= 2:
                pair = f"{tokens[-2].upper()} {tokens[-1].upper()}"
                if len(pair) <= 15:
                    candidates.append(pair)
            candidates.append(tokens[-1].upper())

    # Fallback ke title nouns
    if not candidates:
        tokens = re.findall(r"[A-Za-zÀ-ÿ]+", title)
        for tok in tokens:
            if tok.lower() in STOPWORDS or len(tok) < 4:
                continue
            candidates.append(tok.upper())

    # Pilih yg nggak kepanjangan
    for cand in candidates:
        if len(cand) <= 14:
            return cand

    # Truncate fallback
    return (candidates[0] if candidates else "IDE")[:14]


def _extract_keywords_for_alt(title: str, focus_keyword: str = "") -> list[str]:
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
        if tok.lower() in STOPWORDS or len(tok) < 4:
            continue
        key = tok.lower()
        if key not in seen:
            parts.append(tok)
            seen.add(key)
    return parts[:4]


# ─────────────────────────────────────────────────────────────────────────────
# MAIN PROMPT BUILDER (template-style)
# ─────────────────────────────────────────────────────────────────────────────


def build_image_prompt(
    *,
    title: str,
    slug: str,
    pillar_name: str = "",
    focus_keyword: str = "",
    tags: list[str] | None = None,
    original_prompt: str | None = None,  # noqa: ARG001
) -> str:
    """Generate one specific, hand-drawn-marker cover prompt.

    Template:
      [SUBJECT FROM ARCHETYPE] + [HERO WORD FROM TITLE]
      + [PALETTE NOTE] + [DOODLE KIT 3-4 elements]
      + STYLE_BLOCK
    """
    archetype_idx = _slug_hash(slug, len(SUBJECT_ARCHETYPES), seed=0)
    palette_idx = _slug_hash(slug, len(PALETTES), seed=1)
    style_var_idx = _slug_hash(slug, len(STYLE_VARIATIONS), seed=2)

    archetype = SUBJECT_ARCHETYPES[archetype_idx]
    palette = PALETTES[palette_idx]
    style_var = STYLE_VARIATIONS[style_var_idx]

    hero_word = _extract_hero_word(title, focus_keyword)

    # 3-4 doodle elements, picked deterministically
    rng = random.Random(slug)
    doodles = rng.sample(archetype["doodle_kit"], k=min(4, len(archetype["doodle_kit"])))

    # Subject description
    subject_part = (
        f"SUBJECT: {archetype['subject']} "
        f"This subject represents the article topic '{title}' "
        f"for Teman UMKM Kita audience."
    )

    # Hero text (rendered by Imaginer on the image)
    hero_part = (
        f"OVERLAY TEXT: Write '{hero_word}' as big bold white hand-lettered "
        f"marker text, centered-lower or upper-right, slightly tilted 3-5° "
        f"for energy. Confident caps, vibrant strokes."
    )

    # Palette guidance
    palette_part = (
        f"COLOR PALETTE: {palette['background_note']}. "
        f"Primary flat-color shapes in {palette['primary']}, "
        f"accent details in {palette['accent']}, "
        f"highlights in {palette['secondary']}."
    )

    # Doodle direction
    doodle_part = (
        f"WHITE DOODLE OVERLAYS (each must have a clear purpose, NOT random): "
        + " | ".join(doodles)
    )

    parts = [
        subject_part,
        hero_part,
        palette_part,
        doodle_part,
        STYLE_BLOCK,
        style_var,
    ]
    full = "\n\n".join(parts)

    # Safety truncate ke 1900 chars
    if len(full) > 1900:
        full = full[:1900].rsplit(".", 1)[0] + "."
    return full


def build_image_alt(
    *,
    title: str,
    pillar_name: str = "",
    original_alt: str | None = None,
    focus_keyword: str = "",
) -> str:
    """Generate alt text for SEO (always Bahasa Indonesia)."""
    if original_alt and 10 < len(original_alt) < 140:
        return original_alt.strip()
    keywords = _extract_keywords_for_alt(title, focus_keyword)
    main_kw = keywords[0] if keywords else "UMKM"
    pillar = _detect_pillar(pillar_name)
    title_low = title[:60].lower().rstrip(".")
    return (
        f"Ilustrasi hand-drawn bertema {main_kw.lower()} untuk artikel "
        f"{title_low} — kategori {pillar}"
    )
