"""
Katalog industri untuk Auto-Web-Preview Configurator (FASE 1 / MVP lokal).

Mapping: jenis usaha (input user) -> template + render_data + palet default.
Juga: auto-detect kategori dari keyword bebas yang diketik prospek.

CATATAN JUJUR (raka): pool palet 6-8/industri yang disebut di SPEC BELUM ada
sebagai aset kode. Di sini gua isi seed 2-3 palet/industri (hex lolos-kontras
dasar: brand gelap + accent terang) supaya alur MVP jalan. Ini placeholder
yang perlu di-expand + di-QA kontras beneran sebelum produksi.
"""

# 22 industri terverifikasi punya template-v1 + render_data + >=6 foto.
# key = slug industri (= nama folder template tanpa -v1)
INDUSTRIES = {
    "kontraktor":       {"label": "Kontraktor / Bangunan / Renovasi", "keywords": ["kontraktor", "bangun", "renovasi", "konstruksi", "sipil", "borongan", "rab", "gudang"]},
    "alat-berat":       {"label": "Alat Berat (jual/sewa/sparepart)", "keywords": ["alat berat", "excavator", "forklift", "crane", "beko", "loader", "dozer"]},
    "otomotif":         {"label": "Otomotif / Bengkel / Sparepart", "keywords": ["bengkel", "otomotif", "sparepart", "mobil", "motor", "modif", "servis", "ban", "oli"]},
    "jasa-b2b":         {"label": "Jasa B2B / Supplier / Fabrikasi", "keywords": ["supplier", "distributor", "fabrikasi", "welding", "industri", "b2b", "las"]},
    "properti":         {"label": "Properti / Agen / Developer", "keywords": ["properti", "rumah", "ruko", "developer", "agen", "kost", "tanah", "kavling"]},
    "kesehatan":        {"label": "Kesehatan / Klinik / Dokter", "keywords": ["klinik", "dokter", "gigi", "fisio", "kesehatan", "kecantikan", "apotek", "medis"]},
    "hukum":            {"label": "Hukum & Notaris", "keywords": ["hukum", "notaris", "advokat", "pengacara", "legal", "ppat"]},
    "konsultan":        {"label": "Konsultan (pajak/HR/izin)", "keywords": ["konsultan", "pajak", "akuntan", "hr", "izin usaha", "konsultasi"]},
    "konstruksi-kecil": {"label": "Konstruksi Kecil (AC/plumbing/listrik)", "keywords": ["ac", "plumbing", "listrik", "anti rayap", "instalasi", "service ac"]},
    "percetakan":       {"label": "Percetakan & Advertising", "keywords": ["percetakan", "cetak", "advertising", "banner", "spanduk", "sablon", "digital printing"]},
    "eo-wedding":       {"label": "EO & Wedding Organizer", "keywords": ["eo", "wedding", "event", "organizer", "pernikahan", "dekorasi", "acara"]},
    "pendidikan":       {"label": "Pendidikan / Bimbel / Kursus", "keywords": ["bimbel", "kursus", "les", "pendidikan", "sekolah", "training", "pelatihan"]},
    "travel":           {"label": "Travel & Tour", "keywords": ["travel", "tour", "wisata", "paket wisata", "umroh", "trip", "rental mobil"]},
    "laundry-b2b":      {"label": "Laundry B2B / Hotel", "keywords": ["laundry", "cuci", "linen", "hotel", "binatu"]},
    "interior":         {"label": "Interior & Furniture Custom", "keywords": ["interior", "furniture", "mebel", "custom", "desain interior", "kitchen set"]},
    "atk":              {"label": "Supplier ATK", "keywords": ["atk", "alat tulis", "kantor", "stationery", "supplier kantor"]},
    "cleaning-b2b":     {"label": "Cleaning Service B2B", "keywords": ["cleaning", "kebersihan", "cleaning service", "janitor", "ob"]},
    "konveksi":         {"label": "Konveksi / Fashion B2B", "keywords": ["konveksi", "kaos", "seragam", "jahit", "garmen", "fashion", "sablon kaos"]},
    "toko-bangunan":    {"label": "Toko Bangunan / Material", "keywords": ["toko bangunan", "material", "semen", "besi", "bahan bangunan", "keramik"]},
    "pertanian":        {"label": "Pertanian / Perikanan (supplier/alat)", "keywords": ["pertanian", "perikanan", "pupuk", "bibit", "tani", "alat pertanian", "pakan"]},
    "ekspedisi":        {"label": "Ekspedisi / Logistik Lokal", "keywords": ["ekspedisi", "logistik", "cargo", "kirim", "pengiriman", "kurir", "trucking"]},
    "salon":            {"label": "Salon / Barbershop", "keywords": ["salon", "barber", "barbershop", "potong rambut", "cukur", "spa"]},
}

