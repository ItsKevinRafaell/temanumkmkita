import type { ServiceData } from "@/lib/data/services";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ServiceHero from "@/components/sections/ServiceHero";
import ServicePackages from "@/components/sections/ServicePackages";
import ServiceProcess from "@/components/sections/ServiceProcess";
import ServiceFAQ from "@/components/sections/ServiceFAQ";

interface Props {
  service: ServiceData;
}

export default function ServicePageLayout({ service }: Props) {
  return (
    <>
      <Navbar />
      <main>
        <ServiceHero service={service} />

        {/* Benefits */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-accent font-bold text-sm uppercase tracking-wider">Yang Kamu Dapat</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-dark mt-3">
                Apa yang kami berikan
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {service.benefits.map((benefit, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-canvas rounded-lg">
                  <span className="text-accent font-bold text-lg mt-0.5">✓</span>
                  <span className="text-brand-dark font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <ServicePackages packages={service.packages} />
        <ServiceProcess steps={service.process} />
        <ServiceFAQ faqs={service.faqs} title={service.title} />

        {/* CTA */}
        <section className="py-20 bg-accent">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Tertarik dengan layanan ini?
            </h2>
            <p className="text-white/70 mb-8">
              Konsultasi gratis, tidak ada tekanan. Ceritakan kebutuhanmu.
            </p>
            <a
              href={`https://wa.me/6289501925395?text=Halo%2C+saya+tertarik+dengan+layanan+${encodeURIComponent(service.title)}`}
              target="_blank"
              rel="noopener noreferrer"
            className="inline-block bg-white text-brand-dark font-bold px-6 py-3.5 rounded-lg text-base hover:bg-white/90 transition-colors"
            >
              Hubungi Kami via WhatsApp →
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
