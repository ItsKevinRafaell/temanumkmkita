import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo/site";
import WebDevelopmentBulananClient from "./Client";

export const metadata: Metadata = {
  title: "Web Development Bulanan — Website Tanpa Bayar Besar di Awal | Teman UMKM Kita",
  description:
    "Website profesional UMKM dengan biaya bulanan. Mulai dari Rp 120.000/bulan, tanpa kontrak tahunan.",
  alternates: { canonical: `${SITE_URL}/layanan/web-development-bulanan` },
  openGraph: {
    title: "Web Development Bulanan untuk UMKM",
    description: "Mulai Rp 120.000/bulan. Website profesional tanpa biaya setup besar di awal.",
    url: `${SITE_URL}/layanan/web-development-bulanan`,
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Web Development Subscription",
  name: "Web Development Bulanan untuk UMKM",
  provider: { "@type": "Organization", name: "Teman UMKM Kita", url: SITE_URL },
  areaServed: { "@type": "Country", name: "Indonesia" },
  description:
    "Layanan website profesional dengan billing bulanan untuk UMKM yang ingin hadir online tanpa biaya besar di awal.",
  offers: [
    { "@type": "Offer", name: "Web Starter", price: "120000", priceCurrency: "IDR" },
    { "@type": "Offer", name: "Web Pro", price: "250000", priceCurrency: "IDR" },
    { "@type": "Offer", name: "Web Expert", price: "375000", priceCurrency: "IDR" },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WebDevelopmentBulananClient />
    </>
  );
}
