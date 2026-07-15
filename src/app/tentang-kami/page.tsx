import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo/site";
import TentangKamiPage from "./TentangKamiPage";

export const metadata: Metadata = {
  title: "Tentang Kami — Teman UMKM Kita",
  description:
    "Kenali kami lebih dekat. Teman UMKM Kita hadir untuk membantu bisnis lokal Indonesia tumbuh dan berkembang di era digital.",
  alternates: { canonical: `${SITE_URL}/tentang-kami` },
};

export default function Page() {
  return <TentangKamiPage />;
}
