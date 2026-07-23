import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo/site";
import ProfilGoogleClient from "./Client";

export const metadata: Metadata = {
  title: "Generator Profil Google Bisnis Gratis untuk UMKM | Teman UMKM Kita",
  description:
    "Bikin deskripsi, keyword, dan template balasan review Google Business Profile untuk UMKM-mu dalam 30 detik. Gratis, hasil siap tempel ke Google.",
  alternates: { canonical: `${SITE_URL}/tools/profil-google` },
  openGraph: {
    title: "Generator Profil Google Bisnis Gratis untuk UMKM",
    description:
      "Deskripsi, keyword, dan template balasan review yang siap tempel ke Google Business Profile. Gratis untuk UMKM.",
    url: `${SITE_URL}/tools/profil-google`,
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Generator Profil Google Bisnis",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "IDR" },
  provider: { "@type": "Organization", name: "Teman UMKM Kita", url: SITE_URL },
  description:
    "Tool gratis untuk membuat profil Google Business Profile lengkap: deskripsi, keyword, dan template balasan review untuk UMKM Indonesia.",
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProfilGoogleClient />
    </>
  );
}
