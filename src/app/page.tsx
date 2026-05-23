import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import StatsSection from "@/components/sections/StatsSection";
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
        <StatsSection />
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
