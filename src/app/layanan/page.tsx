import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { servicesData } from "@/lib/data/services";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Layanan — Teman UMKM Kita",
  description: "Web development, SEO, kelola sosial media, maintenance website, dan desain logo untuk UMKM Indonesia.",
};

const allServices = [
  ...servicesData,
  {
    slug: "maintenance-website",
    title: "Maintenance Website",
    icon: "🔧",
    hook: "Website kamu tetap aman, cepat, dan selalu diperbarui.",
    benefits: [],
    packages: [],
    process: [],
    faqs: [],
    empathy: "",
    solution: "",
  },
  {
    slug: "desain-logo",
    title: "Desain Logo",
    icon: "✏️",
    hook: "Identitas visual yang berkesan dan profesional untuk bisnismu.",
    benefits: [],
    packages: [],
    process: [],
    faqs: [],
    empathy: "",
    solution: "",
  },
];

export default function LayananPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="py-20 bg-canvas">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-accent font-bold text-sm uppercase tracking-wider">Semua Layanan</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brand-dark mt-3 mb-6">
              Semua yang kamu butuhkan<br />
              <span className="text-accent">untuk hadir online</span>
            </h1>
            <p className="text-xl text-brand-dark/60 max-w-2xl mx-auto">
              Dari website, SEO, sosial media, hingga logo — kami kerjakan semuanya
              sehingga kamu bisa fokus menjalankan bisnis.
            </p>
          </div>
        </section>

        {/* Services grid */}
        <section className="pb-24 bg-canvas">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {allServices.map((service) => (
                <Link
                  key={service.slug}
                  href={`/layanan/${service.slug}`}
                  className="group bg-white rounded-2xl p-8 border border-brand-dark/8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 shine-sweep"
                >
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h2 className="font-bold text-brand-dark text-xl mb-3 group-hover:text-accent transition-colors">
                    {service.title}
                  </h2>
                  <p className="text-brand-dark/60 text-sm leading-relaxed mb-4">
                    {service.hook}
                  </p>
                  <span className="text-accent font-semibold text-sm group-hover:underline">
                    Lihat detail →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-accent">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Tidak yakin layanan mana yang tepat?
            </h2>
            <p className="text-white/70 mb-8">
              Ceritakan bisnismu dan kami bantu rekomendasikan solusi terbaik, gratis.
            </p>
            <a
              href="https://wa.me/6289501925395?text=Halo%2C+saya+ingin+konsultasi+layanan+yang+tepat+untuk+bisnis+saya"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-brand-dark text-white font-bold px-8 py-4 rounded-full text-lg hover:bg-brand-dark/90 transition-colors"
            >
              Konsultasi Gratis →
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
