import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo/site";
import WebDevelopmentClient from "./Client";

export const metadata: Metadata = {
  title: "Web Development — Website Profesional untuk UMKM | Teman UMKM Kita",
  description: "Website profesional untuk UMKM Indonesia. Domain, hosting, SSL termasuk. Mulai dari Rp 1.000.000/tahun.",
  alternates: { canonical: `${SITE_URL}/layanan/web-development` },
  openGraph: {
    title: "Web Development — Website Profesional untuk UMKM",
    description: "Website profesional untuk UMKM Indonesia. Mulai dari Rp 1.000.000/tahun.",
    url: `${SITE_URL}/layanan/web-development`,
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Web Development",
  name: "Web Development untuk UMKM",
  provider: { "@type": "Organization", name: "Teman UMKM Kita", url: SITE_URL },
  areaServed: { "@type": "Country", name: "Indonesia" },
  description: "Pembuatan website profesional dengan domain, hosting, SSL, dan SEO dasar untuk UMKM Indonesia.",
  offers: [
    { "@type": "Offer", name: "Web Starter", price: "1000000", priceCurrency: "IDR" },
    { "@type": "Offer", name: "Web Pro", price: "2250000", priceCurrency: "IDR" },
    { "@type": "Offer", name: "Web Expert", price: "3750000", priceCurrency: "IDR" },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <WebDevelopmentClient />
    </>
  );
}
