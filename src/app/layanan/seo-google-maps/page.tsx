import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo/site";
import SEOClient from "./Client";

export const metadata: Metadata = {
  title: "SEO & Google Maps — Bisnis Anda Muncul di Pencarian Lokal | Teman UMKM Kita",
  description:
    "Optimasi SEO Google Maps untuk UMKM. Bantu bisnis lokal Anda muncul di halaman pertama Google saat pelanggan mencari di area sekitar.",
  alternates: { canonical: `${SITE_URL}/layanan/seo-google-maps` },
  openGraph: {
    title: "SEO & Google Maps untuk UMKM",
    description: "Bantu bisnis Anda muncul di pencarian Google lokal dan Google Maps.",
    url: `${SITE_URL}/layanan/seo-google-maps`,
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "SEO & Google Maps Optimization",
  name: "SEO & Google Maps untuk UMKM",
  provider: { "@type": "Organization", name: "Teman UMKM Kita", url: SITE_URL },
  areaServed: { "@type": "Country", name: "Indonesia" },
  description:
    "Layanan optimasi SEO dan Google Maps untuk membantu bisnis lokal UMKM muncul di pencarian Google.",
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SEOClient />
    </>
  );
}
