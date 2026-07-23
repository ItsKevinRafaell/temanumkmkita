import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo/site";
import TentangKamiPage from "./TentangKamiPage";

export const metadata: Metadata = {
  title: "Tentang Kami — Teman UMKM Kita",
  description:
    "Kenali kami lebih dekat. Teman UMKM Kita hadir untuk membantu bisnis lokal Indonesia tumbuh dan berkembang di era digital.",
  alternates: { canonical: `${SITE_URL}/tentang-kami` },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  mainEntity: {
    "@type": "Organization",
    name: "Teman UMKM Kita",
    url: SITE_URL,
    founder: {
      "@type": "Person",
      name: "Kevin Pierre Rafael Sabran",
      jobTitle: "Founder & Digital Strategist",
    },
  },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TentangKamiPage />
    </>
  );
}
