import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { servicesData } from "@/lib/data/services";
import { SITE_URL } from "@/lib/seo/site";
import type { Metadata } from "next";
import {
  ArrowRight,
  ChevronRight,
  Globe,
  MapPin,
  PenLine,
  Share2,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Layanan — Teman UMKM Kita",
  description:
    "Web development, SEO, kelola sosial media, maintenance website, dan desain logo untuk UMKM Indonesia.",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="relative overflow-hidden bg-canvas pb-16 pt-12">
          <div className="absolute inset-x-0 top-0 h-px bg-brand-dark/10" />
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center gap-1.5 text-xs font-medium text-brand-dark/40">
              <Link href="/" className="transition-colors hover:text-brand-dark">
                Beranda
              </Link>
              <ChevronRight size={12} />
              <span className="text-brand-dark/70">Layanan</span>
            </div>
            <p className="mb-4 text-sm font-bold uppercase tracking-wider text-accent">
              Semua Layanan
            </p>
            <h1 className="mb-5 max-w-3xl text-4xl font-extrabold leading-tight text-brand-dark sm:text-5xl lg:text-6xl">
              Solusi Digital Yang Bisa Dimulai Dari Kebutuhan Paling Mendesak.
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-brand-dark/60 sm:text-xl">
              Dari website, SEO, sosial media, hingga logo — kami kerjakan semuanya sehingga kamu
              bisa fokus menjalankan bisnis.
            </p>
          </div>
        </section>

        {/* Services grid */}
        <section className="bg-canvas pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {allServices.map((service) => {
                const Icon = iconMap[service.slug] ?? Globe;
                return (
                  <Link
                    key={service.slug}
                    href={`/layanan/${service.slug}`}
                    className="border-brand-dark/8 group rounded-lg border bg-white p-8 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/45 hover:shadow-card"
                  >
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md bg-accent/10">
                      <Icon size={21} className="text-accent" />
                    </div>
                    <h2 className="mb-3 text-xl font-bold text-brand-dark transition-colors group-hover:text-accent">
                      {service.title}
                    </h2>
                    <p className="mb-4 text-sm leading-relaxed text-brand-dark/60">
                      {service.hook}
                    </p>
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-brand-dark transition-colors group-hover:text-accent">
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
        <section className="bg-canvas py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <div className="rounded-lg border border-accent/25 bg-white p-8 shadow-card sm:p-10">
              <h2 className="mb-4 text-3xl font-extrabold text-brand-dark sm:text-4xl">
                Tidak Yakin Layanan Mana Yang Tepat?
              </h2>
              <p className="mb-8 text-brand-dark/60">
                Ceritakan bisnismu dan kami bantu rekomendasikan solusi paling prioritas, gratis.
              </p>
              <a
                href="https://wa.me/6289501925395?text=Halo%2C+saya+ingin+konsultasi+layanan+yang+tepat+untuk+bisnis+saya"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-accent/20 transition-colors hover:bg-accent/90"
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
