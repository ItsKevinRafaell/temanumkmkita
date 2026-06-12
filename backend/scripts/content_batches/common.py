"""Helpers for seedable article draft batches."""

from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Any


@dataclass(frozen=True)
class Source:
    label: str
    url: str


@dataclass(frozen=True)
class ArticleDraft:
    title: str
    slug: str
    excerpt: str
    category: str
    pillar_name: str
    tags: list[str]
    read_time: int
    seo_title: str
    meta_description: str
    focus_keyword: str
    target_cta: str
    image_prompt: str
    image_alt: str
    key_takeaways: list[str]
    audience_problem: str
    practical_angle: str
    checklist: list[str]
    action_steps: list[str]
    mistakes: list[str]
    scenario: str
    faq: list[tuple[str, str]]
    sources: list[Source]


def heading_id(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s-]", "", text)
    text = re.sub(r"\s+", "-", text).strip("-")
    return text or "section"


def words_in_blocks(blocks: list[dict[str, Any]]) -> int:
    parts: list[str] = []
    for block in blocks:
        kind = block["type"]
        if kind in {"h2", "h3", "p", "blockquote"}:
            parts.append(block.get("text", ""))
        elif kind in {"ul", "ol", "key-takeaway"}:
            parts.extend(block.get("items", []))
        elif kind == "faq":
            for item in block.get("items", []):
                parts.append(item.get("question", ""))
                parts.append(item.get("answer", ""))
        elif kind == "howto":
            for step in block.get("steps", []):
                parts.append(step.get("name", ""))
                parts.append(step.get("text", ""))
        elif kind == "source":
            parts.extend(item.get("label", "") for item in block.get("items", []))
    return len(" ".join(parts).split())


