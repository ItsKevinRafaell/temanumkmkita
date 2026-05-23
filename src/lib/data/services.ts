export interface Package {
  name: string;
  price: string;
  period?: string;
  features: string[];
  highlighted?: boolean;
}

export interface ProcessStep {
  title: string;
  desc: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface ServiceData {
  slug: string;
  title: string;
  icon: string;
  hook: string;
  empathy: string;
  solution: string;
  benefits: string[];
  packages: Package[];
  process: ProcessStep[];
  faqs: FAQ[];
}

export const servicesData: ServiceData[] = [
  {
    slug: "web-development",
    title: "Web Development",
    icon: "🌐",
    hook: "Bisnis kamu kehilangan pelanggan karena tidak punya website yang profesional?",
    empathy:
      "Kami paham — membangun website sendiri itu rumit, mahal kalau salah pilih vendor, dan hasilnya sering tidak sesuai ekspektasi. Banyak UMKM akhirnya pakai media sosial saja, padahal website adalah aset digital yang bekerja 24 jam untuk kamu.",
    solution:
      "Kami bangun website profesional yang cepat, SEO-friendly, dan mudah dikelola — spesifik untuk kebutuhan bisnismu. Bukan template asal jadi.",
    benefits: [
      "Desain custom sesuai brand bisnismu",
      "Loading cepat, SEO-ready dari hari pertama",
      "Mobile-friendly di semua perangkat",
      "CMS mudah — update konten sendiri tanpa coder",
      "Domain & hosting siap pakai",
      "Garansi revisi hingga puas",
    ],
    packages: [
      {
        name: "Starter",
        price: "Rp 3.000.000",
        features: [
          "Landing page 1 halaman",
          "Domain .com 1 tahun",
          "Hosting 1 tahun",
          "Formulir kontak",
          "SEO dasar",
          "Revisi 2x",
        ],
      },
      {
        name: "Pro",
        price: "Rp 7.000.000",
        highlighted: true,
        features: [
          "Website company profile (5–8 halaman)",
          "Domain + hosting 1 tahun",
          "CMS untuk update konten",
          "Integrasi WhatsApp",
          "SEO on-page lengkap",
          "Google Analytics",
          "Revisi 5x",
        ],
      },
      {
        name: "Expert",
        price: "Rp 15.000.000",
        features: [
          "Website + sistem custom (booking, katalog, dll)",
          "Domain + hosting premium 1 tahun",
          "CMS + dashboard admin",
          "Integrasi payment gateway (opsional)",
          "SEO teknikal lengkap",
          "Laporan performa bulanan",
          "Revisi unlimited",
        ],
      },
    ],
    process: [
      { title: "Konsultasi & Briefing", desc: "Kami pelajari bisnis dan tujuan website kamu." },
      { title: "Desain Mockup", desc: "Kami kirim desain untuk di-review sebelum development." },
      { title: "Development", desc: "Kode ditulis, konten diisi, fitur dibangun." },
      { title: "Testing & Go-Live", desc: "Testing menyeluruh lalu website diluncurkan." },
    ],
    faqs: [
      {
        question: "Berapa lama waktu pengerjaan?",
        answer: "Paket Starter 5–7 hari, Pro 2–3 minggu, Expert 4–6 minggu tergantung kompleksitas.",
      },
      {
        question: "Apakah saya bisa update konten sendiri?",
        answer: "Ya, paket Pro ke atas dilengkapi CMS yang mudah digunakan tanpa keahlian teknikal.",
      },
      {
        question: "Bagaimana jika tidak puas dengan hasilnya?",
        answer: "Kami berikan garansi revisi sesuai paket. Kalau masih belum sesuai, kami diskusikan sampai kamu puas.",
      },
      {
        question: "Domain dan hosting termasuk?",
        answer: "Ya, semua paket sudah termasuk domain .com dan hosting untuk 1 tahun pertama.",
      },
    ],
  },
  {
    slug: "seo-google-maps",
    title: "SEO & Google Maps",
    icon: "📍",
    hook: "Calon pelanggan mencari produkmu di Google, tapi yang muncul justru kompetitor?",
    empathy:
      "Rasanya frustrasi punya bisnis bagus tapi tidak ada yang tahu. SEO bukan sihir, tapi butuh strategi yang tepat — dan itu yang jarang dimiliki UMKM karena sibuk mengurus bisnis harian.",
    solution:
      "Kami optimalkan kehadiran online bisnismu di Google Search dan Google Maps, sehingga calon pelanggan yang sudah siap beli bisa menemukanmu duluan.",
    benefits: [
      "Ranking di halaman pertama Google untuk kata kunci target",
      "Google Business Profile dioptimalkan & dikelola",
      "Muncul di peta Google Maps area bisnis kamu",
      "Konten SEO berkualitas setiap bulan",
      "Laporan posisi ranking bulanan",
      "Strategi long-term, bukan trik sesaat",
    ],
    packages: [
      {
        name: "Starter",
        price: "Rp 500.000",
        period: "/bulan",
        features: [
          "Optimasi Google Business Profile",
          "5 kata kunci target",
          "2 artikel SEO/bulan",
          "Laporan ranking bulanan",
        ],
      },
      {
        name: "Pro",
        price: "Rp 1.500.000",
        period: "/bulan",
        highlighted: true,
        features: [
          "Optimasi GBP + posting rutin",
          "15 kata kunci target",
          "4 artikel SEO/bulan",
          "Backlink building",
          "Laporan detail + konsultasi bulanan",
        ],
      },
      {
        name: "Expert",
        price: "Rp 3.000.000",
        period: "/bulan",
        features: [
          "Full SEO management",
          "30+ kata kunci target",
          "8 artikel SEO/bulan",
          "Backlink premium",
          "SEO teknikal website",
          "Laporan komprehensif + strategi",
        ],
      },
    ],
    process: [
      { title: "Audit & Riset", desc: "Analisis kondisi SEO saat ini dan riset kata kunci potensial." },
      { title: "Optimasi Awal", desc: "Setup Google Business Profile dan perbaikan on-page SEO." },
      { title: "Konten & Backlink", desc: "Produksi artikel SEO dan pembangunan backlink berkualitas." },
      { title: "Monitor & Laporan", desc: "Pantau ranking setiap minggu, laporan bulanan ke kamu." },
    ],
    faqs: [
      {
        question: "Berapa lama sampai terlihat hasilnya?",
        answer: "SEO adalah investasi jangka panjang. Biasanya terlihat perbaikan dalam 1–3 bulan, hasil signifikan dalam 3–6 bulan.",
      },
      {
        question: "Apakah ranking dijamin halaman 1?",
        answer: "Tidak ada yang bisa menjamin ranking pasti — itu adalah praktik tidak jujur. Kami jamin proses yang benar dan hasil yang terukur.",
      },
      {
        question: "Apa bedanya dengan Google Ads?",
        answer: "Google Ads bayar per klik dan berhenti saat budget habis. SEO adalah trafik organik yang terus mengalir tanpa bayar per klik.",
      },
      {
        question: "Apakah bisa dibatalkan kapan saja?",
        answer: "Ya, tidak ada kontrak jangka panjang yang memaksa. Kami percaya hasil kerja kami yang akan membuat kamu bertahan.",
      },
    ],
  },
  {
    slug: "kelola-sosial-media",
    title: "Kelola Sosial Media",
    icon: "📲",
    hook: "Sosmed bisnis kamu sepi, postingan tidak konsisten, dan follower tidak tumbuh?",
    empathy:
      "Kami mengerti — mengelola sosial media sambil mengurus operasional bisnis itu melelahkan. Konten harus kreatif, konsisten, dan relevan. Kalau tidak dikerjakan dengan serius, hasilnya cuma buang waktu.",
    solution:
      "Kami kelola sosial media bisnismu secara profesional: konten terencana, desain menarik, caption engaging — sehingga follower tumbuh dan penjualan ikut naik.",
    benefits: [
      "Konten plan bulanan yang terstruktur",
      "Desain visual konsisten dengan brand",
      "Caption dan copywriting dalam Bahasa Indonesia yang engaging",
      "Jadwal posting optimal untuk jangkauan maksimal",
      "Pantau dan balas komentar/pesan",
      "Laporan engagement dan pertumbuhan follower",
    ],
    packages: [
      {
        name: "Starter",
        price: "Rp 800.000",
        period: "/bulan",
        features: [
          "1 platform (Instagram atau Facebook)",
          "12 postingan/bulan",
          "Desain feed konsisten",
          "Caption copywriting",
          "Laporan bulanan",
        ],
      },
      {
        name: "Pro",
        price: "Rp 1.800.000",
        period: "/bulan",
        highlighted: true,
        features: [
          "2 platform (Instagram + Facebook)",
          "20 postingan/bulan",
          "Desain feed + story",
          "Caption + hashtag research",
          "Community management (reply komentar)",
          "Laporan detail bulanan",
        ],
      },
      {
        name: "Expert",
        price: "Rp 4.000.000",
        period: "/bulan",
        features: [
          "3 platform (IG + FB + TikTok/Twitter)",
          "30+ postingan/bulan",
          "Konten video reels/TikTok",
          "Full community management",
          "Strategi konten & growth",
          "Laporan + konsultasi bulanan",
        ],
      },
    ],
    process: [
      { title: "Brand Audit", desc: "Pelajari brand, target audience, dan kompetitor bisnismu." },
      { title: "Content Plan", desc: "Buat rencana konten sebulan ke depan untuk di-approve." },
      { title: "Produksi & Jadwal", desc: "Desain, tulis caption, jadwalkan posting di waktu terbaik." },
      { title: "Monitor & Laporan", desc: "Pantau engagement dan kirim laporan performa bulanan." },
    ],
    faqs: [
      {
        question: "Platform apa saja yang bisa dikelola?",
        answer: "Instagram, Facebook, TikTok, Twitter/X, dan LinkedIn. Platform disesuaikan dengan target pasar bisnismu.",
      },
      {
        question: "Apakah saya bisa approve konten sebelum di-posting?",
        answer: "Ya, semua konten akan dikirim untuk review dan approval dulu sebelum ditayangkan.",
      },
      {
        question: "Bagaimana dengan konten foto produk?",
        answer: "Kamu kirimkan foto/video produk, kami yang olah dan desain menjadi konten yang menarik.",
      },
      {
        question: "Apakah termasuk iklan berbayar?",
        answer: "Paket ini untuk konten organik. Untuk iklan berbayar (Meta Ads, TikTok Ads), tersedia sebagai add-on terpisah.",
      },
    ],
  },
];

export function getServiceBySlug(slug: string): ServiceData | undefined {
  return servicesData.find((s) => s.slug === slug);
}
