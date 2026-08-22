"""Render preview web usaha dari template token-based (tool Preview Bisnis).

22 template HTML per-industri (token {{BIZ_NAME}} dll) + konten per-industri di
render_data/<slug>.json. Fungsi render_preview_html():
  input  : jenis usaha (bebas) + nama + kota
  proses : detect industri -> load template + render_data -> swap SEMUA token
  output : HTML jadi (self-contained, CSS inline) siap masuk <iframe srcdoc>

TANPA Playwright/screenshot — murni string replace, instan. Foto di-serve
sebagai URL statik dari frontend (/tools-preview/photos/<slug>/NN.jpg).

Data ilustratif (telepon, rating, alamat) = contoh tampilan, diberi disclaimer
di UI. Nama & kota = dari input user (asli).
"""

from __future__ import annotations

import json
import os
import re

_HERE = os.path.dirname(os.path.abspath(__file__))
_TPL_DIR = os.path.join(_HERE, "templates")
_RD_DIR = os.path.join(_HERE, "render_data")

# Import katalog industri (detect + palette) dari file yang sama dir.
# catalog.py di-copy dari MVP auto-web-prospek (22 industri, keyword scoring).
import importlib.util as _ilu

_spec = _ilu.spec_from_file_location("_tools_catalog", os.path.join(_HERE, "catalog.py"))
_catalog = _ilu.module_from_spec(_spec)  # type: ignore
_spec.loader.exec_module(_catalog)  # type: ignore

detect_industry = _catalog.detect_industry
palette_for = _catalog.palette_for
list_industries = _catalog.list_industries
template_dir = _catalog.template_dir


# URL publik foto (di-serve Next.js static dari public/tools-preview/photos/).
# Absolut ke domain FE biar kebaca di iframe srcdoc (srcdoc = origin null).
_PHOTO_BASE = "https://www.temanumkmkita.com/tools-preview/photos"

# Cache template + render_data (baca sekali, proses restart clear).
_tpl_cache: dict[str, str] = {}
_rd_cache: dict[str, dict] = {}


def _load_template(slug: str) -> str | None:
    if slug in _tpl_cache:
        return _tpl_cache[slug]
    path = os.path.join(_TPL_DIR, template_dir(slug), "index.html")
    if not os.path.exists(path):
        return None
    with open(path, encoding="utf-8") as f:
        html = f.read()
    _tpl_cache[slug] = html
    return html


def _load_render_data(slug: str) -> dict:
    if slug in _rd_cache:
        return _rd_cache[slug]
    path = os.path.join(_RD_DIR, f"{slug}.json")
    data: dict = {}
    if os.path.exists(path):
        try:
            with open(path, encoding="utf-8") as f:
                data = json.load(f)
        except Exception:
            data = {}
    _rd_cache[slug] = data
    return data


def _photo_urls(slug: str, n: int = 6) -> list[str]:
    """URL foto industri (NN.jpg 01..06). Fallback ke foto industri lain kalau
    kosong tidak dilakukan — semua 22 industri sudah punya >=6 foto."""
    return [f"{_PHOTO_BASE}/{slug}/{i:02d}.jpg" for i in range(1, n + 1)]


def _initials(name: str) -> str:
    parts = [p for p in re.split(r"\s+", name.strip()) if p]
    if not parts:
        return "U"
    if len(parts) == 1:
        return parts[0][0].upper()
    return (parts[0][0] + parts[-1][0]).upper()


def render_preview_html(nama_usaha: str, jenis_usaha: str, kota: str) -> dict:
    """Return {ok, slug, label, html} atau {ok: False, error}."""
    nama = (nama_usaha or "").strip()
    jenis = (jenis_usaha or "").strip()
    kota = (kota or "").strip() or "Balikpapan"
    if not nama or not jenis:
        return {"ok": False, "error": "nama & jenis usaha wajib"}

    slug = detect_industry(jenis) or detect_industry(nama)
    if not slug:
        # Fallback ke jasa-b2b (template netral) biar user tetap dapat preview.
        slug = "jasa-b2b"

    html = _load_template(slug)
    if html is None:
        return {"ok": False, "error": f"template {slug} tidak ada"}

    rd = _load_render_data(slug)
    brand, accent = palette_for(slug, 0)
    photos = _photo_urls(slug)

    def g(i: int) -> str:
        return photos[i % len(photos)]

    # Logo = teks NAMA USAHA (bukan inisial lingkaran). SVG data-uri biar tetap
    # dipakai lewat <img src="{{LOGO_URL}}"> di template tanpa jebol layout.
    import html as _html
    import urllib.parse

    # Escape utk XML/SVG + lebar auto ngikut panjang nama (biar ga kepotong).
    _logo_text = _html.escape(nama, quote=True)
    _char_w = 15  # perkiraan lebar per-karakter (font-size 26, bold)
    _logo_w = max(120, min(len(nama) * _char_w + 24, 420))
    logo_svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{_logo_w}" height="48" '
        f'viewBox="0 0 {_logo_w} 48">'
        f'<text x="0" y="34" font-family="Arial,Helvetica,sans-serif" font-size="26" '
        f'font-weight="800" fill="{brand}">{_logo_text}</text></svg>'
    )

    logo_uri = "data:image/svg+xml," + urllib.parse.quote(logo_svg)

    # Token dasar (data user + ilustratif). render_data (konten industri) di-merge
    # DULU, lalu di-override oleh yang di bawah (BIZ_NAME/CITY dari user menang).
    tokens: dict[str, str] = dict(rd)  # copy konten industri
    tokens.update(
        {
            "BIZ_NAME": nama,
            "CITY": kota,
            "PHONE": "0812-3456-7890",
            "ADDRESS": f"Jl. Contoh No. 10, {kota}",
            "MAPS": "https://maps.google.com",
            "RATING": "4.9",
            "REVIEWS": "120",
            "BRAND_HEX": brand,
            "ACCENT_HEX": accent,
            "LOGO_URL": logo_uri,
            "HERO_IMG": g(0),
            "IMG_1": g(0),
            "IMG_2": g(1),
            "IMG_3": g(2),
            "IMG_4": g(3),
            "IMG_5": g(4),
            "IMG_6": g(5),
            "PROOF_IMG_1": g(0),
            "PROOF_IMG_2": g(3),
        }
    )

    # Swap semua {{TOKEN}}.
    def _replace(m: re.Match) -> str:
        key = m.group(1)
        return str(tokens.get(key, ""))  # token tak dikenal -> kosong (jangan bocor)

    rendered = re.sub(r"\{\{([A-Z0-9_]+)\}\}", _replace, html)

    label = dict(list_industries()).get(slug, slug)
    return {"ok": True, "slug": slug, "label": label, "html": rendered}
