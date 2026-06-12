"""Full draft batch for July 2026."""

from __future__ import annotations

from .common import ArticleDraft, Source


GOOGLE_HELPFUL = Source(
    "Google Search Central - Creating helpful, reliable, people-first content",
    "https://developers.google.com/search/docs/fundamentals/creating-helpful-content",
)
GOOGLE_SEO_STARTER = Source(
    "Google Search Central - SEO Starter Guide",
    "https://developers.google.com/search/docs/fundamentals/seo-starter-guide",
)
GOOGLE_LOCAL_RANKING = Source(
    "Google Business Profile Help - How Google determines local ranking",
    "https://support.google.com/business/answer/7091",
)
GOOGLE_BUSINESS_PROFILE = Source(
    "Google Business Profile Help",
    "https://support.google.com/business/",
)
WEB_DEV_PERFORMANCE = Source(
    "web.dev - Learn performance",
    "https://web.dev/learn/performance",
)
PAGESPEED = Source(
    "Google PageSpeed Insights",
    "https://pagespeed.web.dev/",
)
INSTAGRAM_HELP = Source(
    "Instagram Help Center",
    "https://help.instagram.com/",
)
META_BUSINESS = Source(
    "Meta Business Help Center",
    "https://www.facebook.com/business/help",
)
WIPO_SME = Source(
    "WIPO - Intellectual Property for Business",
    "https://www.wipo.int/sme/en/",
)


