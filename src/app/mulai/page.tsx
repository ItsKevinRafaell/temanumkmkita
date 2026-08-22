import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo/site";
import MulaiClient from "./MulaiClient";

export const metadata: Metadata = {
  title: "Mulai — Temukan Solusi Digital untuk Usahamu | Teman UMKM Kita",
  description:
    "Jawab beberapa pertanyaan singkat dan dapatkan rekomendasi solusi digital yang pas untuk UMKM-mu: website, SEO Google Maps, sosial media, hingga branding.",
  alternates: { canonical: `${SITE_URL}/mulai` },
  openGraph: {
    title: "Mulai — Temukan Solusi Digital untuk Usahamu",
    description:
      "Jawab beberapa pertanyaan singkat, dapatkan rekomendasi solusi digital yang pas untuk UMKM-mu.",
    url: `${SITE_URL}/mulai`,
    type: "website",
  },
};

export default function Page() {
  return <MulaiClient />;
}
