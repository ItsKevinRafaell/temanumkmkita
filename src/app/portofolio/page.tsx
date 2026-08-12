import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo/site";
import PortofolioClient from "./PortofolioClient";

export const metadata: Metadata = {
  title: "Portofolio — Teman UMKM Kita",
  description:
    "Galeri demo website multi-sektor dari Teman UMKM Kita. Apa pun industri Anda, kami bangun kehadiran digital yang sesuai karakter usaha — bukan template seragam.",
  alternates: { canonical: `${SITE_URL}/portofolio` },
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PortofolioClient />;
}