def build_blocks(article: ArticleDraft) -> list[dict[str, Any]]:
    first_takeaway = article.key_takeaways[0] if article.key_takeaways else article.practical_angle
    second_takeaway = article.key_takeaways[1] if len(article.key_takeaways) > 1 else article.audience_problem
    third_takeaway = article.key_takeaways[2] if len(article.key_takeaways) > 2 else article.target_cta

    blocks: list[dict[str, Any]] = [
        {"type": "key-takeaway", "items": article.key_takeaways},
        {
            "type": "p",
            "text": (
                f"Banyak pemilik UMKM baru sadar pentingnya {article.focus_keyword} saat calon pelanggan mulai "
                f"membandingkan bisnisnya dengan kompetitor. Masalahnya, keputusan digital sering dibuat terburu-buru: "
                f"ikut saran teman, meniru kompetitor, atau memilih opsi paling murah tanpa tahu dampaknya."
            ),
        },
        {
            "type": "p",
            "text": (
                f"Artikel ini membantu kamu melihat {article.focus_keyword} secara lebih praktis. Fokusnya bukan teori "
                f"rumit, tapi langkah yang bisa dicek sendiri sebelum mengeluarkan budget. {article.audience_problem}"
            ),
        },
        {"type": "h2", "id": heading_id("Kenapa ini penting untuk UMKM"), "text": "Kenapa Ini Penting untuk UMKM"},
        {
            "type": "p",
            "text": (
                f"Untuk bisnis kecil, kesalahan digital jarang terlihat sebagai satu masalah besar. Biasanya ia muncul "
                f"pelan-pelan: pesan WhatsApp makin sepi, profil bisnis jarang dikunjungi, postingan tidak konsisten, "
                f"atau website ada tetapi tidak membuat orang yakin. Di titik itu, {article.focus_keyword} bukan lagi "
                f"hiasan, melainkan bagian dari cara bisnis terlihat layak dipilih."
            ),
        },
        {
            "type": "p",
            "text": (
                f"{article.practical_angle} Dengan melihatnya seperti ini, kamu bisa memutuskan mana yang perlu "
                f"dikerjakan sekarang, mana yang bisa ditunda, dan mana yang sebaiknya dibantu pihak luar."
            ),
        },
        {"type": "h2", "id": heading_id("Tanda awal yang perlu dicek"), "text": "Tanda Awal yang Perlu Dicek"},
        {
            "type": "p",
            "text": (
                f"Sebelum membuat keputusan, mulai dari tanda yang paling mudah diamati. Jangan langsung lompat ke "
                f"solusi mahal. Cek apakah masalahnya ada di visibilitas, kepercayaan, konsistensi, atau alur calon "
                f"pelanggan setelah menemukan bisnismu."
            ),
        },
        {"type": "ul", "items": [
            f"{first_takeaway}.",
            f"{second_takeaway}.",
            f"{third_takeaway}.",
            "Calon pelanggan masih perlu bertanya hal dasar yang seharusnya sudah jelas di kanal digital.",
            "Tim internal bingung harus memperbaiki bagian mana terlebih dulu.",
        ]},
        {"type": "h2", "id": heading_id("Checklist utama"), "text": "Checklist Utama"},
        {
            "type": "p",
            "text": (
                f"Gunakan checklist ini sebagai audit awal. Tidak semua poin harus sempurna hari ini, tetapi setiap "
                f"jawaban yang masih abu-abu menunjukkan pekerjaan yang perlu diprioritaskan."
            ),
        },
        {"type": "ol", "items": article.checklist},
        {"type": "h2", "id": heading_id("Cara menerapkannya tanpa ribet"), "text": "Cara Menerapkannya Tanpa Ribet"},
        {
            "type": "p",
            "text": (
                f"Pendekatan yang paling aman untuk UMKM adalah mulai dari bagian yang paling dekat dengan keputusan "
                f"pelanggan. Kalau pelanggan belum menemukan kamu, perbaiki visibilitas. Kalau sudah menemukan tapi "
                f"belum yakin, perbaiki bukti, copy, tampilan, dan CTA."
            ),
        },
        {"type": "howto", "steps": [
            {"name": f"Petakan masalah {article.focus_keyword}", "text": article.action_steps[0]},
            {"name": "Tentukan prioritas satu bulan", "text": article.action_steps[1]},
            {"name": "Siapkan bukti dan data pendukung", "text": article.action_steps[2]},
            {"name": "Review hasil sebelum menambah pekerjaan baru", "text": article.action_steps[3]},
        ]},
        {"type": "h2", "id": heading_id("Kesalahan umum"), "text": "Kesalahan Umum"},
        {
            "type": "p",
            "text": (
                f"Bagian ini penting karena banyak UMKM bukan gagal karena tidak bergerak, tapi karena bergerak tanpa "
                f"urutan. Akhirnya budget habis untuk hal yang terlihat ramai, bukan hal yang membuat pelanggan lebih "
                f"mudah percaya dan menghubungi."
            ),
        },
        {"type": "ul", "items": article.mistakes},
        {"type": "h2", "id": heading_id("Contoh skenario UMKM"), "text": "Contoh Skenario UMKM"},
        {"type": "p", "text": article.scenario},
        {
            "type": "p",
            "text": (
                f"Dari skenario itu, keputusan yang masuk akal bukan langsung melakukan semuanya. Pilih satu prioritas, "
                f"jalankan selama 30 hari, lalu lihat apakah ada perubahan pada pertanyaan masuk, klik WhatsApp, "
                f"kunjungan profil, atau kualitas calon pelanggan."
            ),
        },
        {"type": "h2", "id": heading_id("Cara membaca hasilnya"), "text": "Cara Membaca Hasilnya"},
        {
            "type": "p",
            "text": (
                f"Setelah perubahan berjalan, jangan hanya menilai dari rasa. Untuk topik {article.focus_keyword}, lihat "
                f"indikator yang dekat dengan keputusan pelanggan: apakah pertanyaan masuk lebih jelas, apakah calon pelanggan "
                f"lebih cepat paham layanan, apakah klik ke WhatsApp bertambah, dan apakah komplain tentang informasi dasar "
                f"berkurang. Angka kecil tetap berguna kalau dicatat konsisten."
            ),
        },
        {
            "type": "p",
            "text": (
                f"Kalau hasil belum terlihat, jangan langsung mengganti semua strategi. Cek dulu apakah fondasinya sudah rapi: "
                f"informasi bisnis konsisten, CTA mudah ditemukan, bukti kepercayaan tersedia, dan konten menjawab pertanyaan "
                f"pelanggan. Perbaikan digital untuk UMKM biasanya menang dari akumulasi langkah kecil yang benar, bukan satu "
                f"aksi besar yang dilakukan sesekali."
            ),
        },
        {"type": "h2", "id": heading_id("Kapan perlu bantuan"), "text": "Kapan Perlu Bantuan?"},
        {
            "type": "p",
            "text": (
                f"Kamu bisa mengerjakan sebagian langkah ini sendiri kalau punya waktu dan orang yang konsisten. Tetapi "
                f"kalau bisnis sudah berjalan, sering kali biaya terbesar bukan hanya uang, melainkan waktu yang habis "
                f"untuk mencoba tanpa arah. Di titik itu, bantuan eksternal bisa mempercepat audit, prioritas, eksekusi, "
                f"dan evaluasi."
            ),
        },
        {"type": "cta-inline"},
        {"type": "h2", "id": heading_id("Pertanyaan umum"), "text": "Pertanyaan Umum"},
        {"type": "faq", "items": [{"question": q, "answer": a} for q, a in article.faq]},
        {
            "type": "p",
            "text": (
                f"Catatan untuk cover image: {article.image_prompt} Alt text yang disarankan: {article.image_alt}."
            ),
        },
        {"type": "source", "items": [{"label": s.label, "url": s.url} for s in article.sources]},
    ]
    return blocks
