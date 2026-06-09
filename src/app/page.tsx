import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import MarqueeTicker from "@/components/sections/MarqueeTicker";
import ProblemSection from "@/components/sections/ProblemSection";
import LayananSection from "@/components/sections/LayananSection";
import CaraKerjaSection from "@/components/sections/CaraKerjaSection";
import CTASection from "@/components/sections/CTASection";
import { SITE_URL } from "@/lib/seo/site";
import { fetchSiteSettings } from "@/lib/api/blog";
import { buildHomepageProof } from "@/lib/site-proof";

export const metadata: Metadata = {
  alternates: { canonical: SITE_URL },
};

export default async function HomePage() {
  let settings = null;
  try {
    settings = await fetchSiteSettings();
  } catch {}

  const proof = buildHomepageProof(settings);

  return (
    <>
      <Navbar />
      <main>
        <HeroSection proof={proof} />
        <MarqueeTicker proof={proof} />
        <ProblemSection />
        <LayananSection />
        <CaraKerjaSection />
        <CTASection proof={proof} />
      </main>
      <Footer />
    </>
  );
}
