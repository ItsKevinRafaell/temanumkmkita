import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import MarqueeTicker from "@/components/sections/MarqueeTicker";
import ProblemSection from "@/components/sections/ProblemSection";
import LayananSection from "@/components/sections/LayananSection";
import CaraKerjaSection from "@/components/sections/CaraKerjaSection";
import TestimonialSection from "@/components/sections/TestimonialSection";
import CTASection from "@/components/sections/CTASection";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <MarqueeTicker />
        <ProblemSection />
        <LayananSection />
        <CaraKerjaSection />
        <TestimonialSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
