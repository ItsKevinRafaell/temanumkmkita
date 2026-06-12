"""Generated full-draft batches from the 2026-2027 content calendar."""

from __future__ import annotations

import re

from content_calendar_2026_2027 import MONTH_TOPICS, PILLARS, TOPICS

from .common import ArticleDraft, Source


GOOGLE_HELPFUL = Source(
    "Google Search Central - Creating helpful, reliable, people-first content",
    "https://developers.google.com/search/docs/fundamentals/creating-helpful-content",
)
GOOGLE_SEO = Source(
    "Google Search Central - SEO Starter Guide",
    "https://developers.google.com/search/docs/fundamentals/seo-starter-guide",
)
GOOGLE_MAPS = Source(
    "Google Business Profile Help - How Google determines local ranking",
    "https://support.google.com/business/answer/7091",
)
PAGESPEED = Source("Google PageSpeed Insights", "https://pagespeed.web.dev/")
META_BUSINESS = Source("Meta Business Help Center", "https://www.facebook.com/business/help")
INSTAGRAM_HELP = Source("Instagram Help Center", "https://help.instagram.com/")
WIPO_SME = Source("WIPO - Intellectual Property for Business", "https://www.wipo.int/sme/en/")


PILLAR_BY_KEY = {pillar.key: pillar for pillar in PILLARS}
TOPICS_BY_MONTH = {
    month: [topic for topic in TOPICS if topic.publish_date.startswith(f"{month}-")]
    for month in MONTH_TOPICS
}


def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s-]", "", text)
    text = re.sub(r"\s+", "-", text).strip("-")
    return text


def trim_meta(text: str, limit: int = 158) -> str:
    if len(text) <= limit:
        return text
    return text[: limit - 1].rsplit(" ", 1)[0] + "."


def source_set(category: str) -> list[Source]:
    if category == "SEO & Google Maps":
        return [GOOGLE_MAPS, GOOGLE_SEO, GOOGLE_HELPFUL]
    if category == "Sosial Media":
        return [INSTAGRAM_HELP, META_BUSINESS, GOOGLE_HELPFUL]
    if category == "Maintenance":
        return [PAGESPEED, GOOGLE_SEO, GOOGLE_HELPFUL]
    if category == "Branding":
        return [WIPO_SME, GOOGLE_HELPFUL]
    return [GOOGLE_SEO, GOOGLE_HELPFUL]


