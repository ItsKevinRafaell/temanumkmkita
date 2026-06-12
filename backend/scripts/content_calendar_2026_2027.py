"""Shared content taxonomy and 120-topic calendar for 2026-2027."""

from __future__ import annotations

from calendar import monthrange
from dataclasses import dataclass
from datetime import date


@dataclass(frozen=True)
class CategorySeed:
    name: str
    slug: str


@dataclass(frozen=True)
class PillarSeed:
    key: str
    niche: str
    name: str
    description: str
    focus_keyword: str
    position_x: float
    position_y: float


@dataclass(frozen=True)
class TopicSeed:
    publish_date: str
    category: str
    pillar_key: str
    title: str
    focus_keyword: str
    intent: str
    cta: str


CATEGORIES = [
    CategorySeed("Website", "website"),
    CategorySeed("SEO & Google Maps", "seo-google-maps"),
    CategorySeed("Sosial Media", "sosial-media"),
    CategorySeed("Branding", "branding"),
    CategorySeed("Maintenance", "maintenance"),
    CategorySeed("Tips Bisnis", "tips-bisnis"),
]


PILLARS = [
    PillarSeed(
        key="website",
        niche="Website",
        name="Website UMKM",
        description="Website, landing page, company profile, CMS, UX, lead form, and web pricing for UMKM.",
        focus_keyword="website UMKM",
        position_x=0,
        position_y=140,
    ),
    PillarSeed(
        key="seo_maps",
        niche="SEO & Google Maps",
        name="SEO Lokal & Google Maps",
        description="Google Business Profile, local SEO, Maps ranking, reviews, photos, local keywords, and local landing pages.",
        focus_keyword="SEO Google Maps UMKM",
        position_x=260,
        position_y=140,
    ),
    PillarSeed(
        key="sosmed",
        niche="Sosial Media",
        name="Sosial Media UMKM",
        description="Content calendar, content pillars, captions, batch production, and social media analytics for UMKM.",
        focus_keyword="kelola sosial media UMKM",
        position_x=520,
        position_y=140,
    ),
    PillarSeed(
        key="branding",
        niche="Branding",
        name="Branding UMKM",
        description="Logo, brand guideline, color, rebranding, logo files, and visual consistency for UMKM.",
        focus_keyword="desain logo UMKM",
        position_x=780,
        position_y=140,
    ),
    PillarSeed(
        key="maintenance",
        niche="Maintenance",
        name="Maintenance Website",
        description="Backup, security, uptime, hosting, domain, speed, and website care for UMKM.",
        focus_keyword="maintenance website UMKM",
        position_x=1040,
        position_y=140,
    ),
    PillarSeed(
        key="digital_trust",
        niche="Tips Bisnis",
        name="Digital Trust & Prioritas Bisnis",
        description="Digital trust, audit, WhatsApp CTA, portfolio, proof, and yearly digital priorities for UMKM.",
        focus_keyword="digitalisasi UMKM",
        position_x=1300,
        position_y=140,
    ),
]


