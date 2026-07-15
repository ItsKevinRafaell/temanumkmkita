import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo/site";
import SosmedClient from "./Client";

export const metadata: Metadata = {
  title: "Kelola Sosial Media — Konten Konsisten untuk UMKM | Teman UMKM Kita",
  description:
    "Layanan kelola sosial media untuk UMKM. Konten konsisten, engagement naik, brand kuat di Instagram dan TikTok.",
  alternates: { canonical: `${SITE_URL}/layanan/kelola-sosial-media` },
  openGraph: {
    title: "Kelola Sosial Media untuk UMKM",
    description: "Konten konsisten, engagement naik, brand kuat di Instagram dan TikTok.",
    url: `${SITE_URL}/layanan/kelola-sosial-media`,
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Social Media Management",
  name: "Kelola Sosial Media untuk UMKM",
  provider: { "@type": "Organization", name: "Teman UMKM Kita", url: SITE_URL },
  areaServed: { "@type": "Country", name: "Indonesia" },
  description:
    "Layanan pengelolaan sosial media UMKM — konten, engagement, dan branding di Instagram, TikTok, Facebook.",
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SosmedClient />
    </>
  );
}