ARTICLES = [
    ArticleDraft(
        title="Checklist Website UMKM Sebelum Pilih Vendor",
        slug="checklist-website-umkm-sebelum-pilih-vendor",
        excerpt="Checklist praktis untuk pemilik UMKM sebelum memilih vendor website, dari tujuan bisnis sampai garansi setelah go-live.",
        category="Website",
        pillar_name="Website UMKM",
        tags=["website", "vendor website", "UMKM", "company profile"],
        read_time=6,
        seo_title="Checklist Website UMKM Sebelum Pilih Vendor",
        meta_description="Checklist website UMKM sebelum pilih vendor: tujuan, fitur, biaya, SEO, garansi, dan hal yang wajib dicek agar tidak salah investasi.",
        focus_keyword="website UMKM",
        target_cta="/layanan/web-development",
        image_prompt="Foto realistis pemilik UMKM sedang membandingkan proposal website di laptop dengan catatan checklist di meja kerja.",
        image_alt="pemilik bisnis mengecek checklist website UMKM sebelum memilih vendor",
        key_takeaways=[
            "Vendor yang bagus harus bisa menjelaskan tujuan bisnis website, bukan hanya desain",
            "Brief, scope fitur, timeline, revisi, dan biaya tahunan harus tertulis sejak awal",
            "Website UMKM perlu siap mobile, cepat, punya CTA jelas, dan mudah dirawat setelah go-live",
        ],
        audience_problem=(
            "Banyak pemilik bisnis hanya bertanya harga, lalu baru sadar setelah proyek berjalan bahwa konten, domain, hosting, "
            "revisi, dan maintenance ternyata belum jelas."
        ),
        practical_angle=(
            "Website yang baik seharusnya menjadi pusat informasi bisnis: menjelaskan layanan, menunjukkan bukti kerja, "
            "mengarahkan pengunjung ke WhatsApp, dan membantu bisnis ditemukan lewat pencarian."
        ),
        checklist=[
            "Tulis tujuan website: company profile, landing page promosi, katalog, booking, atau pusat informasi bisnis.",
            "Minta vendor menjelaskan struktur halaman, bukan hanya contoh desain.",
            "Pastikan scope sudah mencakup domain, hosting, SSL, form kontak, WhatsApp CTA, dan halaman legal dasar jika dibutuhkan.",
            "Cek apakah paket menyertakan SEO dasar seperti title, meta description, heading, sitemap, dan struktur URL.",
            "Tanyakan siapa yang mengisi konten awal: pemilik bisnis, vendor, atau gabungan keduanya.",
            "Pastikan ada aturan revisi, timeline, garansi bug, dan biaya maintenance setelah website tayang.",
        ],
        action_steps=[
            "Kumpulkan 3 contoh website yang kamu suka, lalu tulis bagian mana yang relevan untuk bisnismu.",
            "Pilih satu tujuan utama untuk bulan pertama setelah website tayang, misalnya menaikkan chat WhatsApp atau membuat bisnis terlihat lebih kredibel.",
            "Siapkan bukti bisnis seperti foto tempat, foto produk, testimoni, legalitas, portofolio, dan daftar layanan.",
            "Setelah proposal masuk, bandingkan berdasarkan scope dan dampak bisnis, bukan hanya harga paling murah.",
        ],
        mistakes=[
            "Memilih vendor hanya karena harga paling rendah tanpa melihat scope pekerjaan.",
            "Tidak menanyakan akses admin, hosting, domain, dan file penting setelah proyek selesai.",
            "Membiarkan website tanpa CTA sehingga pengunjung tidak tahu harus menghubungi ke mana.",
            "Menganggap SEO bisa ditambahkan belakangan padahal struktur awal website sangat memengaruhi kualitas SEO.",
        ],
        scenario=(
            "Misalnya sebuah bisnis katering lokal ingin terlihat lebih profesional. Kalau langsung membuat website tanpa brief, "
            "hasilnya bisa hanya berisi foto makanan dan nomor WhatsApp. Tetapi kalau brief dibuat benar, website bisa memuat paket katering, "
            "area layanan, testimoni pelanggan, FAQ pemesanan, galeri acara, dan tombol konsultasi. Perbedaannya bukan sekadar tampilan, "
            "melainkan kejelasan informasi saat calon pelanggan membandingkan beberapa vendor."
        ),
        faq=[
            ("Apakah UMKM harus punya website?", "Tidak semua harus langsung punya website lengkap, tetapi bisnis yang sering dibandingkan pelanggan akan lebih diuntungkan jika punya halaman resmi yang rapi dan mudah dicek."),
            ("Berapa halaman minimal untuk website UMKM?", "Umumnya 4-6 halaman sudah cukup: beranda, layanan atau produk, tentang, portofolio atau testimoni, artikel, dan kontak."),
            ("Apa tanda vendor website cukup serius?", "Vendor yang serius bertanya tujuan bisnis, target pelanggan, proses operasional, konten yang tersedia, dan rencana setelah website tayang."),
        ],
        sources=[GOOGLE_SEO_STARTER, GOOGLE_HELPFUL, WEB_DEV_PERFORMANCE],
    ),
    ArticleDraft(
        title="Cara Agar Bisnis UMKM Muncul di Google Maps",
        slug="cara-agar-bisnis-umkm-muncul-di-google-maps",
        excerpt="Panduan praktis agar bisnis UMKM lebih mudah muncul di Google Maps lewat profil yang lengkap, relevan, dan aktif.",
        category="SEO & Google Maps",
        pillar_name="SEO Lokal & Google Maps",
        tags=["SEO lokal", "Google Maps", "Google Business Profile", "UMKM"],
        read_time=6,
        seo_title="Cara Agar Bisnis UMKM Muncul di Google Maps",
        meta_description="Cara agar bisnis UMKM muncul di Google Maps: lengkapi profil, kategori, foto, review, area layanan, dan sinyal lokal yang penting.",
        focus_keyword="cara bisnis muncul di Google Maps",
        target_cta="/layanan/seo-google-maps",
        image_prompt="Tampilan peta digital di layar laptop dengan pin lokasi bisnis lokal dan pemilik UMKM memegang ponsel.",
        image_alt="bisnis UMKM muncul di Google Maps dengan profil bisnis yang lengkap",
        key_takeaways=[
            "Google Maps membutuhkan profil bisnis yang lengkap, akurat, dan relevan dengan pencarian pelanggan",
            "Kategori bisnis, alamat atau area layanan, jam buka, foto, dan review harus dijaga konsisten",
            "Hasil SEO lokal biasanya membaik lewat proses bertahap, bukan trik instan",
        ],
        audience_problem=(
            "Banyak UMKM sudah punya lokasi dan pelanggan tetap, tetapi profil Google-nya kosong, salah kategori, jarang ada foto, "
            "atau tidak pernah meminta review dari pelanggan yang puas."
        ),
        practical_angle=(
            "Agar mudah muncul di Google Maps, bisnis perlu membantu Google dan calon pelanggan memahami tiga hal: bisnis ini relevan, "
            "berada di area yang tepat, dan cukup dipercaya untuk dihubungi."
        ),
        checklist=[
            "Klaim atau buat Google Business Profile dengan nama bisnis yang konsisten.",
            "Pilih kategori utama yang paling menggambarkan jasa atau produk utama, bukan kategori yang terlalu luas.",
            "Lengkapi alamat, area layanan, jam buka, nomor telepon, website, dan deskripsi bisnis.",
            "Upload foto tempat, produk, tim, menu, proses kerja, atau hasil pekerjaan secara berkala.",
            "Minta review pelanggan dengan cara sopan dan balas review yang masuk.",
            "Pastikan informasi bisnis sama di website, sosial media, direktori, dan kartu nama digital.",
        ],
        action_steps=[
            "Buka profil Google Business dan catat bagian yang masih kosong atau tidak akurat.",
            "Prioritaskan kategori, jam buka, nomor WhatsApp, dan foto sebelum mengejar hal teknis lain.",
            "Kumpulkan daftar pelanggan yang puas dan minta review dengan pesan pendek yang sopan.",
            "Pantau perubahan dari jumlah telepon, klik arah, kunjungan profil, dan pesan masuk.",
        ],
        mistakes=[
            "Mengisi nama bisnis dengan kata kunci berlebihan yang bukan nama resmi bisnis.",
            "Memilih terlalu banyak kategori tanpa memahami kategori utama.",
            "Tidak membalas review sehingga profil terlihat tidak aktif.",
            "Mengubah informasi berkali-kali tanpa alasan sehingga pelanggan bisa bingung.",
        ],
        scenario=(
            "Bayangkan bengkel motor lokal yang punya pelanggan setia, tetapi di Google Maps hanya berisi nama dan alamat. "
            "Calon pelanggan baru tidak melihat jam buka, foto tempat, jenis layanan, atau review terbaru. Setelah profil dilengkapi, "
            "ditambah foto servis, daftar layanan, dan review pelanggan, bisnis tersebut punya alasan lebih kuat untuk dipilih saat orang mencari bengkel terdekat."
        ),
        faq=[
            ("Apakah harus punya website agar muncul di Google Maps?", "Tidak wajib, tetapi website membantu memperkuat informasi bisnis, memberi halaman layanan yang lebih lengkap, dan menambah kepercayaan."),
            ("Berapa lama optimasi Google Maps terlihat hasilnya?", "Biasanya bertahap. Perubahan dasar bisa terasa dalam beberapa minggu, sedangkan peningkatan stabil membutuhkan konsistensi beberapa bulan."),
            ("Apakah review pelanggan penting?", "Ya. Review membantu calon pelanggan menilai pengalaman orang lain dan menjadi salah satu sinyal kepercayaan lokal."),
        ],
        sources=[GOOGLE_LOCAL_RANKING, GOOGLE_BUSINESS_PROFILE, GOOGLE_HELPFUL],
    ),
    ArticleDraft(
        title="Kalender Konten Instagram UMKM untuk 30 Hari",
        slug="kalender-konten-instagram-umkm-untuk-30-hari",
        excerpt="Contoh struktur kalender konten Instagram 30 hari untuk UMKM agar posting lebih konsisten dan tidak selalu jualan.",
        category="Sosial Media",
        pillar_name="Sosial Media UMKM",
        tags=["Instagram", "kalender konten", "sosial media", "UMKM"],
        read_time=6,
        seo_title="Kalender Konten Instagram UMKM 30 Hari",
        meta_description="Kalender konten Instagram UMKM 30 hari: ide edukasi, promosi, testimoni, behind the scenes, dan cara menjaga konsistensi posting.",
        focus_keyword="kalender konten Instagram UMKM",
        target_cta="/layanan/kelola-sosial-media",
        image_prompt="Meja kerja kreatif dengan kalender bulanan, ponsel menampilkan grid Instagram bisnis, dan sticky notes ide konten.",
        image_alt="kalender konten Instagram UMKM untuk 30 hari",
        key_takeaways=[
            "Kalender konten membuat sosial media lebih konsisten tanpa harus mencari ide setiap hari",
            "Konten UMKM sebaiknya mencampur edukasi, bukti kerja, cerita bisnis, promosi, dan interaksi",
            "Satu ide besar bisa dipecah menjadi beberapa format seperti feed, story, reels, dan carousel",
        ],
        audience_problem=(
            "Banyak UMKM ingin aktif di Instagram, tetapi setiap mau posting harus berpikir dari nol. Akhirnya konten berhenti, "
            "feed terlihat tidak dirawat, dan calon pelanggan ragu apakah bisnis masih aktif."
        ),
        practical_angle=(
            "Kalender 30 hari bukan berarti harus posting besar setiap hari. Tujuannya adalah memberi pola, sehingga pemilik bisnis tahu "
            "hari apa harus edukasi, kapan promosi, kapan menunjukkan testimoni, dan kapan mengajak audiens berinteraksi."
        ),
        checklist=[
            "Tentukan 4-5 content pillar, misalnya edukasi, produk, testimoni, proses, promo, dan cerita bisnis.",
            "Siapkan daftar pertanyaan pelanggan yang sering muncul sebagai bahan konten edukasi.",
            "Pilih format konten: feed untuk informasi tahan lama, story untuk aktivitas harian, reels untuk jangkauan, carousel untuk panduan.",
            "Buat 10 ide konten edukasi, 6 ide bukti kerja, 6 ide promosi ringan, 4 ide behind the scenes, dan 4 ide interaksi.",
            "Batch produksi caption dan desain minimal seminggu sekali.",
            "Cek performa sederhana: simpan, balasan, klik profil, klik link, dan chat masuk.",
        ],
        action_steps=[
            "Audit 30 posting terakhir dan tandai jenis konten yang paling sering dibuat.",
            "Isi kalender dengan pola mingguan yang mudah dijaga, bukan pola ideal yang sulit dieksekusi.",
            "Kumpulkan foto produk, proses kerja, testimoni, dan pertanyaan pelanggan sebagai bahan mentah.",
            "Setelah 30 hari, pertahankan format yang menghasilkan interaksi atau pertanyaan paling relevan.",
        ],
        mistakes=[
            "Mengisi semua konten dengan promosi sehingga audiens cepat bosan.",
            "Membuat desain terlalu rumit sampai produksi konten tersendat.",
            "Tidak menyimpan ide dari pertanyaan pelanggan padahal itu bahan konten terbaik.",
            "Mengukur sukses hanya dari like, bukan dari chat, simpan, dan kualitas pertanyaan masuk.",
        ],
        scenario=(
            "Sebuah toko skincare lokal bisa membagi konten menjadi edukasi bahan aktif, testimoni pelanggan, cara pakai produk, "
            "behind the scenes packing, promo bundling, dan FAQ kulit. Dalam 30 hari, akun tidak perlu terlihat seperti katalog jualan terus. "
            "Ia terlihat aktif, membantu, dan cukup meyakinkan untuk membuat calon pelanggan bertanya."
        ),
        faq=[
            ("Apakah UMKM harus posting setiap hari?", "Tidak selalu. Lebih baik konsisten 3-5 kali seminggu dengan konten jelas daripada memaksa posting setiap hari tapi kualitas turun."),
            ("Konten apa yang paling penting untuk awal?", "Mulai dari edukasi, bukti kerja atau testimoni, penjelasan produk, dan CTA yang jelas."),
            ("Apakah semua konten harus desain profesional?", "Tidak. Foto asli yang jelas dan caption yang membantu sering lebih berguna daripada desain rumit yang tidak konsisten."),
        ],
        sources=[INSTAGRAM_HELP, META_BUSINESS, GOOGLE_HELPFUL],
    ),
    ArticleDraft(
        title="Ciri Logo UMKM yang Terlihat Profesional",
        slug="ciri-logo-umkm-yang-terlihat-profesional",
        excerpt="Ciri logo UMKM yang profesional: jelas, mudah dipakai, konsisten, punya versi file lengkap, dan sesuai karakter bisnis.",
        category="Branding",
        pillar_name="Branding UMKM",
        tags=["logo", "branding", "desain logo", "UMKM"],
        read_time=6,
        seo_title="Ciri Logo UMKM yang Terlihat Profesional",
        meta_description="Ciri logo UMKM profesional: mudah dibaca, fleksibel, konsisten, punya file lengkap, dan cocok untuk website, kemasan, serta sosial media.",
        focus_keyword="desain logo UMKM",
        target_cta="/layanan/desain-logo",
        image_prompt="Meja desainer dengan beberapa alternatif logo UMKM di kertas, laptop, kemasan produk, dan layar ponsel.",
        image_alt="contoh desain logo UMKM profesional untuk berbagai media",
        key_takeaways=[
            "Logo profesional bukan harus rumit, tetapi harus mudah dikenali dan mudah dipakai",
            "Logo perlu punya versi horizontal, vertikal, satu warna, dan file master",
            "Logo yang baik membantu bisnis terlihat konsisten di website, kemasan, sosial media, dan materi promosi",
        ],
        audience_problem=(
            "Banyak UMKM memakai logo yang dibuat seadanya dari aplikasi cepat. Awalnya terlihat cukup, tetapi bermasalah saat dicetak, "
            "dipakai di kemasan, dipasang di website, atau diubah ukurannya."
        ),
        practical_angle=(
            "Desain logo UMKM harus dinilai dari fungsi, bukan sekadar selera. Logo yang bagus tetap terbaca kecil, cocok di berbagai latar, "
            "dan tidak membuat brand terlihat berubah-ubah setiap kali pindah media."
        ),
        checklist=[
            "Cek apakah logo masih terbaca saat ukuran kecil, misalnya foto profil Instagram atau favicon website.",
            "Pastikan logo punya kontras yang cukup di latar terang dan gelap.",
            "Siapkan versi utama, versi sederhana, versi satu warna, dan versi tanpa tagline.",
            "Pastikan file tersedia dalam format PNG transparan, JPG, SVG atau PDF, dan file master jika memungkinkan.",
            "Gunakan warna dan font yang konsisten di semua media bisnis.",
            "Pastikan logo tidak terlalu mirip dengan kompetitor atau brand lain.",
        ],
        action_steps=[
            "Kumpulkan semua tempat logo dipakai: kemasan, banner, nota, website, marketplace, sosial media, dan seragam.",
            "Pilih kebutuhan paling mendesak, misalnya logo sulit terbaca atau file tidak bisa dicetak tajam.",
            "Siapkan referensi visual dan karakter brand sebelum meminta desain ulang.",
            "Uji logo baru di ukuran kecil, latar gelap, latar terang, dan media cetak sederhana.",
        ],
        mistakes=[
            "Membuat logo terlalu ramai dengan banyak warna, efek, ikon, dan tagline panjang.",
            "Hanya menyimpan file JPG kecil sehingga logo pecah saat dicetak.",
            "Mengubah warna dan font sesuka hati di setiap materi promosi.",
            "Memilih logo karena tren, bukan karena cocok dengan karakter bisnis dan target pelanggan.",
        ],
        scenario=(
            "Sebuah usaha kopi rumahan memakai logo detail bergambar biji kopi, daun, cangkir, dan tulisan kecil. Di banner terlihat ramai, "
            "di stiker kemasan tidak terbaca, dan di Instagram hanya tampak seperti lingkaran gelap. Setelah disederhanakan, logo punya bentuk utama, "
            "warna konsisten, dan versi satu warna. Hasilnya brand terlihat lebih rapi tanpa harus mengubah seluruh bisnis."
        ),
        faq=[
            ("Apakah logo UMKM harus mahal?", "Tidak harus mahal, tetapi harus dibuat dengan brief dan file yang benar agar bisa dipakai jangka panjang."),
            ("Kapan logo perlu diganti?", "Saat logo sulit terbaca, tidak punya file layak, tidak cocok dengan posisi bisnis saat ini, atau membuat brand terlihat kurang dipercaya."),
            ("Apa file logo yang wajib dimiliki?", "Minimal PNG transparan, JPG, versi warna, versi satu warna, dan file vector seperti SVG atau PDF jika tersedia."),
        ],
        sources=[WIPO_SME, GOOGLE_HELPFUL],
    ),
    ArticleDraft(
        title="Harga Website UMKM: Apa Saja yang Membuat Biaya Berbeda?",
        slug="harga-website-umkm-apa-saja-yang-membuat-biaya-berbeda",
        excerpt="Penjelasan komponen harga website UMKM agar pemilik bisnis bisa membandingkan paket dengan lebih adil.",
        category="Website",
        pillar_name="Website UMKM",
        tags=["harga website", "website UMKM", "web development"],
        read_time=7,
        seo_title="Harga Website UMKM: Faktor Biaya yang Perlu Dicek",
        meta_description="Harga website UMKM berbeda karena scope halaman, fitur, desain, konten, SEO, hosting, maintenance, dan dukungan setelah go-live.",
        focus_keyword="harga website UMKM",
        target_cta="/layanan/web-development",
        image_prompt="Pemilik UMKM melihat rincian biaya website di spreadsheet dengan laptop menampilkan mockup halaman bisnis.",
        image_alt="rincian harga website UMKM berdasarkan fitur dan scope pekerjaan",
        key_takeaways=[
            "Harga website berbeda karena scope pekerjaan, bukan hanya jumlah halaman",
            "Biaya domain, hosting, SSL, konten, maintenance, dan revisi perlu dihitung sejak awal",
            "Paket murah bisa tetap cocok jika kebutuhan sederhana, tetapi harus jelas batasannya",
        ],
        audience_problem=(
            "Pemilik bisnis sering menerima penawaran website dengan selisih harga besar, tetapi sulit membandingkan karena istilah teknis dan scope tidak sama."
        ),
        practical_angle=(
            "Cara paling fair membandingkan harga website UMKM adalah melihat apa yang benar-benar dikerjakan: strategi halaman, desain, development, konten, SEO dasar, integrasi, testing, dan dukungan setelah tayang."
        ),
        checklist=[
            "Catat jumlah halaman dan jenis halaman yang dibuat, bukan hanya total halaman.",
            "Cek apakah desain custom, template, atau kombinasi keduanya.",
            "Pastikan biaya domain, hosting, SSL, email, dan renewal tahunan tertulis jelas.",
            "Tanyakan apakah konten, copywriting, foto, dan input produk termasuk dalam paket.",
            "Cek fitur tambahan seperti form kontak, WhatsApp CTA, katalog, booking, dashboard admin, atau blog.",
            "Hitung biaya maintenance setelah website tayang agar tidak kaget di tahun berikutnya.",
        ],
        action_steps=[
            "Tulis kebutuhan wajib dan kebutuhan nice-to-have sebelum meminta penawaran.",
            "Minta proposal dibuat dalam item scope agar mudah dibandingkan antar vendor.",
            "Pisahkan biaya sekali bayar dan biaya berulang tahunan atau bulanan.",
            "Pilih paket yang paling cocok dengan tahap bisnis, bukan yang paling ramai fiturnya.",
        ],
        mistakes=[
            "Membandingkan harga tanpa membandingkan scope pekerjaan.",
            "Mengabaikan biaya tahunan seperti domain, hosting, SSL, dan maintenance.",
            "Membayar fitur kompleks yang belum dibutuhkan bisnis.",
            "Tidak meminta akses admin atau dokumentasi setelah proyek selesai.",
        ],
        scenario=(
            "Dua vendor menawarkan harga berbeda untuk website klinik kecil. Vendor pertama lebih murah tetapi hanya membuat satu halaman statis tanpa CMS dan tanpa SEO dasar. "
            "Vendor kedua lebih mahal tetapi mencakup halaman layanan, profil dokter, FAQ, CTA WhatsApp, blog, sitemap, dan maintenance awal. Yang lebih murah belum tentu salah, "
            "tetapi pemilik klinik perlu tahu konsekuensi dari tiap pilihan."
        ),
        faq=[
            ("Kenapa harga website bisa berbeda jauh?", "Karena scope, fitur, kualitas desain, kebutuhan konten, teknologi, dan dukungan setelah go-live bisa sangat berbeda."),
            ("Apakah website murah selalu buruk?", "Tidak. Website murah bisa cocok untuk kebutuhan sederhana, asalkan batasannya jelas dan tidak menjanjikan hal yang tidak dikerjakan."),
            ("Apa biaya yang sering terlupakan?", "Renewal domain, hosting, maintenance, update konten, backup, dan perbaikan setelah website berjalan."),
        ],
        sources=[GOOGLE_SEO_STARTER, WEB_DEV_PERFORMANCE, PAGESPEED],
    ),
    ArticleDraft(
        title="Optimasi Google Business Profile untuk Pemula",
        slug="optimasi-google-business-profile-untuk-pemula",
        excerpt="Langkah awal optimasi Google Business Profile untuk UMKM agar profil lebih lengkap, dipercaya, dan relevan di pencarian lokal.",
        category="SEO & Google Maps",
        pillar_name="SEO Lokal & Google Maps",
        tags=["Google Business Profile", "SEO lokal", "Google Maps", "UMKM"],
        read_time=6,
        seo_title="Optimasi Google Business Profile untuk Pemula",
        meta_description="Optimasi Google Business Profile untuk pemula: kategori, deskripsi, foto, review, jam buka, area layanan, dan update profil bisnis.",
        focus_keyword="optimasi Google Business Profile",
        target_cta="/layanan/seo-google-maps",
        image_prompt="Pemilik bisnis lokal memperbarui Google Business Profile di laptop dengan foto toko dan data jam buka.",
        image_alt="optimasi Google Business Profile untuk bisnis UMKM",
        key_takeaways=[
            "Profil bisnis yang lengkap membantu Google dan pelanggan memahami bisnismu",
            "Optimasi dasar dimulai dari kategori, deskripsi, kontak, jam buka, foto, dan review",
            "Profil perlu dirawat berkala, bukan hanya dibuat sekali lalu ditinggal",
        ],
        audience_problem=(
            "Banyak bisnis sudah muncul di Google, tetapi profilnya tidak meyakinkan. Foto lama, jam buka tidak jelas, deskripsi kosong, dan review tidak dibalas."
        ),
        practical_angle=(
            "Optimasi Google Business Profile adalah pekerjaan kecil yang dilakukan rutin. Hasilnya bukan hanya ranking, tetapi juga rasa yakin saat calon pelanggan melihat profilmu."
        ),
        checklist=[
            "Pastikan nama bisnis, alamat, nomor telepon, dan website konsisten.",
            "Pilih kategori utama dan kategori tambahan yang benar-benar relevan.",
            "Tulis deskripsi bisnis yang jelas, menyebut layanan utama dan area layanan.",
            "Lengkapi jam buka, jam khusus libur, dan metode kontak.",
            "Upload foto berkala: eksterior, interior, produk, tim, proses, dan hasil kerja.",
            "Balas review dengan sopan dan gunakan masukan pelanggan untuk memperbaiki layanan.",
        ],
        action_steps=[
            "Buka profil bisnis dan beri skor 1-5 untuk kelengkapan setiap bagian.",
            "Perbaiki kategori, jam buka, nomor kontak, dan deskripsi terlebih dulu.",
            "Jadwalkan upload foto dan cek review minimal setiap minggu.",
            "Pantau insight profil untuk melihat panggilan, arah, dan kunjungan website.",
        ],
        mistakes=[
            "Menulis deskripsi terlalu promosi tanpa menjelaskan layanan utama.",
            "Menggunakan foto stok yang tidak menunjukkan kondisi bisnis sebenarnya.",
            "Tidak mengatur jam khusus saat libur atau momen ramai.",
            "Membiarkan review negatif tanpa tanggapan profesional.",
        ],
        scenario=(
            "Sebuah tempat les privat punya profil Google tetapi hanya berisi alamat dan nomor telepon. Setelah menambahkan kategori yang tepat, deskripsi program, foto kelas, jam konsultasi, "
            "link website, dan balasan review, profilnya lebih mudah dipercaya orang tua yang sedang membandingkan beberapa tempat les di area yang sama."
        ),
        faq=[
            ("Apa bedanya Google Business Profile dan Google Maps?", "Google Business Profile adalah data profil bisnis yang tampil di Google Search dan Google Maps."),
            ("Apakah perlu upload foto terus?", "Idealnya ya, karena foto terbaru menunjukkan bisnis aktif dan membantu pelanggan memahami tempat, produk, atau layananmu."),
            ("Bolehkah memasukkan banyak kata kunci di nama bisnis?", "Sebaiknya gunakan nama bisnis asli. Nama yang dibuat berlebihan bisa membingungkan pelanggan dan berisiko melanggar kebijakan platform."),
        ],
        sources=[GOOGLE_LOCAL_RANKING, GOOGLE_BUSINESS_PROFILE],
    ),
    ArticleDraft(
        title="Cara Pelanggan Menilai Bisnis dari Tampilan Online",
        slug="cara-pelanggan-menilai-bisnis-dari-tampilan-online",
        excerpt="Hal yang biasanya dilihat calon pelanggan saat menilai bisnis dari website, Google Maps, sosial media, dan WhatsApp.",
        category="Tips Bisnis",
        pillar_name="Digital Trust & Prioritas Bisnis",
        tags=["digital trust", "UMKM", "website", "Google Maps", "sosial media"],
        read_time=6,
        seo_title="Cara Pelanggan Menilai Bisnis dari Tampilan Online",
        meta_description="Cara pelanggan menilai bisnis online: cek website, Google Maps, sosial media, review, foto, CTA, dan konsistensi informasi bisnis.",
        focus_keyword="bisnis mudah dipercaya online",
        target_cta="/kontak",
        image_prompt="Calon pelanggan membandingkan beberapa bisnis lokal lewat ponsel, melihat website, Google Maps, dan Instagram.",
        image_alt="pelanggan menilai bisnis dari tampilan online sebelum menghubungi",
        key_takeaways=[
            "Calon pelanggan menilai kepercayaan dari konsistensi informasi, bukti, dan kemudahan menghubungi",
            "Website, Google Maps, sosial media, dan WhatsApp harus saling mendukung",
            "Bisnis tidak harus terlihat besar, tetapi harus terlihat aktif, jelas, dan bisa dipercaya",
        ],
        audience_problem=(
            "Banyak UMKM merasa produk atau layanannya sudah bagus, tetapi tampilan online belum mencerminkan kualitas itu. Akibatnya pelanggan ragu sebelum sempat bertanya."
        ),
        practical_angle=(
            "Tampilan online yang baik bukan berarti harus mahal. Yang paling penting adalah jelas: siapa bisnisnya, apa yang ditawarkan, bukti apa yang tersedia, dan bagaimana cara menghubungi."
        ),
        checklist=[
            "Cek apakah nama bisnis, nomor telepon, alamat, dan jam buka konsisten di semua kanal.",
            "Pastikan pelanggan bisa menemukan layanan utama dalam beberapa detik.",
            "Tampilkan bukti seperti review, foto asli, portofolio, testimoni, atau studi kasus singkat.",
            "Gunakan CTA yang spesifik, misalnya konsultasi, cek jadwal, minta katalog, atau tanya paket.",
            "Rapikan foto profil, logo, bio sosial media, dan highlight penting.",
            "Pastikan pesan WhatsApp pertama mudah dipahami dan tidak membuat pelanggan mulai dari nol.",
        ],
        action_steps=[
            "Lihat bisnismu dari sudut pandang pelanggan baru yang belum mengenal brand.",
            "Prioritaskan kanal yang paling sering dilihat pelanggan sebelum membeli.",
            "Tambahkan bukti kerja atau testimoni di titik yang paling dekat dengan CTA.",
            "Evaluasi setiap bulan apakah pertanyaan pelanggan makin spesifik atau masih berulang hal dasar.",
        ],
        mistakes=[
            "Membiarkan informasi berbeda antara Instagram, Google Maps, dan website.",
            "Terlalu fokus mempercantik visual tetapi lupa menjelaskan layanan dan harga awal.",
            "Tidak menampilkan bukti nyata sehingga klaim bisnis terasa kosong.",
            "Menyembunyikan kontak atau membuat calon pelanggan harus mencari terlalu lama.",
        ],
        scenario=(
            "Sebuah jasa dekorasi acara punya hasil kerja bagus, tetapi Instagram hanya berisi foto tanpa keterangan, Google Maps tidak punya review, dan website belum ada. "
            "Calon pelanggan yang ingin membandingkan vendor akhirnya memilih kompetitor yang informasinya lebih lengkap. Setelah portofolio ditata, profil Google dirapikan, "
            "dan CTA WhatsApp dibuat jelas, bisnis tersebut tidak terlihat lebih besar, tetapi terlihat jauh lebih siap dipercaya."
        ),
        faq=[
            ("Apakah bisnis kecil harus terlihat seperti brand besar?", "Tidak. Bisnis kecil cukup terlihat jelas, aktif, jujur, dan mudah dihubungi."),
            ("Kanal mana yang harus dirapikan dulu?", "Mulai dari kanal yang paling sering dipakai calon pelanggan: biasanya Google Maps, Instagram, WhatsApp, lalu website."),
            ("Apa bukti paling sederhana untuk menaikkan kepercayaan?", "Foto asli, review pelanggan, contoh hasil kerja, alamat jelas, dan respons WhatsApp yang rapi."),
        ],
        sources=[GOOGLE_HELPFUL, GOOGLE_LOCAL_RANKING],
    ),
    ArticleDraft(
        title="Website UMKM Lemot: Penyebab dan Cara Mengeceknya",
        slug="website-umkm-lemot-penyebab-dan-cara-mengeceknya",
        excerpt="Penyebab umum website UMKM lemot dan cara mengecek masalah gambar, hosting, script, plugin, dan pengalaman mobile.",
        category="Maintenance",
        pillar_name="Maintenance Website",
        tags=["maintenance website", "website lemot", "performance", "UMKM"],
        read_time=6,
        seo_title="Website UMKM Lemot: Penyebab dan Cara Cek",
        meta_description="Website UMKM lemot bisa disebabkan gambar besar, hosting, plugin, script, cache, dan desain mobile yang berat. Ini cara mengeceknya.",
        focus_keyword="website UMKM lemot",
        target_cta="/layanan/maintenance",
        image_prompt="Layar laptop menampilkan website loading lambat dengan indikator performa dan pemilik bisnis terlihat mengecek laporan speed.",
        image_alt="pemilik UMKM mengecek penyebab website lemot",
        key_takeaways=[
            "Website lemot bisa menurunkan kepercayaan sebelum pelanggan membaca isi halaman",
            "Penyebab umum adalah gambar terlalu besar, hosting tidak cocok, script berat, cache buruk, atau plugin berlebihan",
            "Cek performa dari perangkat mobile karena banyak pelanggan membuka website lewat HP",
        ],
        audience_problem=(
            "Pemilik bisnis sering tahu websitenya lemot, tetapi tidak tahu apakah masalahnya dari hosting, gambar, template, plugin, atau koneksi pengunjung."
        ),
        practical_angle=(
            "Maintenance website bukan hanya memperbaiki error. Kecepatan juga bagian dari pengalaman pelanggan, terutama ketika mereka sedang membandingkan pilihan lewat ponsel."
        ),
        checklist=[
            "Cek skor dan rekomendasi dasar menggunakan PageSpeed Insights.",
            "Lihat ukuran gambar utama dan pastikan tidak mengunggah foto mentah berukuran sangat besar.",
            "Audit plugin, script tracking, widget chat, dan elemen pihak ketiga yang tidak penting.",
            "Pastikan cache, kompresi, dan format gambar modern sudah digunakan jika memungkinkan.",
            "Cek hosting: apakah resource cukup untuk traffic dan teknologi website.",
            "Uji website dari ponsel dengan koneksi biasa, bukan hanya dari laptop kantor.",
        ],
        action_steps=[
            "Catat halaman yang paling penting: homepage, layanan, kontak, dan artikel utama.",
            "Perbaiki gambar dan script berat dulu karena biasanya paling cepat memberi dampak.",
            "Simpan hasil tes sebelum dan sesudah agar perubahan bisa dibandingkan.",
            "Jadwalkan maintenance rutin agar masalah tidak menumpuk sampai website terasa berat lagi.",
        ],
        mistakes=[
            "Mengunggah foto resolusi besar langsung dari kamera tanpa kompresi.",
            "Memasang terlalu banyak plugin atau widget hanya karena terlihat menarik.",
            "Mengabaikan versi mobile padahal mayoritas calon pelanggan membuka lewat HP.",
            "Tidak melakukan backup sebelum memperbaiki plugin, theme, atau script.",
        ],
        scenario=(
            "Sebuah website laundry lokal terlihat bagus di awal, tetapi homepage memuat slider besar, banyak foto mentah, dan beberapa widget. Di laptop kantor terasa biasa saja, "
            "tetapi di ponsel pelanggan butuh waktu lama. Setelah gambar dikompresi, slider dikurangi, cache diatur, dan plugin tidak penting dimatikan, halaman lebih cepat dibuka "
            "dan pelanggan lebih mudah menekan tombol WhatsApp."
        ),
        faq=[
            ("Apakah website lemot selalu karena hosting?", "Tidak. Hosting bisa menjadi penyebab, tetapi gambar besar, plugin, script, dan desain halaman juga sering membuat website berat."),
            ("Apa halaman yang harus dicek dulu?", "Mulai dari homepage, halaman layanan utama, halaman kontak, dan halaman yang paling sering dikunjungi."),
            ("Apakah performa harus sempurna 100?", "Tidak harus. Yang penting website terasa cepat, stabil, dan tidak menghambat pelanggan mencari informasi atau menghubungi bisnis."),
        ],
        sources=[WEB_DEV_PERFORMANCE, PAGESPEED, GOOGLE_SEO_STARTER],
    ),
    ArticleDraft(
        title="Ide Konten Promosi UMKM yang Tidak Terasa Memaksa",
        slug="ide-konten-promosi-umkm-yang-tidak-terasa-memaksa",
        excerpt="Ide konten promosi untuk UMKM agar tetap menjual tanpa membuat audiens merasa terus-terusan disodori iklan.",
        category="Sosial Media",
        pillar_name="Sosial Media UMKM",
        tags=["konten promosi", "sosial media", "Instagram", "UMKM"],
        read_time=6,
        seo_title="Ide Konten Promosi UMKM yang Tidak Memaksa",
        meta_description="Ide konten promosi UMKM yang natural: edukasi, testimoni, proses, perbandingan, studi kasus, FAQ, dan soft selling di sosial media.",
        focus_keyword="ide konten UMKM",
        target_cta="/layanan/kelola-sosial-media",
        image_prompt="Ponsel menampilkan beberapa konsep konten promosi UMKM berupa testimoni, edukasi, proses kerja, dan promo ringan.",
        image_alt="ide konten promosi UMKM yang natural di sosial media",
        key_takeaways=[
            "Promosi tidak harus selalu berupa diskon atau ajakan beli langsung",
            "Konten promosi bisa terasa natural jika dimulai dari masalah, bukti, proses, atau edukasi",
            "Soft selling yang konsisten lebih sehat daripada hard selling setiap hari",
        ],
        audience_problem=(
            "Banyak pemilik UMKM takut promosi karena khawatir terlihat memaksa. Di sisi lain, kalau tidak promosi sama sekali, audiens tidak tahu apa yang dijual dan bagaimana cara membeli."
        ),
        practical_angle=(
            "Konten promosi yang baik membantu calon pelanggan memahami nilai produk sebelum diminta membeli. Jadi fokusnya bukan hanya menawarkan, tetapi memberi alasan yang masuk akal untuk bertanya."
        ),
        checklist=[
            "Ubah fitur produk menjadi manfaat yang dirasakan pelanggan.",
            "Gunakan testimoni untuk menunjukkan pengalaman nyata, bukan hanya klaim dari brand.",
            "Tampilkan proses kerja agar pelanggan melihat usaha dan kualitas di balik produk.",
            "Buat perbandingan sebelum-sesudah atau salah-benar jika relevan dengan bisnis.",
            "Jawab keberatan pelanggan seperti harga, waktu pengerjaan, cara pesan, dan garansi.",
            "Akhiri dengan CTA ringan seperti tanya stok, minta katalog, konsultasi, atau cek paket.",
        ],
        action_steps=[
            "Ambil 10 pertanyaan pelanggan terakhir dan ubah menjadi ide konten promosi halus.",
            "Pilih satu produk atau layanan utama untuk dipromosikan selama satu minggu.",
            "Siapkan bukti pendukung seperti foto, testimoni, hasil kerja, atau proses.",
            "Evaluasi konten dari respons yang masuk, bukan hanya jumlah like.",
        ],
        mistakes=[
            "Membuka setiap caption dengan kata diskon tanpa menjelaskan nilai produk.",
            "Membuat semua konten terlihat seperti katalog tanpa cerita atau konteks.",
            "Tidak memberi CTA sehingga audiens tertarik tetapi tidak tahu langkah berikutnya.",
            "Mengulang format promosi yang sama sampai audiens berhenti memperhatikan.",
        ],
        scenario=(
            "Sebuah bisnis hampers bisa mempromosikan produknya tanpa terus menulis beli sekarang. Konten bisa berupa tips memilih hampers untuk kantor, cerita proses packing, "
            "testimoni penerima, perbandingan isi paket, dan FAQ pengiriman. Promo tetap ada, tetapi terasa sebagai bagian dari informasi yang membantu."
        ),
        faq=[
            ("Berapa sering konten promosi boleh dibuat?", "Tergantung bisnis, tetapi pola aman adalah mencampur promosi dengan edukasi, bukti, proses, dan interaksi."),
            ("Apakah diskon masih efektif?", "Diskon bisa efektif jika dipakai dengan alasan dan batas yang jelas, bukan menjadi satu-satunya cara menjual."),
            ("Apa CTA yang tidak terlalu memaksa?", "Contohnya: tanya stok, minta katalog, cek ukuran, konsultasi kebutuhan, atau simpan dulu untuk referensi."),
        ],
        sources=[INSTAGRAM_HELP, META_BUSINESS, GOOGLE_HELPFUL],
    ),
    ArticleDraft(
        title="Audit Digital UMKM: 15 Hal yang Perlu Dicek Bulan Ini",
        slug="audit-digital-umkm-15-hal-yang-perlu-dicek-bulan-ini",
        excerpt="Checklist audit digital bulanan untuk UMKM: website, Google Maps, sosial media, WhatsApp, review, konten, dan data sederhana.",
        category="Tips Bisnis",
        pillar_name="Digital Trust & Prioritas Bisnis",
        tags=["audit digital", "UMKM", "website", "SEO", "sosial media"],
        read_time=7,
        seo_title="Audit Digital UMKM: 15 Hal yang Perlu Dicek",
        meta_description="Audit digital UMKM bulanan: cek website, Google Maps, sosial media, WhatsApp, review, konten, CTA, dan metrik sederhana.",
        focus_keyword="audit digital UMKM",
        target_cta="/kontak",
        image_prompt="Pemilik UMKM mencentang checklist audit digital di tablet dengan ikon website, Google Maps, Instagram, dan WhatsApp.",
        image_alt="checklist audit digital UMKM bulanan",
        key_takeaways=[
            "Audit digital bulanan membantu UMKM tahu bagian mana yang benar-benar perlu diperbaiki",
            "Cek website, Google Maps, sosial media, WhatsApp, review, dan data sederhana secara bersamaan",
            "Tujuan audit bukan menyalahkan, tetapi menentukan prioritas kerja bulan berikutnya",
        ],
        audience_problem=(
            "Banyak UMKM merasa harus melakukan semuanya: posting, bikin website, iklan, SEO, desain, dan promo. Tanpa audit, semua terasa penting dan akhirnya tidak ada yang selesai."
        ),
        practical_angle=(
            "Audit digital UMKM membuat keputusan lebih tenang. Kamu bisa melihat mana yang bocor, mana yang sudah cukup, dan mana yang memberi peluang paling cepat untuk diperbaiki."
        ),
        checklist=[
            "Cek apakah website bisa dibuka cepat dari ponsel.",
            "Pastikan tombol WhatsApp, form kontak, dan link sosial media masih berfungsi.",
            "Lihat apakah layanan utama mudah ditemukan di homepage.",
            "Cek profil Google Maps: jam buka, kategori, foto, review, dan nomor telepon.",
            "Pastikan Instagram atau sosial media utama masih aktif dan bio jelas.",
            "Cek apakah ada testimoni, portofolio, atau bukti kerja terbaru yang belum dipasang.",
            "Lihat pertanyaan pelanggan yang paling sering muncul dan jadikan bahan konten.",
            "Catat konten yang menghasilkan chat, simpan, share, atau pertanyaan berkualitas.",
            "Cek apakah informasi harga awal, paket, atau cara pesan sudah cukup jelas.",
            "Tentukan satu prioritas per kanal untuk bulan berikutnya.",
        ],
        action_steps=[
            "Luangkan 60-90 menit di akhir bulan untuk membuka semua kanal digital seperti pelanggan baru.",
            "Pilih maksimal tiga masalah yang paling dekat dengan keputusan pelanggan.",
            "Kumpulkan bukti sederhana seperti screenshot, jumlah chat, review baru, atau halaman yang sering dikunjungi.",
            "Ubah hasil audit menjadi tugas mingguan agar tidak berhenti di catatan.",
        ],
        mistakes=[
            "Audit terlalu banyak metrik sampai tidak ada keputusan yang diambil.",
            "Mengukur semua kanal dengan standar yang sama padahal fungsinya berbeda.",
            "Hanya melihat tampilan visual dan lupa mengecek CTA serta informasi bisnis.",
            "Tidak membuat tindak lanjut setelah menemukan masalah.",
        ],
        scenario=(
            "Sebuah toko perlengkapan bayi melakukan audit bulanan dan menemukan Instagram aktif, tetapi Google Maps jarang diperbarui, website lambat, dan banyak pelanggan bertanya jam buka. "
            "Daripada langsung membuat campaign baru, prioritas bulan itu adalah memperbaiki jam buka, menambah foto profil Google, mengompresi gambar website, dan membuat highlight FAQ. "
            "Perbaikan kecil ini membuat calon pelanggan lebih cepat mendapat jawaban."
        ),
        faq=[
            ("Seberapa sering audit digital dilakukan?", "Untuk UMKM, sebulan sekali cukup sebagai ritme dasar. Audit besar bisa dilakukan per kuartal."),
            ("Haruskah memakai tools mahal?", "Tidak. Mulai dari checklist manual, data platform, PageSpeed Insights, Google Business Profile, dan catatan chat pelanggan."),
            ("Apa hasil akhir audit?", "Daftar prioritas yang jelas: apa yang diperbaiki minggu ini, apa yang ditunda, dan apa yang butuh bantuan."),
        ],
        sources=[GOOGLE_SEO_STARTER, GOOGLE_LOCAL_RANKING, PAGESPEED],
    ),
]
