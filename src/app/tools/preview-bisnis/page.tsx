import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo/site";
import MulaiClient from "./MulaiClient";

export const metadata: Metadata = {
  title: "Mulai — Temukan Solusi Digital untuk Usahamu | Teman UMKM Kita",
  description:
    "Jawab beberapa pertanyaan singkat dan lihat langsung simulasi bisnismu di Google Maps, preview website siap pakai, hingga prediksi pertumbuhan ranking. Gratis untuk UMKM Indonesia.",
  alternates: { canonical: `${SITE_URL}/tools/preview-bisnis` },
  openGraph: {
    title: "Mulai — Temukan Solusi Digital untuk Usahamu",
    description:
      "Jawab beberapa pertanyaan singkat, lihat simulasi bisnismu di Google, preview website, dan rekomendasi solusi digital yang pas untuk UMKM-mu.",
    url: `${SITE_URL}/tools/preview-bisnis`,
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Simulasi & Onboarding Bisnis di Google",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "IDR" },
  provider: { "@type": "Organization", name: "Teman UMKM Kita", url: SITE_URL },
  description:
    "Alur onboarding interaktif untuk UMKM: simulasi tampilan bisnis di Google Maps, preview website siap pakai per industri, dan prediksi pertumbuhan ranking SEO. Gratis untuk UMKM Indonesia.",
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MulaiClient />
    </>
  );
}
