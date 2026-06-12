import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { servicesData } from "@/lib/data/services";
import { SITE_URL } from "@/lib/seo/site";
import type { Metadata } from "next";
import { ArrowRight, ChevronRight, Globe, MapPin, PenLine, Share2, Wrench, type LucideIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Layanan — Teman UMKM Kita",
  description: "Web development, SEO, kelola sosial media, maintenance website, dan desain logo untuk UMKM Indonesia.",
  alternates: { canonical: `${SITE_URL}/layanan` },
};

const allServices = [
  ...servicesData,
  {
    slug: "web-development-bulanan",
    title: "Web Development Bulanan",
    icon: "🌐",
    hook: "Website profesional dengan biaya bulanan, cocok untuk UMKM yang ingin mulai tanpa bayar besar di awal.",
    benefits: [],
    packages: [],
    process: [],
    faqs: [],
    empathy: "",
    solution: "",
  },
  {
    slug: "maintenance",
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

const iconMap: Record<string, LucideIcon> = {
  "web-development": Globe,
  "web-development-bulanan": Globe,
  "seo-google-maps": MapPin,
  "kelola-sosial-media": Share2,
  maintenance: Wrench,
  "desain-logo": PenLine,
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@graph": allServices.map((s) => ({
    "@type": "Service",
    name: s.title,
    description: s.hook,
    url: `${SITE_URL}/layanan/${s.slug}`,
    provider: { "@type": "LocalBusiness", name: "Teman UMKM Kita", url: SITE_URL },
    areaServed: "ID",
  })),
};

export default function LayananPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="relative overflow-hidden pt-12 pb-16 bg-canvas">
          <div className="absolute inset-x-0 top-0 h-px bg-brand-dark/10" />
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-1.5 text-xs text-brand-dark/40 font-medium mb-8">
              <Link href="/" className="hover:text-brand-dark transition-colors">Beranda</Link>
              <ChevronRight size={12} />
              <span className="text-brand-dark/70">Layanan</span>
            </div>
            <p className="text-accent font-bold text-sm uppercase tracking-wider mb-4">
              Semua Layanan
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brand-dark leading-tight mb-5 max-w-3xl">
              Solusi Digital Yang Bisa Dimulai Dari Kebutuhan Paling Mendesak.
            </h1>
            <p className="text-lg sm:text-xl text-brand-dark/60 max-w-2xl leading-relaxed">
              Dari website, SEO, sosial media, hingga logo — kami kerjakan semuanya
              sehingga kamu bisa fokus menjalankan bisnis.
            </p>
          </div>
        </section>

        {/* Services grid */}
        <section className="pb-24 bg-canvas">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {allServices.map((service) => {
                const Icon = iconMap[service.slug] ?? Globe;
                return (
                <Link
                  key={service.slug}
                  href={`/layanan/${service.slug}`}
                  className="group bg-white rounded-lg p-8 border border-brand-dark/8 hover:border-accent/45 hover:shadow-card hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="h-11 w-11 rounded-md bg-accent/10 flex items-center justify-center mb-5">
                    <Icon size={21} className="text-accent" />
                  </div>
                  <h2 className="font-bold text-brand-dark text-xl mb-3 group-hover:text-accent transition-colors">
                    {service.title}
                  </h2>
                  <p className="text-brand-dark/60 text-sm leading-relaxed mb-4">
                    {service.hook}
                  </p>
                  <span className="inline-flex items-center gap-2 text-brand-dark font-bold text-sm group-hover:text-accent transition-colors">
                    Lihat Detail
                    <ArrowRight size={15} />
                  </span>
                </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-canvas">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="rounded-lg border border-accent/25 bg-white p-8 sm:p-10 shadow-card">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-dark mb-4">
                Tidak Yakin Layanan Mana Yang Tepat?
              </h2>
              <p className="text-brand-dark/60 mb-8">
                Ceritakan bisnismu dan kami bantu rekomendasikan solusi paling prioritas, gratis.
              </p>
              <a
                href="https://wa.me/6289501925395?text=Halo%2C+saya+ingin+konsultasi+layanan+yang+tepat+untuk+bisnis+saya"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-accent text-white font-bold px-6 py-3.5 rounded-lg text-base hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20"
              >
                Konsultasi Gratis
                <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
