export type ContentBlock =
  | { type: "h2"; text: string; id: string }
  | { type: "h3"; text: string; id: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "blockquote"; text: string }
  | { type: "cta-inline" }
  | { type: "image"; alt: string; caption?: string };

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: "Website" | "SEO" | "Sosial Media" | "Branding" | "Tips Bisnis";
  date: string;
  readTime: number;
  featured?: boolean;
  content: ContentBlock[];
}

export const allPosts: BlogPost[] = [
  {
    slug: "website-umkm-wajib-hadir-google-maps",
    title: "5 Alasan Website UMKM Wajib Tampil di Google Maps",
    excerpt:
      "Google Maps bukan sekadar petunjuk arah — ia adalah mesin penemuan bisnis lokal terbesar di Indonesia. Pelajari kenapa UMKM yang tidak hadir di sana kehilangan calon pelanggan setiap hari.",
    category: "SEO",
    date: "2025-05-10",
    readTime: 7,
    featured: true,
    content: [
      {
        type: "p",
        text: 'Setiap hari, jutaan orang Indonesia mengetik frasa seperti "warung makan terdekat", "bengkel motor dekat sini", atau "toko baju di Surabaya" di Google. Sebagian besar pencarian ini berakhir di satu tempat: Google Maps. Tapi sayangnya, banyak UMKM masih belum punya kehadiran di sana — atau sudah punya tapi tidak dikelola dengan benar.',
      },
      {
        type: "p",
        text: "Artikel ini akan menjelaskan lima alasan konkret kenapa Google Maps bukan sekadar opsi, tapi keharusan bagi bisnis lokal yang ingin bertahan dan tumbuh di era digital.",
      },
      {
        type: "h2",
        id: "1-pelanggan-cari-bisnis-dari-maps",
        text: "1. Pelanggan Sekarang Mulai Pencarian dari Maps, Bukan Website",
      },
      {
        type: "p",
        text: "Perilaku konsumen berubah drastis. Menurut data Google, lebih dari 76% orang yang melakukan pencarian lokal di smartphone mengunjungi bisnis terkait dalam 24 jam. Dan kebanyakan pencarian itu dimulai dari Google Maps atau Google Search yang langsung menampilkan local pack (tiga bisnis teratas di peta).",
      },
      {
        type: "p",
        text: "Artinya, kalau bisnis Anda tidak muncul di sana, Anda tidak masuk dalam pertimbangan — bahkan sebelum calon pelanggan sempat melihat website atau media sosial Anda.",
      },
      {
        type: "blockquote",
        text: '"Bisnis yang tidak terlihat secara digital sama saja tidak ada bagi generasi yang lahir dengan smartphone di tangan."',
      },
      {
        type: "h2",
        id: "2-google-maps-adalah-reputasi-digital",
        text: "2. Google Maps Adalah Wajah Pertama Bisnis Anda",
      },
      {
        type: "p",
        text: "Ketika seseorang menemukan bisnis Anda di Maps, yang mereka lihat pertama kali bukan iklan — tapi profil bisnis Anda: foto, rating, jam buka, nomor telepon, dan ulasan pelanggan. Ini adalah kesan pertama yang memutuskan apakah mereka klik atau lewat.",
      },
      {
        type: "ul",
        items: [
          "Foto produk atau tempat usaha yang menarik meningkatkan kepercayaan",
          "Rating bintang tinggi = social proof yang kuat",
          "Jam buka yang akurat mencegah kekecewaan pelanggan",
          "Deskripsi bisnis yang tepat membantu algoritma Google",
        ],
      },
      {
        type: "p",
        text: "Profil yang tidak dikelola — foto kosong, jam buka salah, atau tidak ada ulasan — justru memberi sinyal negatif kepada calon pelanggan.",
      },
      { type: "cta-inline" },
      {
        type: "h2",
        id: "3-bisa-muncul-tanpa-iklan",
        text: "3. Anda Bisa Muncul di Halaman Pertama Tanpa Bayar Iklan",
      },
      {
        type: "p",
        text: "Salah satu keunggulan terbesar Google Maps dibanding iklan berbayar: hasilnya organik. Bisnis kecil dengan profil yang dioptimalkan bisa mengalahkan bisnis besar yang punya anggaran iklan jutaan rupiah, asal relevansi lokal dan kualitas profil lebih baik.",
      },
      {
        type: "p",
        text: "Tiga faktor utama yang mempengaruhi ranking di Google Maps:",
      },
      {
        type: "ol",
        items: [
          "Relevansi — seberapa sesuai profil bisnis Anda dengan kata kunci yang dicari",
          "Jarak — seberapa dekat lokasi bisnis dengan pengguna yang mencari",
          "Keunggulan — rating, jumlah ulasan, dan kelengkapan profil",
        ],
      },
      {
        type: "h2",
        id: "4-ulasan-adalah-mesin-konversi",
        text: "4. Ulasan Pelanggan Adalah Mesin Konversi Paling Murah",
      },
      {
        type: "p",
        text: "BrightLocal melaporkan bahwa 87% konsumen membaca ulasan online sebelum memilih bisnis lokal. Dan 79% mempercayai ulasan online seperti rekomendasi personal. Ulasan bukan sekadar bintang — ini adalah bukti sosial yang memengaruhi keputusan pembelian langsung.",
      },
      {
        type: "p",
        text: "Strategi sederhana yang bekerja: minta pelanggan yang puas untuk meninggalkan ulasan segera setelah transaksi selesai. Caranya bisa semudah kirim link Google Maps lewat WhatsApp setelah order diterima.",
      },
      {
        type: "h2",
        id: "5-terintegrasi-dengan-ekosistem-google",
        text: "5. Terintegrasi Penuh dengan Ekosistem Google",
      },
      {
        type: "p",
        text: "Google Maps bukan berdiri sendiri. Profil bisnis Anda di Maps otomatis muncul di Google Search (panel samping kanan), Google Shopping, dan bahkan hasil pencarian gambar. Satu profil yang dioptimalkan memberikan eksposur di banyak saluran sekaligus.",
      },
      {
        type: "p",
        text: "Selain itu, fitur Google Posts memungkinkan Anda berbagi promo, acara, atau update produk langsung di profil Maps — gratis, tanpa perlu website atau akun iklan.",
      },
      {
        type: "h2",
        id: "langkah-selanjutnya",
        text: "Langkah Selanjutnya",
      },
      {
        type: "p",
        text: "Mulai dengan mengklaim Google Business Profile Anda di business.google.com. Isi semua informasi dengan lengkap dan akurat: nama bisnis, kategori, alamat, jam buka, nomor telepon, dan setidaknya 5-10 foto berkualitas baik.",
      },
      {
        type: "p",
        text: "Kalau Anda butuh bantuan setup, optimasi, atau pengelolaan rutin, tim Teman UMKM Kita siap membantu. Paket SEO kami mencakup full management Google Business Profile dari awal sampai ranking.",
      },
    ],
  },
  {
    slug: "cara-pilih-nama-domain-bisnis",
    title: "Cara Memilih Nama Domain yang Tepat untuk Bisnis Anda",
    excerpt:
      "Nama domain bukan sekadar alamat website — ia adalah identitas digital bisnis Anda. Salah pilih, susah diingat. Tepat pilih, bisnis lebih mudah ditemukan.",
    category: "Website",
    date: "2025-05-03",
    readTime: 5,
    content: [
      {
        type: "p",
        text: "Memilih nama domain sering dianggap sepele, padahal keputusan ini berdampak jangka panjang pada branding dan SEO bisnis Anda. Domain yang buruk susah diingat, susah diketik, dan menyulitkan Google memahami bisnis Anda.",
      },
      {
        type: "h2",
        id: "prinsip-dasar-nama-domain",
        text: "Prinsip Dasar Memilih Nama Domain",
      },
      {
        type: "ul",
        items: [
          "Pendek — idealnya di bawah 15 karakter",
          "Mudah diucapkan dan dieja — hindari angka dan tanda hubung",
          "Relevan dengan bisnis atau nama brand",
          "Gunakan ekstensi .com atau .id untuk bisnis Indonesia",
          "Hindari merek dagang milik orang lain",
        ],
      },
      {
        type: "h2",
        id: "domain-vs-brand",
        text: "Domain Berdasarkan Nama Brand vs Kata Kunci",
      },
      {
        type: "p",
        text: "Domain berbasis nama brand (misal: tokobaju.com) lebih fleksibel untuk berkembang. Domain berbasis kata kunci (misal: sepatukulitjakarta.com) bisa membantu SEO lokal tapi membatasi ekspansi produk di masa depan.",
      },
      {
        type: "p",
        text: "Rekomendasi: gunakan nama brand sebagai domain utama, dan optimalkan konten untuk kata kunci di halaman dan artikel blog.",
      },
      {
        type: "h2",
        id: "cek-ketersediaan-domain",
        text: "Cara Cek Ketersediaan Domain",
      },
      {
        type: "p",
        text: "Gunakan tool seperti Namecheap, GoDaddy, atau Niagahoster untuk mengecek ketersediaan domain. Kalau domain yang Anda inginkan sudah diambil, coba variasi dengan menambahkan kata seperti 'id', 'store', atau 'official' di depan atau belakang nama brand.",
      },
    ],
  },
  {
    slug: "tips-instagram-untuk-toko-online",
    title: "7 Tips Instagram yang Terbukti Tingkatkan Penjualan Toko Online",
    excerpt:
      "Instagram bukan sekadar foto bagus. Ini strategi konten, caption, dan jadwal yang bisa langsung Anda terapkan hari ini — tanpa harus jadi fotografer profesional.",
    category: "Sosial Media",
    date: "2025-04-26",
    readTime: 6,
    content: [
      {
        type: "p",
        text: "Banyak pemilik toko online punya akun Instagram tapi tidak tahu cara memaksimalkannya. Followers stagnant, engagement rendah, dan penjualan dari Instagram nol. Masalahnya bukan di produk — tapi di strategi.",
      },
      {
        type: "h2",
        id: "konsistensi-lebih-penting-dari-viral",
        text: "Konsistensi Lebih Penting dari Viral",
      },
      {
        type: "p",
        text: "Algoritma Instagram menyukai akun yang posting secara konsisten. Target minimal 3 kali per minggu. Gunakan konten carousel untuk edukasi produk, Reels untuk jangkauan organik lebih luas, dan Stories untuk engagement harian.",
      },
      {
        type: "h2",
        id: "formula-caption-yang-menjual",
        text: "Formula Caption yang Menjual",
      },
      {
        type: "ol",
        items: [
          "Hook — kalimat pertama yang memancing rasa ingin tahu",
          "Value — manfaat atau informasi yang berguna",
          "Proof — testimoni atau angka yang memperkuat kepercayaan",
          "CTA — ajakan bertindak yang jelas (DM, klik link bio, dsb)",
        ],
      },
      {
        type: "h2",
        id: "hashtag-yang-benar",
        text: "Hashtag: Lebih Sedikit, Lebih Tepat",
      },
      {
        type: "p",
        text: "Jangan gunakan 30 hashtag generik. Pilih 5-10 hashtag campuran: niche (1k-50k posts), medium (50k-500k), dan branded hashtag bisnis Anda sendiri. Hashtag yang terlalu umum membuat konten tenggelam dalam hitungan menit.",
      },
    ],
  },
  {
    slug: "kenapa-website-lambat-buruk-untuk-bisnis",
    title: "Kenapa Website Lambat Bisa Merusak Bisnis Anda (dan Cara Memperbaikinya)",
    excerpt:
      "Google menghukum website lambat dengan ranking lebih rendah. Pengunjung meninggalkan halaman yang butuh lebih dari 3 detik untuk loading. Ini yang perlu Anda lakukan sekarang.",
    category: "Website",
    date: "2025-04-19",
    readTime: 5,
    content: [
      {
        type: "p",
        text: "Menurut data Google, 53% pengguna mobile meninggalkan halaman web yang butuh lebih dari 3 detik untuk dimuat. Untuk bisnis dengan website lambat, ini berarti lebih dari separuh calon pelanggan pergi sebelum sempat melihat produk Anda.",
      },
      {
        type: "h2",
        id: "dampak-kecepatan-pada-seo",
        text: "Dampak Kecepatan pada SEO dan Konversi",
      },
      {
        type: "p",
        text: "Kecepatan halaman adalah salah satu faktor ranking Google yang eksplisit sejak Core Web Vitals menjadi sinyal resmi di 2021. Website lambat tidak hanya kehilangan pengunjung, tapi juga peringkat di hasil pencarian.",
      },
      {
        type: "h2",
        id: "penyebab-umum-website-lambat",
        text: "Penyebab Umum Website Lambat",
      },
      {
        type: "ul",
        items: [
          "Gambar tidak dioptimasi (upload langsung dari kamera 4-8 MB)",
          "Plugin berlebihan di WordPress",
          "Hosting murah dengan server shared yang overload",
          "Tidak menggunakan CDN untuk aset statis",
          "JavaScript terlalu banyak yang render-blocking",
        ],
      },
      {
        type: "h2",
        id: "cara-cek-kecepatan-website",
        text: "Cara Cek Kecepatan Website Anda",
      },
      {
        type: "p",
        text: "Gunakan PageSpeed Insights (pagespeed.web.dev) untuk mengukur skor Core Web Vitals website Anda. Target skor 90+ untuk mobile dan desktop. Skor di bawah 50 butuh penanganan segera.",
      },
    ],
  },
  {
    slug: "logo-profesional-untuk-umkm",
    title: "Mengapa Logo Profesional Penting untuk UMKM (Bukan Sekadar Gambar)",
    excerpt:
      "Logo yang baik bukan tentang keindahan visual semata. Ia tentang kepercayaan, konsistensi, dan kesan pertama yang terbentuk dalam 7 detik pertama pelanggan melihat bisnis Anda.",
    category: "Branding",
    date: "2025-04-12",
    readTime: 4,
    content: [
      {
        type: "p",
        text: "Banyak UMKM menganggap logo hanya pelengkap — 'yang penting ada'. Padahal logo adalah satu-satunya elemen visual yang hadir di semua touchpoint bisnis: struk, kemasan, media sosial, nota, spanduk, hingga seragam karyawan.",
      },
      {
        type: "h2",
        id: "logo-sebagai-alat-kepercayaan",
        text: "Logo sebagai Alat Kepercayaan, Bukan Sekadar Gambar",
      },
      {
        type: "p",
        text: "Penelitian menunjukkan bahwa konsumen membentuk kesan pertama tentang bisnis dalam 50 milidetik. Logo yang profesional menyampaikan pesan: 'bisnis ini serius, terpercaya, dan layak dibeli'. Logo yang terkesan amatir memberikan sinyal sebaliknya — bahkan sebelum calon pelanggan membaca satu kata pun.",
      },
      {
        type: "h2",
        id: "ciri-logo-yang-bekerja",
        text: "Ciri Logo yang Bekerja untuk Bisnis",
      },
      {
        type: "ul",
        items: [
          "Sederhana — mudah dikenali dan diingat",
          "Serbaguna — terlihat baik di ukuran besar maupun kecil, hitam-putih maupun berwarna",
          "Relevan — mencerminkan industri dan nilai bisnis",
          "Timeless — tidak terlalu mengikuti tren yang cepat berubah",
          "Unik — bisa dibedakan dari kompetitor",
        ],
      },
      {
        type: "h2",
        id: "file-format-yang-dibutuhkan",
        text: "Format File yang Wajib Dimiliki",
      },
      {
        type: "p",
        text: "Pastikan Anda memiliki: file vektor (SVG atau AI/EPS) untuk cetak, PNG transparan untuk media digital, dan versi warna gelap-terang untuk berbagai latar belakang. Tanpa file vektor, logo akan pecah saat diperbesar untuk spanduk atau banner.",
      },
    ],
  },
  {
    slug: "maintenance-website-kenapa-penting",
    title: "Website Tidak Pernah Dirawat? Ini Risikonya yang Sering Diabaikan",
    excerpt:
      "WordPress yang tidak di-update, backup yang tidak ada, dan plugin usang adalah resep website terkena hack. Pelajari kenapa maintenance bukan biaya tambahan, tapi investasi keamanan.",
    category: "Tips Bisnis",
    date: "2025-04-05",
    readTime: 5,
    content: [
      {
        type: "p",
        text: "Setelah website selesai dibuat, banyak pemilik bisnis berpikir pekerjaannya selesai. Kenyataannya, website seperti kendaraan — butuh perawatan rutin agar tidak mogok di jalan yang paling tidak tepat.",
      },
      {
        type: "h2",
        id: "risiko-website-tanpa-maintenance",
        text: "Risiko Nyata Website yang Tidak Dirawat",
      },
      {
        type: "ul",
        items: [
          "WordPress outdated = celah keamanan yang dieksploitasi hacker",
          "Plugin usang = crash tiba-tiba atau incompatibility",
          "Tidak ada backup = kehilangan semua konten saat server error",
          "Malware tidak terdeteksi = website kena blacklist Google (tidak muncul di pencarian)",
          "SSL kadaluarsa = browser tampilkan peringatan 'Not Secure' kepada pengunjung",
        ],
      },
      {
        type: "h2",
        id: "seberapa-sering-maintenance",
        text: "Seberapa Sering Website Perlu Dirawat?",
      },
      {
        type: "p",
        text: "Backup otomatis idealnya setiap minggu dengan retensi minimal 1 bulan. Update WordPress core dan plugin sebaiknya dilakukan setiap ada rilis baru, tapi dengan testing dulu di staging environment untuk menghindari conflict.",
      },
      {
        type: "blockquote",
        text: '"Bukan soal apakah website akan kena masalah — tapi kapan. Bedanya adalah apakah Anda siap menghadapinya."',
      },
      {
        type: "h2",
        id: "tanda-website-butuh-perhatian",
        text: "Tanda-tanda Website Butuh Perhatian Segera",
      },
      {
        type: "p",
        text: "Jika Anda melihat salah satu dari tanda berikut, website Anda butuh penanganan segera: loading sangat lambat tiba-tiba, muncul konten asing di halaman, Google Search Console menampilkan peringatan keamanan, atau traffic organik turun drastis tanpa sebab jelas.",
      },
    ],
  },
];

export const categories = [
  "Semua",
  "Website",
  "SEO",
  "Sosial Media",
  "Branding",
  "Tips Bisnis",
] as const;

export type Category = (typeof categories)[number];

export function getPostsByCategory(category: Category): BlogPost[] {
  if (category === "Semua") return allPosts;
  return allPosts.filter((p) => p.category === category);
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return allPosts.find((p) => p.slug === slug);
}

export function getRelatedPosts(current: BlogPost, limit = 3): BlogPost[] {
  return allPosts
    .filter((p) => p.slug !== current.slug && p.category === current.category)
    .slice(0, limit)
    .concat(
      allPosts
        .filter((p) => p.slug !== current.slug && p.category !== current.category)
        .slice(0, Math.max(0, limit - allPosts.filter((p) => p.slug !== current.slug && p.category === current.category).length))
    )
    .slice(0, limit);
}

export function extractHeadings(content: ContentBlock[]): { id: string; text: string; level: 2 | 3 }[] {
  return content
    .filter((b): b is Extract<ContentBlock, { type: "h2" | "h3" }> => b.type === "h2" || b.type === "h3")
    .map((b) => ({ id: b.id, text: b.text, level: b.type === "h2" ? 2 : 3 }));
}
