import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo/site";
import PreviewBisnisClient from "./Client";

export const metadata: Metadata = {
  title: "Simulasi Bisnismu di Google — Preview Gratis untuk UMKM | Teman UMKM Kita",
  description:
    "Lihat simulasi tampilan bisnismu di Google Maps & prediksi pertumbuhan ranking SEO dalam hitungan detik. Gratis untuk UMKM Indonesia.",
  alternates: { canonical: `${SITE_URL}/tools/preview-bisnis` },
  openGraph: {
    title: "Simulasi Bisnismu di Google — Preview Gratis untuk UMKM",
    description:
      "Lihat simulasi tampilan bisnismu di Google Maps & prediksi pertumbuhan ranking. Gratis untuk UMKM.",
    url: `${SITE_URL}/tools/preview-bisnis`,
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Simulasi Bisnis di Google",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "IDR" },
  provider: { "@type": "Organization", name: "Teman UMKM Kita", url: SITE_URL },
  description:
    "Tool gratis simulasi tampilan bisnis UMKM di Google Maps dan prediksi pertumbuhan ranking SEO untuk UMKM Indonesia.",
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PreviewBisnisClient />
    </>
  );
}
