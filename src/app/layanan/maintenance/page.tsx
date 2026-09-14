import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo/site";
import MaintenanceClient from "./Client";

export const metadata: Metadata = {
  title: "Maintenance Website untuk UMKM: Backup, Update & Keamanan | Teman UMKM Kita",
  description:
    "Layanan maintenance website untuk UMKM: backup, update WordPress, scan malware, pembaruan informasi bisnis, dan pengamanan sesuai paket.",
  alternates: { canonical: `${SITE_URL}/layanan/maintenance` },
  openGraph: {
    title: "Maintenance Website untuk UMKM",
    description:
      "Backup, update WordPress, scan malware, pembaruan informasi bisnis, dan pengamanan sesuai paket.",
    url: `${SITE_URL}/layanan/maintenance`,
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Website Maintenance",
  name: "Maintenance Website untuk UMKM",
  provider: { "@type": "Organization", name: "Teman UMKM Kita", url: SITE_URL },
  areaServed: { "@type": "Country", name: "Indonesia" },
  description:
    "Layanan pemeliharaan website berkala untuk UMKM — backup, update, security, dan monitoring.",
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MaintenanceClient />
    </>
  );
}