# Template & render_data slug = key (semua pola <key>-v1 dan render_data/<key>.json)
def template_dir(slug):
    return f"{slug}-v1"

def render_data_file(slug):
    return f"render_data/{slug}.json"


# Seed palet per industri: (brand_hex gelap, accent_hex terang), + varian.
# Default index 0. Ini SEED, bukan pool QA-kontras final (lihat catatan atas).
PALETTES = {
    "kontraktor":       [("#1b3a5b", "#e8a33d"), ("#22303f", "#f2b134"), ("#2c2a2e", "#d98324")],
    "alat-berat":       [("#232a31", "#f5a623"), ("#1c2833", "#e67e22"), ("#2b2b2b", "#f1c40f")],
    "otomotif":         [("#171a1f", "#e63946"), ("#1e262e", "#ff6b35"), ("#22252a", "#f4511e")],
    "jasa-b2b":         [("#1a2b40", "#2e86de"), ("#22303f", "#26a69a"), ("#263238", "#00acc1")],
    "properti":         [("#1e3a34", "#c8a45c"), ("#243b53", "#d4af7a"), ("#2d3436", "#b8860b")],
    "kesehatan":        [("#12463f", "#2ec4b6"), ("#1a5276", "#48c9b0"), ("#155e63", "#5dd6c0")],
    "hukum":            [("#1c2331", "#b08d57"), ("#22252a", "#a67c52"), ("#2c3e50", "#c9a24b")],
    "konsultan":        [("#1f3a5f", "#3d9970"), ("#22303f", "#2e86de"), ("#263238", "#26a69a")],
    "konstruksi-kecil": [("#1b3a5b", "#f39c12"), ("#22303f", "#3498db"), ("#2c2a2e", "#e67e22")],
    "percetakan":       [("#1a1a2e", "#e94560"), ("#16213e", "#ff6b6b"), ("#22253a", "#f47c48")],
    "eo-wedding":       [("#2d1b2e", "#c9a24b"), ("#3a2438", "#d4a5c9"), ("#2b1f2d", "#e0b0b0")],
    "pendidikan":       [("#1a3a5c", "#f5a623"), ("#1e3d59", "#3498db"), ("#22303f", "#2ecc71")],
    "travel":           [("#0d3b66", "#f4a261"), ("#164e63", "#f6a623"), ("#1a4d5c", "#2ec4b6")],
    "laundry-b2b":      [("#1a3a5c", "#4ea8de"), ("#22303f", "#00acc1"), ("#1e3d59", "#48c9b0")],
    "interior":         [("#2b2b2b", "#c8a45c"), ("#26312e", "#b8860b"), ("#2d3436", "#d4af7a")],
    "atk":              [("#1a2b40", "#2e86de"), ("#22303f", "#f5a623"), ("#263238", "#26a69a")],
    "cleaning-b2b":     [("#12463f", "#2ec4b6"), ("#1a3a5c", "#4ea8de"), ("#155e63", "#5dd6c0")],
    "konveksi":         [("#1a1a2e", "#e94560"), ("#22253a", "#f5a623"), ("#2c2a2e", "#26a69a")],
    "toko-bangunan":    [("#232a31", "#f5a623"), ("#1c2833", "#e67e22"), ("#2b2b2b", "#f39c12")],
    "pertanian":        [("#1e3a2f", "#8bc34a"), ("#22402f", "#a3c644"), ("#26402c", "#c0ca33")],
    "ekspedisi":        [("#1a2b40", "#f5a623"), ("#22303f", "#2e86de"), ("#263238", "#ff6b35")],
    "salon":            [("#2d1b3d", "#d4a5c9"), ("#3a2438", "#c9a24b"), ("#2b1f2d", "#e0b0b0")],
}

def detect_industry(text):
    """Auto-detect slug industri dari teks bebas. Return slug atau None."""
    if not text:
        return None
    t = text.strip().lower()
    # exact slug / label match dulu
    if t in INDUSTRIES:
        return t
    # keyword scoring
    best, best_score = None, 0
    for slug, meta in INDUSTRIES.items():
        score = 0
        for kw in meta["keywords"]:
            if kw in t:
                score += len(kw)  # keyword lebih panjang = lebih spesifik
        if score > best_score:
            best, best_score = slug, score
    return best  # None kalau ga ada yang match

def palette_for(slug, variant=0):
    pal = PALETTES.get(slug, [("#22303f", "#f5a623")])
    return pal[variant % len(pal)]

def list_industries():
    return [(slug, meta["label"]) for slug, meta in INDUSTRIES.items()]