def category_context(category: str, focus_keyword: str) -> dict[str, list[str] | str]:
    common_action = [
        f"Catat pertanyaan pelanggan yang paling sering muncul tentang {focus_keyword}, lalu ubah menjadi poin audit.",
        "Pilih satu prioritas yang paling dekat dengan keputusan pelanggan bulan ini.",
        "Kumpulkan bukti pendukung seperti screenshot, foto asli, testimoni, data profil, atau catatan chat.",
        "Evaluasi ulang setelah 30 hari dari kualitas pertanyaan masuk, klik WhatsApp, dan bagian yang masih membuat pelanggan bingung.",
    ]
    if category == "Website":
        return {
            "audience_problem": "Banyak UMKM sudah merasa perlu website, tetapi belum tahu halaman, copy, fitur, dan bukti apa yang benar-benar membuat calon pelanggan yakin.",
            "practical_angle": "Website yang berguna tidak hanya terlihat rapi, tetapi membantu pelanggan memahami penawaran, membandingkan bukti, lalu mengambil langkah berikutnya dengan jelas.",
            "checklist": [
                "Pastikan tujuan halaman sudah jelas: edukasi, lead, katalog, booking, atau company profile.",
                "Tulis layanan utama dalam bahasa yang dipahami pelanggan, bukan hanya istilah internal bisnis.",
                "Pasang CTA yang spesifik seperti konsultasi, cek paket, minta katalog, atau hubungi WhatsApp.",
                "Tampilkan bukti nyata berupa portofolio, testimoni, foto asli, studi kasus, atau review.",
                "Cek pengalaman mobile karena sebagian besar calon pelanggan membuka website dari ponsel.",
                "Rapikan SEO dasar: title, meta description, heading, internal link, dan struktur URL.",
            ],
            "mistakes": [
                "Membuat website hanya sebagai brosur online tanpa alur menuju kontak.",
                "Menaruh terlalu banyak informasi penting di gambar sehingga sulit dibaca Google dan pengguna.",
                "Tidak menjelaskan area layanan, proses kerja, estimasi harga, atau langkah pemesanan.",
                "Membiarkan website selesai go-live tanpa update konten dan pengecekan berkala.",
            ],
            "scenario": "Sebuah bisnis jasa lokal bisa terlihat lebih dipercaya ketika website-nya menjelaskan layanan, proses kerja, contoh hasil, pertanyaan umum, dan tombol WhatsApp yang jelas. Pelanggan tidak perlu menebak-nebak apakah bisnis masih aktif atau cocok dengan kebutuhannya.",
            "faq": [
                ("Apakah UMKM harus punya website lengkap?", "Tidak selalu. Mulai dari struktur yang paling membantu calon pelanggan mengambil keputusan, lalu kembangkan bertahap."),
                ("Apa bagian website yang paling penting?", "Layanan utama, bukti kepercayaan, CTA, kontak, dan informasi bisnis yang konsisten."),
                ("Kapan website perlu dibantu vendor?", "Saat bisnis butuh struktur, desain, teknis, SEO dasar, dan maintenance yang tidak sempat dikerjakan sendiri."),
            ],
            "action_steps": common_action,
        }
    if category == "SEO & Google Maps":
        return {
            "audience_problem": "Banyak bisnis lokal ingin muncul di Google, tetapi profil, kata kunci, review, foto, dan halaman pendukungnya belum konsisten.",
            "practical_angle": "SEO lokal bekerja lebih sehat ketika Google dan pelanggan mendapat sinyal yang sama: bisnis relevan, lokasinya jelas, informasinya lengkap, dan aktivitasnya terawat.",
            "checklist": [
                "Pastikan nama, alamat, nomor telepon, jam buka, dan website konsisten di semua kanal.",
                "Pilih kategori Google Business Profile yang paling relevan dengan layanan utama.",
                "Tambahkan deskripsi, foto, produk atau layanan, area layanan, dan link yang benar.",
                "Minta review dari pelanggan yang puas dan balas review secara profesional.",
                "Buat konten atau halaman yang menjawab pencarian lokal dan pertanyaan pelanggan.",
                "Pantau insight seperti panggilan, klik arah, klik website, dan kualitas chat masuk.",
            ],
            "mistakes": [
                "Mengisi nama bisnis dengan keyword berlebihan yang bukan nama asli bisnis.",
                "Hanya mengejar ranking tanpa memperbaiki kepercayaan profil dan halaman tujuan.",
                "Tidak membalas review atau membiarkan informasi bisnis kadaluarsa.",
                "Menulis artikel lokal yang hanya mengulang kata kunci tanpa membantu pembaca.",
            ],
            "scenario": "Misalnya tempat kursus lokal ingin dicari orang tua di area sekitar. Profil Google yang lengkap, review aktif, foto kelas, halaman program, dan artikel lokal yang relevan akan lebih membantu daripada hanya menambah kata kunci di bio.",
            "faq": [
                ("Berapa lama SEO lokal terlihat hasilnya?", "Biasanya bertahap. Fondasi bisa diperbaiki cepat, tetapi hasil stabil butuh konsistensi beberapa bulan."),
                ("Apakah review Google penting?", "Ya. Review membantu calon pelanggan menilai pengalaman orang lain dan memperkuat sinyal kepercayaan."),
                ("Perlu website untuk SEO lokal?", "Tidak wajib untuk mulai, tetapi website membantu menjelaskan layanan lebih lengkap dan menjadi tujuan klik yang lebih meyakinkan."),
            ],
            "action_steps": common_action,
        }
    if category == "Sosial Media":
        return {
            "audience_problem": "Banyak akun UMKM terlihat aktif sebentar lalu kosong lagi karena ide, format, dan jadwal produksi kontennya belum realistis.",
            "practical_angle": "Sosial media yang baik tidak hanya ramai, tetapi membantu calon pelanggan mengenal produk, melihat bukti, memahami proses, dan tahu cara menghubungi.",
            "checklist": [
                "Tentukan content pillar seperti edukasi, produk, testimoni, proses, promo, dan interaksi.",
                "Ubah pertanyaan pelanggan menjadi ide konten yang mudah dipahami.",
                "Pilih format yang sesuai: story untuk aktivitas harian, feed untuk informasi, reels untuk jangkauan, carousel untuk panduan.",
                "Siapkan CTA ringan seperti tanya stok, minta katalog, cek jadwal, atau konsultasi.",
                "Batch produksi konten agar akun tidak bergantung pada mood harian.",
                "Ukur respons dari chat, simpan, share, klik profil, dan pertanyaan yang masuk.",
            ],
            "mistakes": [
                "Semua postingan berisi jualan tanpa edukasi, cerita, atau bukti.",
                "Mengejar desain rumit sampai konten sulit diproduksi konsisten.",
                "Tidak punya arsip foto dan testimoni sehingga bahan konten selalu habis.",
                "Menilai performa hanya dari like, bukan kualitas calon pelanggan.",
            ],
            "scenario": "Sebuah toko produk lokal bisa membuat konten edukasi, testimoni, proses packing, FAQ, promo ringan, dan cerita pelanggan. Dengan pola itu, akun tidak terasa seperti katalog yang terus memaksa orang membeli.",
            "faq": [
                ("Haruskah posting setiap hari?", "Tidak harus. Lebih baik konsisten dengan ritme realistis daripada memaksa posting harian tetapi kualitas turun."),
                ("Konten apa yang paling aman untuk mulai?", "Edukasi pelanggan, bukti kerja, proses, testimoni, dan penjelasan produk."),
                ("Apakah perlu desain profesional?", "Desain membantu, tetapi pesan yang jelas dan foto asli sering lebih penting untuk UMKM."),
            ],
            "action_steps": common_action,
        }
    if category == "Branding":
        return {
            "audience_problem": "Banyak UMKM sudah punya logo atau visual, tetapi pemakaiannya tidak konsisten di kemasan, sosial media, proposal, dan website.",
            "practical_angle": "Branding yang baik membuat bisnis lebih mudah dikenali, terlihat rapi, dan punya standar visual yang bisa dipakai berulang oleh tim.",
            "checklist": [
                "Cek apakah logo tetap terbaca di ukuran kecil, latar gelap, latar terang, dan profil sosial media.",
                "Pastikan warna, font, ikon, foto, dan gaya desain punya aturan sederhana.",
                "Siapkan file logo utama, versi horizontal, versi ikon, PNG transparan, dan file vektor jika ada.",
                "Rapikan template untuk feed, story, proposal, invoice, katalog, dan kemasan jika relevan.",
                "Pastikan visual mendukung positioning bisnis, bukan hanya mengikuti tren desain.",
                "Dokumentasikan aturan pemakaian agar output tetap konsisten meski dibuat orang berbeda.",
            ],
            "mistakes": [
                "Mengganti gaya visual terlalu sering sehingga brand sulit dikenali.",
                "Memilih logo rumit yang sulit dibaca di foto profil atau kemasan kecil.",
                "Tidak menyimpan file asli sehingga setiap kebutuhan desain harus dibuat ulang.",
                "Mengejar tampilan bagus tetapi tidak cocok dengan pelanggan dan harga produk.",
            ],
            "scenario": "Bisnis makanan lokal bisa terlihat lebih siap jual ketika logo, warna kemasan, feed Instagram, label produk, dan katalog memakai arah visual yang sama. Konsistensi ini membantu pelanggan mengingat brand tanpa harus melihat nama berulang-ulang.",
            "faq": [
                ("Apakah branding harus mahal?", "Tidak selalu. Yang penting adalah arah yang jelas, file yang lengkap, dan konsistensi pemakaian."),
                ("Kapan UMKM perlu rebranding?", "Saat visual lama tidak lagi sesuai penawaran, target pasar, kualitas produk, atau rencana bisnis."),
                ("Apa dokumen branding paling sederhana?", "Logo, warna, font, contoh pemakaian, larangan pemakaian, dan template dasar."),
            ],
            "action_steps": common_action,
        }
    if category == "Maintenance":
        return {
            "audience_problem": "Banyak website UMKM hanya dicek saat bermasalah, padahal performa, backup, keamanan, dan form kontak perlu dirawat sebelum mengganggu penjualan.",
            "practical_angle": "Maintenance membuat website tetap cepat, aman, bisa diakses, dan siap menerima calon pelanggan ketika bisnis sedang ramai.",
            "checklist": [
                "Cek apakah website bisa dibuka cepat dari ponsel dan koneksi biasa.",
                "Pastikan form kontak, tombol WhatsApp, link sosial media, dan tracking masih berfungsi.",
                "Jadwalkan backup, update sistem, update plugin, dan pengecekan keamanan.",
                "Pantau domain, hosting, SSL, uptime, dan kapasitas penyimpanan.",
                "Kompres gambar besar dan hapus script atau plugin yang tidak dipakai.",
                "Catat perubahan setelah update agar masalah mudah dilacak jika muncul error.",
            ],
            "mistakes": [
                "Tidak punya backup sebelum update besar.",
                "Mengabaikan website lemot karena merasa desainnya masih bagus.",
                "Baru mengecek form kontak setelah menyadari lead menurun.",
                "Memakai hosting atau plugin tanpa memahami dampaknya ke keamanan dan performa.",
            ],
            "scenario": "Sebuah website katalog bisa kehilangan banyak peluang jika tombol WhatsApp rusak saat campaign berjalan. Dengan pengecekan bulanan, masalah seperti link mati, gambar berat, form error, dan SSL kadaluarsa bisa ditemukan sebelum pelanggan pergi.",
            "faq": [
                ("Seberapa sering maintenance dilakukan?", "Untuk UMKM, cek ringan bisa bulanan. Website aktif atau ramai campaign sebaiknya dicek lebih sering."),
                ("Apa prioritas pertama maintenance?", "Backup, keamanan, uptime, kecepatan, dan fungsi kontak."),
                ("Apakah maintenance perlu vendor?", "Jika tidak ada tim teknis internal, vendor membantu menjaga website tetap stabil dan mengurangi risiko downtime."),
            ],
            "action_steps": common_action,
        }
    return {
        "audience_problem": "Banyak pemilik bisnis tahu harus digital, tetapi bingung menentukan prioritas karena semua kanal terlihat penting.",
        "practical_angle": "Keputusan digital yang baik dimulai dari masalah pelanggan: apakah mereka sulit menemukan bisnis, sulit percaya, atau sulit menghubungi.",
        "checklist": [
            "Petakan kanal yang paling sering dilihat pelanggan sebelum membeli.",
            "Cek konsistensi informasi bisnis di website, Google Maps, sosial media, dan WhatsApp.",
            "Tentukan bukti kepercayaan yang perlu ditampilkan: review, portofolio, testimoni, foto asli, atau legalitas.",
            "Prioritaskan perbaikan yang paling dekat dengan keputusan pelanggan.",
            "Catat metrik sederhana seperti chat masuk, klik WhatsApp, kunjungan profil, dan pertanyaan berulang.",
            "Review hasil setiap bulan sebelum menambah pekerjaan baru.",
        ],
        "mistakes": [
            "Mengerjakan semua kanal sekaligus sampai tidak ada yang selesai.",
            "Membeli tools atau jasa tanpa tahu masalah utama yang ingin diselesaikan.",
            "Tidak mencatat hasil sehingga keputusan bulan berikutnya tetap berdasarkan feeling.",
            "Terlalu fokus pada tampilan dan lupa memperjelas CTA serta bukti kepercayaan.",
        ],
        "scenario": "Sebuah UMKM jasa bisa mulai dari merapikan Google Maps, menambahkan portofolio, memperjelas CTA WhatsApp, dan membuat artikel yang menjawab pertanyaan calon pelanggan. Urutan ini lebih masuk akal daripada langsung mengejar semua tren digital.",
        "faq": [
            ("Channel digital mana yang harus diprioritaskan?", "Mulai dari channel yang paling dekat dengan keputusan pelanggan saat ini."),
            ("Apakah semua UMKM perlu strategi digital lengkap?", "Tidak langsung. Strategi bisa dimulai dari prioritas sederhana dan diperluas bertahap."),
            ("Apa metrik paling sederhana?", "Jumlah chat berkualitas, klik kontak, pertanyaan berulang yang berkurang, dan pelanggan yang lebih cepat paham penawaran."),
        ],
        "action_steps": common_action,
    }


