// Portofolio real hasil kerja Teman UMKM Kita.
// Dipakai sebagai fallback di halaman layanan saat data DB (admin) masih kosong.
// Begitu porto ditambah lewat admin (/admin/portfolio), data DB otomatis menimpa ini.

export interface RealPortfolio {
  name: string;
  category: string;
  image_url: string;
  link_url: string | null;
}

export const FALLBACK_PORTFOLIO: RealPortfolio[] = [
  {
    name: "Karya Bangun Nusantara",
    category: "Kontraktor & Konstruksi",
    image_url: "/portofolio/karya-bangun-nusantara/assets/img/gen/hero.jpg",
    link_url: "/portofolio/karya-bangun-nusantara",
  },
  {
    name: "Dapur Rasa Nusantara",
    category: "Restoran & Kuliner",
    image_url: "/portofolio/dapur-rasa-nusantara/assets/img/gen/dr-hero-table.jpg",
    link_url: "/portofolio/dapur-rasa-nusantara",
  },
  {
    name: "Helai Studio",
    category: "Fashion & Studio",
    image_url: "/portofolio/helai-studio/assets/img/gen/hero-editorial.jpg",
    link_url: "/portofolio/helai-studio",
  },
];
