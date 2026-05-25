import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo/site";
import DesainLogoClient from "./Client";

export const metadata: Metadata = {
  title: "Desain Logo — Identitas Visual untuk UMKM | Teman UMKM Kita",
  description: "Jasa desain logo profesional untuk UMKM Indonesia. Logo yang merepresentasikan bisnis dengan filosofi dan estetika yang kuat.",
  alternates: { canonical: `${SITE_URL}/layanan/desain-logo` },
  openGraph: {
    title: "Desain Logo untuk UMKM",
    description: "Logo profesional yang merepresentasikan bisnis Anda dengan filosofi dan estetika yang kuat.",
    url: `${SITE_URL}/layanan/desain-logo`,
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Logo Design",
  name: "Desain Logo untuk UMKM",
  provider: { "@type": "Organization", name: "Teman UMKM Kita", url: SITE_URL },
  areaServed: { "@type": "Country", name: "Indonesia" },
  description: "Jasa desain logo profesional dengan filosofi merek dan identitas visual yang kuat untuk UMKM.",
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <DesainLogoClient />
    </>
  );
}
