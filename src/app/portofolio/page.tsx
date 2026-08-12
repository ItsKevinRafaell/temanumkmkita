import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo/site";
import { fetchAllPortfolios } from "@/lib/api/portfolio";
import PortofolioClient from "./PortofolioClient";

export const metadata: Metadata = {
  title: "Portofolio — Teman UMKM Kita",
  description:
    "Galeri karya dan demo website multi-sektor dari Teman UMKM Kita. Apa pun industri Anda, kami bangun kehadiran digital yang sesuai karakter usaha — bukan template seragam.",
  alternates: { canonical: `${SITE_URL}/portofolio` },
  robots: { index: false, follow: false },
};

// Selalu ambil data terbaru dari DB saat request (porto bisa ditambah via admin).
export const dynamic = "force-dynamic";

export default async function Page() {
  const items = await fetchAllPortfolios();
  return <PortofolioClient items={items} />;
}