MONTH_TOPICS: dict[str, list[tuple[str, str, str, str, str, str]]] = {
    "2026-07": [
        ("Website", "website", "Checklist Website UMKM Sebelum Pilih Vendor", "website UMKM", "Commercial investigation", "/layanan/web-development"),
        ("SEO & Google Maps", "seo_maps", "Cara Agar Bisnis UMKM Muncul di Google Maps", "cara bisnis muncul di Google Maps", "Informational", "/layanan/seo-google-maps"),
        ("Sosial Media", "sosmed", "Kalender Konten Instagram UMKM untuk 30 Hari", "kalender konten Instagram UMKM", "Informational", "/layanan/kelola-sosial-media"),
        ("Branding", "branding", "Ciri Logo UMKM yang Terlihat Profesional", "desain logo UMKM", "Commercial investigation", "/layanan/desain-logo"),
        ("Website", "website", "Harga Website UMKM: Apa Saja yang Membuat Biaya Berbeda?", "harga website UMKM", "Commercial investigation", "/layanan/web-development"),
        ("SEO & Google Maps", "seo_maps", "Optimasi Google Business Profile untuk Pemula", "optimasi Google Business Profile", "Informational", "/layanan/seo-google-maps"),
        ("Tips Bisnis", "digital_trust", "Cara Pelanggan Menilai Bisnis dari Tampilan Online", "bisnis mudah dipercaya online", "Informational", "/kontak"),
        ("Maintenance", "maintenance", "Website UMKM Lemot: Penyebab dan Cara Mengeceknya", "website UMKM lemot", "Problem aware", "/layanan/maintenance"),
        ("Sosial Media", "sosmed", "Ide Konten Promosi UMKM yang Tidak Terasa Memaksa", "ide konten UMKM", "Informational", "/layanan/kelola-sosial-media"),
        ("Tips Bisnis", "digital_trust", "Audit Digital UMKM: 15 Hal yang Perlu Dicek Bulan Ini", "audit digital UMKM", "Informational", "/kontak"),
    ],
    "2026-08": [
        ("Website", "website", "Website Bulanan vs Sekali Bayar: Mana yang Cocok untuk UMKM?", "website bulanan UMKM", "Commercial investigation", "/layanan/web-development-bulanan"),
        ("SEO & Google Maps", "seo_maps", "Cara Minta Review Google Maps Tanpa Terlihat Maksa", "review Google Maps bisnis", "Informational", "/layanan/seo-google-maps"),
        ("Sosial Media", "sosmed", "Contoh Caption Jualan UMKM yang Tetap Natural", "caption jualan UMKM", "Informational", "/layanan/kelola-sosial-media"),
        ("Branding", "branding", "Brand Guideline Sederhana untuk UMKM", "brand guideline UMKM", "Informational", "/layanan/desain-logo"),
        ("Website", "website", "Website Company Profile UMKM: Halaman Apa Saja yang Wajib Ada?", "website company profile UMKM", "Commercial investigation", "/layanan/web-development"),
        ("SEO & Google Maps", "seo_maps", "SEO Lokal untuk UMKM: Cara Menang di Area Sendiri", "SEO lokal UMKM", "Informational", "/layanan/seo-google-maps"),
        ("Tips Bisnis", "digital_trust", "Tombol WhatsApp di Website: Teks CTA yang Lebih Meyakinkan", "WhatsApp CTA website", "Informational", "/kontak"),
        ("Maintenance", "maintenance", "Backup Website UMKM: Seberapa Sering Harus Dilakukan?", "backup website UMKM", "Informational", "/layanan/maintenance"),
        ("Sosial Media", "sosmed", "Konten Edukasi vs Promosi: Rasio yang Aman untuk UMKM", "konten edukasi UMKM", "Informational", "/layanan/kelola-sosial-media"),
        ("Tips Bisnis", "digital_trust", "Cara Menentukan Prioritas Digital UMKM saat Budget Terbatas", "prioritas digital UMKM", "Informational", "/layanan"),
    ],
    "2026-09": [
        ("Website", "website", "Landing Page vs Website Company Profile: Bedanya Apa?", "landing page UMKM", "Informational", "/layanan/web-development"),
        ("SEO & Google Maps", "seo_maps", "Cara Menentukan Kata Kunci Lokal untuk Bisnis UMKM", "kata kunci lokal UMKM", "Informational", "/layanan/seo-google-maps"),
        ("Sosial Media", "sosmed", "Cara Membuat Content Pillar untuk Instagram UMKM", "content pillar Instagram", "Informational", "/layanan/kelola-sosial-media"),
        ("Branding", "branding", "Cara Memilih Warna Brand untuk Bisnis Lokal", "warna brand UMKM", "Informational", "/layanan/desain-logo"),
        ("Website", "website", "Halaman Layanan yang Bagus: Struktur Copy untuk UMKM", "halaman layanan website", "Informational", "/layanan/web-development"),
        ("SEO & Google Maps", "seo_maps", "Foto di Google Business Profile: Apa yang Perlu Diunggah?", "foto Google Business Profile", "Informational", "/layanan/seo-google-maps"),
        ("Tips Bisnis", "digital_trust", "Portofolio Bisnis: Cara Menampilkan Bukti Kerja Agar Dipercaya", "portofolio bisnis UMKM", "Informational", "/kontak"),
        ("Maintenance", "maintenance", "Security Patch Website: Kenapa UMKM Tidak Boleh Mengabaikannya", "security website UMKM", "Problem aware", "/layanan/maintenance"),
        ("Sosial Media", "sosmed", "Hashtag Instagram UMKM: Masih Penting atau Tidak?", "hashtag Instagram UMKM", "Informational", "/layanan/kelola-sosial-media"),
        ("Tips Bisnis", "digital_trust", "Trust Signal di Website UMKM: Apa yang Membuat Orang Yakin?", "trust signal website", "Informational", "/layanan/web-development"),
    ],
    "2026-10": [
        ("Website", "website", "Tanda Website Bisnis Perlu Redesign", "redesign website UMKM", "Problem aware", "/layanan/web-development"),
        ("SEO & Google Maps", "seo_maps", "Audit Google Business Profile: Checklist Bulanan", "audit Google Business Profile", "Informational", "/layanan/seo-google-maps"),
        ("Sosial Media", "sosmed", "Cara Batch Produksi Konten Sosmed untuk UMKM Sibuk", "batch konten sosial media", "Informational", "/layanan/kelola-sosial-media"),
        ("Branding", "branding", "Kapan UMKM Perlu Rebranding?", "rebranding UMKM", "Informational", "/layanan/desain-logo"),
        ("Website", "website", "Form Kontak Website: Cara Mengubah Pengunjung Jadi Lead", "form kontak website", "Informational", "/layanan/web-development"),
        ("SEO & Google Maps", "seo_maps", "Kategori Google Business Profile: Cara Memilih yang Tepat", "kategori Google Business Profile", "Informational", "/layanan/seo-google-maps"),
        ("Tips Bisnis", "digital_trust", "Cara Membuat Penawaran Digital yang Tidak Terlihat Murahan", "penawaran digital UMKM", "Informational", "/kontak"),
        ("Maintenance", "maintenance", "Domain dan Hosting: Yang Perlu Dipahami Pemilik UMKM", "domain hosting UMKM", "Informational", "/layanan/maintenance"),
        ("Sosial Media", "sosmed", "Cara Membaca Analytics Instagram untuk UMKM", "analytics Instagram UMKM", "Informational", "/layanan/kelola-sosial-media"),
        ("Tips Bisnis", "digital_trust", "Audit Digital Akhir Kuartal untuk UMKM", "audit digital UMKM", "Informational", "/kontak"),
    ],
    "2026-11": [
        ("Website", "website", "SEO On-Page Dasar untuk Website Baru UMKM", "SEO on-page website", "Informational", "/layanan/web-development"),
        ("SEO & Google Maps", "seo_maps", "Artikel SEO untuk UMKM: Topik Apa yang Sebaiknya Ditulis?", "artikel SEO UMKM", "Informational", "/layanan/seo-google-maps"),
        ("Sosial Media", "sosmed", "Cara Menyusun Kalender Konten Desember untuk UMKM", "kalender konten Desember", "Informational", "/layanan/kelola-sosial-media"),
        ("Branding", "branding", "File Logo yang Harus Dimiliki UMKM", "file logo UMKM", "Informational", "/layanan/desain-logo"),
        ("Website", "website", "Biaya Maintenance Website Setelah Go-Live", "biaya maintenance website", "Commercial investigation", "/layanan/maintenance"),
        ("SEO & Google Maps", "seo_maps", "Local Landing Page: Kapan UMKM Perlu Halaman Area Layanan?", "local landing page", "Commercial investigation", "/layanan/seo-google-maps"),
        ("Tips Bisnis", "digital_trust", "Checklist Promo Akhir Tahun untuk Bisnis Lokal", "promo akhir tahun UMKM", "Informational", "/kontak"),
        ("Maintenance", "maintenance", "Uptime Website: Kenapa Bisnis Lokal Perlu Memantaunya", "uptime website UMKM", "Informational", "/layanan/maintenance"),
        ("Sosial Media", "sosmed", "Ide Konten Akhir Tahun yang Tidak Sekadar Diskon", "konten akhir tahun UMKM", "Informational", "/layanan/kelola-sosial-media"),
        ("Tips Bisnis", "digital_trust", "Cara Mengevaluasi Channel Digital yang Paling Menghasilkan", "evaluasi channel digital", "Informational", "/layanan"),
    ],
    "2026-12": [
        ("Website", "website", "Website Katalog atau Booking: Kapan UMKM Butuh Fitur Tambahan?", "website katalog UMKM", "Commercial investigation", "/layanan/web-development"),
        ("SEO & Google Maps", "seo_maps", "Internal Link untuk SEO UMKM: Cara Menghubungkan Artikel dan Layanan", "internal link SEO", "Informational", "/layanan/seo-google-maps"),
        ("Sosial Media", "sosmed", "Konten Libur Akhir Tahun untuk Instagram Bisnis Lokal", "konten libur akhir tahun", "Informational", "/layanan/kelola-sosial-media"),
        ("Branding", "branding", "Konsistensi Brand dari Logo ke Kemasan dan Sosial Media", "konsistensi brand UMKM", "Informational", "/layanan/desain-logo"),
        ("Website", "website", "UX Mobile Website UMKM: Checklist untuk Pengunjung HP", "UX mobile website", "Informational", "/layanan/web-development"),
        ("SEO & Google Maps", "seo_maps", "Cara Update Jam Libur di Google Business Profile", "jam libur Google Business Profile", "Informational", "/layanan/seo-google-maps"),
        ("Tips Bisnis", "digital_trust", "Audit Digital Akhir Tahun untuk UMKM", "audit digital akhir tahun", "Informational", "/kontak"),
        ("Maintenance", "maintenance", "Website Kena Hack: Langkah Pertama yang Harus Dilakukan UMKM", "website kena hack", "Problem aware", "/layanan/maintenance"),
        ("Sosial Media", "sosmed", "Cara Membuat Recap Tahunan Brand yang Menarik", "recap tahunan brand", "Informational", "/layanan/kelola-sosial-media"),
        ("Tips Bisnis", "digital_trust", "Prioritas Digital UMKM untuk Tahun Depan", "prioritas digital UMKM", "Informational", "/layanan"),
    ],
    "2027-01": [
        ("Website", "website", "Checklist Website UMKM di Awal Tahun", "checklist website UMKM", "Informational", "/layanan/web-development"),
        ("SEO & Google Maps", "seo_maps", "Kalender Konten SEO Lokal untuk Bisnis UMKM", "kalender konten SEO", "Informational", "/layanan/seo-google-maps"),
        ("Sosial Media", "sosmed", "Cara Mengubah Resolusi Bisnis Jadi Kalender Konten", "kalender konten bisnis", "Informational", "/layanan/kelola-sosial-media"),
        ("Branding", "branding", "Refresh Visual Brand Tanpa Rebranding Total", "refresh visual brand", "Informational", "/layanan/desain-logo"),
        ("Website", "website", "Cara Menulis Headline Website yang Jelas untuk UMKM", "headline website UMKM", "Informational", "/layanan/web-development"),
        ("SEO & Google Maps", "seo_maps", "Review Google di Awal Tahun: Apa yang Perlu Dibenahi?", "review Google bisnis", "Informational", "/layanan/seo-google-maps"),
        ("Tips Bisnis", "digital_trust", "Target Digital UMKM: Metrik Apa yang Perlu Dipantau?", "target digital UMKM", "Informational", "/kontak"),
        ("Maintenance", "maintenance", "Cek Domain dan Hosting di Awal Tahun", "cek domain hosting", "Informational", "/layanan/maintenance"),
        ("Sosial Media", "sosmed", "Ide Konten Edukasi untuk Bulan Januari", "konten edukasi UMKM", "Informational", "/layanan/kelola-sosial-media"),
        ("Tips Bisnis", "digital_trust", "Cara Membuat Roadmap Digital Sederhana untuk UMKM", "roadmap digital UMKM", "Informational", "/layanan"),
    ],
    "2027-02": [
        ("Website", "website", "Website untuk Bisnis Jasa: Struktur Halaman yang Meyakinkan", "website bisnis jasa", "Commercial investigation", "/layanan/web-development"),
        ("SEO & Google Maps", "seo_maps", "Cara Membuat Deskripsi Bisnis yang Bagus di Google Maps", "deskripsi bisnis Google Maps", "Informational", "/layanan/seo-google-maps"),
        ("Sosial Media", "sosmed", "Konten Valentine untuk UMKM Tanpa Terlihat Ikut-Ikutan", "konten Valentine UMKM", "Informational", "/layanan/kelola-sosial-media"),
        ("Branding", "branding", "Logo Murah vs Logo Profesional: Apa Risikonya?", "logo profesional UMKM", "Commercial investigation", "/layanan/desain-logo"),
        ("Website", "website", "Cara Memilih CMS untuk Website UMKM", "CMS website UMKM", "Informational", "/layanan/web-development"),
        ("SEO & Google Maps", "seo_maps", "Cara Menulis Artikel Lokal yang Relevan dengan Area Bisnis", "artikel lokal SEO", "Informational", "/layanan/seo-google-maps"),
        ("Tips Bisnis", "digital_trust", "Cara Membuat Promo yang Tetap Menjaga Margin", "promo UMKM", "Informational", "/kontak"),
        ("Maintenance", "maintenance", "Kenapa Website Harus Diupdate Walau Tidak Ada Fitur Baru?", "update website UMKM", "Informational", "/layanan/maintenance"),
        ("Sosial Media", "sosmed", "Cara Membuat Konten Testimoni yang Tidak Kaku", "konten testimoni UMKM", "Informational", "/layanan/kelola-sosial-media"),
        ("Tips Bisnis", "digital_trust", "Checklist Kepercayaan Online untuk Bisnis Baru", "kepercayaan online bisnis", "Informational", "/kontak"),
    ],
    "2027-03": [
        ("Website", "website", "Website untuk F&B Lokal: Menu, Lokasi, dan CTA yang Wajib Ada", "website F&B UMKM", "Commercial investigation", "/layanan/web-development"),
        ("SEO & Google Maps", "seo_maps", "Cara Menggunakan Post di Google Business Profile", "post Google Business Profile", "Informational", "/layanan/seo-google-maps"),
        ("Sosial Media", "sosmed", "Konten Ramadan untuk UMKM: Ide, Jadwal, dan CTA", "konten Ramadan UMKM", "Informational", "/layanan/kelola-sosial-media"),
        ("Branding", "branding", "Desain Logo untuk Produk Makanan: Apa yang Perlu Diperhatikan?", "logo produk makanan", "Informational", "/layanan/desain-logo"),
        ("Website", "website", "Cara Membuat FAQ Website yang Membantu Penjualan", "FAQ website UMKM", "Informational", "/layanan/web-development"),
        ("SEO & Google Maps", "seo_maps", "Cara Menjawab Review Negatif di Google Maps", "review negatif Google Maps", "Informational", "/layanan/seo-google-maps"),
        ("Tips Bisnis", "digital_trust", "Cara Menyiapkan Channel Digital untuk Musim Ramai", "channel digital UMKM", "Informational", "/layanan"),
        ("Maintenance", "maintenance", "Cara Mengecek Website Siap Menerima Traffic Musiman", "traffic website UMKM", "Informational", "/layanan/maintenance"),
        ("Sosial Media", "sosmed", "Cara Membuat Konten Behind the Scenes untuk Bisnis Lokal", "konten behind the scenes", "Informational", "/layanan/kelola-sosial-media"),
        ("Tips Bisnis", "digital_trust", "Audit Digital Akhir Kuartal Pertama", "audit digital kuartal", "Informational", "/kontak"),
    ],
    "2027-04": [
        ("Website", "website", "Website untuk Beauty dan Salon: Struktur yang Membuat Orang Booking", "website salon UMKM", "Commercial investigation", "/layanan/web-development"),
        ("SEO & Google Maps", "seo_maps", "Cara Mengoptimalkan Area Layanan di Google Business Profile", "area layanan Google Business Profile", "Informational", "/layanan/seo-google-maps"),
        ("Sosial Media", "sosmed", "Cara Membuat Konten After-Before yang Aman dan Meyakinkan", "konten before after", "Informational", "/layanan/kelola-sosial-media"),
        ("Branding", "branding", "Cara Menjaga Konsistensi Visual di Feed Instagram", "konsistensi visual Instagram", "Informational", "/layanan/desain-logo"),
        ("Website", "website", "Cara Membuat Halaman Harga yang Tidak Membuat Calon Klien Kabur", "halaman harga website", "Informational", "/layanan/web-development"),
        ("SEO & Google Maps", "seo_maps", "Kenapa NAP Consistency Penting untuk SEO Lokal?", "NAP consistency SEO", "Informational", "/layanan/seo-google-maps"),
        ("Tips Bisnis", "digital_trust", "Cara Membuat Penawaran Bundling untuk Layanan UMKM", "bundling layanan UMKM", "Informational", "/kontak"),
        ("Maintenance", "maintenance", "Cara Mengecek Form Kontak Website Masih Berfungsi", "form kontak website", "Informational", "/layanan/maintenance"),
        ("Sosial Media", "sosmed", "Cara Menentukan Jam Posting Instagram untuk Bisnis Lokal", "jam posting Instagram", "Informational", "/layanan/kelola-sosial-media"),
        ("Tips Bisnis", "digital_trust", "Metrik Digital yang Perlu Dilihat Pemilik Bisnis Setiap Bulan", "metrik digital UMKM", "Informational", "/layanan"),
    ],
    "2027-05": [
        ("Website", "website", "Website untuk Katalog Produk: Kapan Cukup Katalog, Kapan Perlu Toko Online?", "website katalog produk", "Commercial investigation", "/layanan/web-development"),
        ("SEO & Google Maps", "seo_maps", "Cara Membuat Halaman Area Layanan Tanpa Keyword Stuffing", "halaman area layanan", "Informational", "/layanan/seo-google-maps"),
        ("Sosial Media", "sosmed", "Cara Membuat Konten Edukasi dari Pertanyaan Pelanggan", "konten edukasi pelanggan", "Informational", "/layanan/kelola-sosial-media"),
        ("Branding", "branding", "Identitas Visual untuk Brand Lokal yang Baru Mulai", "identitas visual UMKM", "Commercial investigation", "/layanan/desain-logo"),
        ("Website", "website", "Cara Menulis About Us yang Terasa Manusiawi", "about us website", "Informational", "/tentang-kami"),
        ("SEO & Google Maps", "seo_maps", "Cara Mengukur Perkembangan SEO Lokal Tanpa Tools Mahal", "ukur SEO lokal", "Informational", "/layanan/seo-google-maps"),
        ("Tips Bisnis", "digital_trust", "Cara Membuat Audit Kompetitor Digital Secara Sederhana", "audit kompetitor digital", "Informational", "/kontak"),
        ("Maintenance", "maintenance", "Website Error Setelah Update: Apa yang Harus Dicek?", "website error update", "Problem aware", "/layanan/maintenance"),
        ("Sosial Media", "sosmed", "Cara Membuat Konten Soft Selling untuk UMKM", "konten soft selling", "Informational", "/layanan/kelola-sosial-media"),
        ("Tips Bisnis", "digital_trust", "Cara Menentukan Channel Digital yang Paling Prioritas", "channel digital prioritas", "Informational", "/layanan"),
    ],
    "2027-06": [
        ("Website", "website", "Audit Website Tengah Tahun untuk UMKM", "audit website UMKM", "Informational", "/layanan/web-development"),
        ("SEO & Google Maps", "seo_maps", "Audit Konten Tengah Tahun: Artikel Mana yang Perlu Diupdate?", "audit konten SEO", "Informational", "/layanan/seo-google-maps"),
        ("Sosial Media", "sosmed", "Audit Sosial Media Tengah Tahun untuk UMKM", "audit sosial media UMKM", "Informational", "/layanan/kelola-sosial-media"),
        ("Branding", "branding", "Kapan Visual Brand Perlu Dirapikan Lagi?", "visual brand UMKM", "Informational", "/layanan/desain-logo"),
        ("Website", "website", "Cara Mengecek Website Masih Relevan dengan Penawaran Bisnis", "website relevan bisnis", "Informational", "/layanan/web-development"),
        ("SEO & Google Maps", "seo_maps", "Cara Mengupdate Artikel Lama agar Tetap Relevan di Google", "update artikel lama", "Informational", "/layanan/seo-google-maps"),
        ("Tips Bisnis", "digital_trust", "Review Digital Mid-Year: Apa yang Harus Dilanjutkan dan Dihentikan?", "review digital UMKM", "Informational", "/kontak"),
        ("Maintenance", "maintenance", "Checklist Maintenance Website Tengah Tahun", "checklist maintenance website", "Informational", "/layanan/maintenance"),
        ("Sosial Media", "sosmed", "Cara Membaca Performa Konten 6 Bulan Terakhir", "performa konten Instagram", "Informational", "/layanan/kelola-sosial-media"),
        ("Tips Bisnis", "digital_trust", "Rencana Konten 6 Bulan Berikutnya untuk UMKM", "rencana konten UMKM", "Informational", "/layanan"),
    ],
}


def publish_dates_for_month(month: str, count: int) -> list[str]:
    year, month_num = (int(part) for part in month.split("-"))
    days = monthrange(year, month_num)[1]
    selected: list[str] = []
    for day in range(1, days + 1):
        current = date(year, month_num, day)
        if current.weekday() in (0, 2, 4):
            selected.append(current.isoformat())
            if len(selected) == count:
                return selected
    raise ValueError(f"Month {month} does not have {count} Monday/Wednesday/Friday slots")


def build_topics() -> list[TopicSeed]:
    topics: list[TopicSeed] = []
    for month, rows in MONTH_TOPICS.items():
        dates = publish_dates_for_month(month, len(rows))
        for publish_date, row in zip(dates, rows):
            category, pillar_key, title, focus_keyword, intent, cta = row
            topics.append(TopicSeed(publish_date, category, pillar_key, title, focus_keyword, intent, cta))
    return topics


TOPICS = build_topics()