def build_article(topic) -> ArticleDraft:
    pillar = PILLAR_BY_KEY[topic.pillar_key]
    context = category_context(topic.category, topic.focus_keyword)
    meta_description = trim_meta(
        f"Panduan {topic.focus_keyword} untuk UMKM: langkah praktis, checklist, kesalahan umum, contoh penerapan, dan kapan perlu bantuan."
    )
    return ArticleDraft(
        title=topic.title,
        slug=slugify(topic.title),
        excerpt=trim_meta(f"Panduan praktis tentang {topic.focus_keyword} untuk UMKM agar keputusan digital lebih rapi, jelas, dan mudah dieksekusi.", 150),
        category=topic.category,
        pillar_name=pillar.name,
        tags=[topic.category, topic.focus_keyword, "UMKM", topic.intent],
        read_time=6,
        seo_title=trim_meta(topic.title, 58),
        meta_description=meta_description,
        focus_keyword=topic.focus_keyword,
        target_cta=topic.cta,
        image_prompt=f"Pemilik UMKM sedang mengevaluasi {topic.focus_keyword} di laptop dan ponsel dengan catatan kerja digital yang rapi.",
        image_alt=f"ilustrasi {topic.focus_keyword} untuk UMKM",
        key_takeaways=[
            f"{topic.focus_keyword} perlu dilihat dari kebutuhan pelanggan, bukan sekadar tren digital",
            "UMKM sebaiknya mulai dari langkah yang bisa dicek, diukur, dan diperbaiki setiap bulan",
            "Hasil terbaik biasanya datang dari fondasi yang konsisten: informasi jelas, bukti kuat, dan CTA mudah ditemukan",
        ],
        audience_problem=str(context["audience_problem"]),
        practical_angle=str(context["practical_angle"]),
        checklist=list(context["checklist"]),
        action_steps=list(context["action_steps"]),
        mistakes=list(context["mistakes"]),
        scenario=str(context["scenario"]),
        faq=list(context["faq"]),
        sources=source_set(topic.category),
    )


def build_generated_month(month: str) -> list[ArticleDraft]:
    topics = TOPICS_BY_MONTH.get(month)
    if topics is None:
        known = ", ".join(sorted(TOPICS_BY_MONTH))
        raise SystemExit(f"Unknown month '{month}'. Available: {known}")
    return [build_article(topic) for topic in topics]
