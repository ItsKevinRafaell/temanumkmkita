"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Check,
  X,
  ChevronRight,
  ChevronDown,
  Globe,
  Layout,
  MapPin,
  Search,
  BarChart2,
  Mail,
  FileText,
  Zap,
  MessageCircle,
  Star,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PortfolioSlider from "@/components/sections/PortfolioSlider";
import { fetchPortfolios } from "@/lib/api/portfolio";

// ─── Data ─────────────────────────────────────────────────────────────────────

const WA_BASE = "https://wa.me/6289501925395?text=";

const plans = [
  {
    id: "starter",
    name: "Web Starter",
    price: "1.000.000",
    renewal: "350.000",
    tagline: "Bisnis yang baru mau hadir online dengan satu halaman fokus penjualan.",
    features: [
      "1 Halaman (Sales Focus)",
      "Domain & Hosting (Tahun ke-1)",
      "Tombol WhatsApp Chat",
      "SSL (Keamanan HTTPS)",
      "Mobile Friendly",
    ],
    cta: "Pilih Starter",
    wa: WA_BASE + encodeURIComponent("Halo, saya tertarik dengan paket Web Starter (Tahunan)."),
    featured: false,
  },
  {
    id: "pro",
    name: "Web Pro",
    price: "2.250.000",
    renewal: "500.000",
    badge: "Paling Populer",
    tagline: "Bisnis yang butuh website lengkap dengan beberapa halaman dan visibilitas Google.",
    features: [
      "Semua fitur Starter",
      "Max. 5 Halaman",
      "Embed Google Maps",
      "SEO Dasar (meta, heading, sitemap)",
      "Google Analytics",
    ],
    cta: "Pilih Pro",
    wa: WA_BASE + encodeURIComponent("Halo, saya tertarik dengan paket Web Pro (Tahunan)."),
    featured: true,
  },
  {
    id: "expert",
    name: "Web Expert",
    price: "3.750.000",
    renewal: "750.000",
    tagline: "Bisnis yang butuh website skala penuh dengan blog dan performa optimal.",
    features: [
      "Semua fitur Pro",
      "Max. 10 Halaman",
      "Setup Email Profesional (Titan Mail)",
      "Blog / Artikel System",
      "Speed Optimization",
    ],
    cta: "Pilih Expert",
    wa: WA_BASE + encodeURIComponent("Halo, saya tertarik dengan paket Web Expert (Tahunan)."),
    featured: false,
  },
];

const tableRows = [
  { feature: "Jumlah Halaman", icon: Layout, starter: "1", pro: "5", expert: "10" },
  { feature: "Domain & Hosting", icon: Globe, starter: true, pro: true, expert: true },
  { feature: "SSL (HTTPS)", icon: null, starter: true, pro: true, expert: true },
  { feature: "Mobile Friendly", icon: null, starter: true, pro: true, expert: true },
  { feature: "WA Chat Button", icon: MessageCircle, starter: true, pro: true, expert: true },
  { feature: "Embed Google Maps", icon: MapPin, starter: false, pro: true, expert: true },
  { feature: "SEO Dasar", icon: Search, starter: false, pro: true, expert: true },
  { feature: "Google Analytics", icon: BarChart2, starter: false, pro: true, expert: true },
  { feature: "Email Profesional", icon: Mail, starter: false, pro: false, expert: true },
  { feature: "Blog System", icon: FileText, starter: false, pro: false, expert: true },
  { feature: "Speed Optimization", icon: Zap, starter: false, pro: false, expert: true },
];

const notes = [
  {
    icon: Globe,
    title: "Domain & Hosting",
    text: "Termasuk untuk tahun pertama. Perpanjangan berikutnya dikenakan biaya hosting sesuai provider.",
  },
  {
    icon: Zap,
    title: "Pengerjaan",
    text: "Estimasi 5–10 hari kerja setelah brief diterima dan DP terkonfirmasi.",
  },
  {
    icon: Check,
    title: "Revisi",
    text: "2× revisi termasuk dalam setiap paket. Revisi tambahan bisa didiskusikan.",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function CellValue({ val }: { val: boolean | string }) {
  if (typeof val === "string") {
    return <span className="text-sm font-semibold text-brand-dark">{val}</span>;
  }
  return val ? (
    <Check size={16} className="mx-auto text-accent" />
  ) : (
    <X size={14} className="mx-auto text-brand-dark/20" />
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WebDevelopmentPage() {
  const [tableOpen, setTableOpen] = useState(false);
  const [portfolioItems, setPortfolioItems] = useState<
    Array<{ name: string; category: string; image_url: string }>
  >([]);
  useEffect(() => {
    fetchPortfolios("web-development").then((data) =>
      setPortfolioItems(
        data.map((item) => ({
          name: item.title,
          category: item.category ?? "",
          image_url: item.image_url,
        }))
      )
    );
  }, []);
  const { ref: pricingRef } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: ctaRef, inView: ctaInView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* ── Header ────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pb-12 pt-12">
          <div className="absolute inset-x-0 top-0 h-px bg-brand-dark/10" />

          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <div className="mb-6 flex items-center gap-1.5 text-xs font-medium text-brand-dark/40">
              <Link href="/" className="transition-colors hover:text-brand-dark">
                Beranda
              </Link>
              <ChevronRight size={12} />
              <Link href="/layanan" className="transition-colors hover:text-brand-dark">
                Layanan
              </Link>
              <ChevronRight size={12} />
              <span className="text-brand-dark/70">Website</span>
            </div>

            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl"
              >
                <p className="mb-4 text-sm font-bold uppercase tracking-wider text-accent">
                  Web Development
                </p>
                <h1 className="mb-4 text-4xl font-extrabold leading-tight text-brand-dark sm:text-5xl">
                  Website Profesional Yang
                  <br />
                  <span className="text-accent">Bekerja Untuk Bisnis Anda.</span>
                </h1>
                <p className="text-lg text-brand-dark/60">
                  Bayar sekali, nikmati setahun penuh. Domain, hosting, dan setup sudah termasuk.
                </p>
              </motion.div>

              {/* Tahunan / Bulanan toggle */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="flex flex-shrink-0 flex-col items-start gap-1.5 self-start sm:items-end sm:self-auto"
              >
                <div className="border-brand-dark/8 flex items-center rounded-lg border bg-white p-1">
                  <span className="rounded-lg bg-accent px-4 py-2 text-sm font-bold text-white">
                    Tahunan
                  </span>
                  <Link
                    href="/layanan/web-development-bulanan"
                    className="rounded-lg px-4 py-2 text-sm font-semibold text-brand-dark/50 transition-colors hover:text-brand-dark"
                  >
                    Bulanan
                  </Link>
                </div>
                <span className="rounded-md bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
                  Hemat hingga 20%
                </span>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Portfolio ──────────────────────────────────────────────── */}
        {portfolioItems.length > 0 && (
          <section className="py-20">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <span className="mb-3 block text-sm font-bold uppercase tracking-wider text-accent">
                    Portofolio
                  </span>
                  <h2 className="text-4xl font-extrabold text-brand-dark">
                    Website Yang Sudah
                    <br />
                    <span className="text-accent">Kami Bangun</span>
                  </h2>
                </div>
              </div>
              <PortfolioSlider items={portfolioItems} />
            </div>
          </section>
        )}

        {/* ── Pricing Cards ─────────────────────────────────────────── */}
        <section ref={pricingRef} className="py-10 pb-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-start gap-6 md:grid-cols-3">
              {plans.map((plan, i) => (
                <motion.div
                  key={plan.id}
                  initial={false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className={`relative flex flex-col gap-5 rounded-lg p-7 ${
                    plan.featured
                      ? "border-2 border-accent bg-white shadow-xl shadow-accent/10 md:-mt-3 md:pb-10"
                      : "border-brand-dark/8 card-shadow border bg-white/80 backdrop-blur-sm"
                  }`}
                >
                  {/* Popular badge */}
                  {plan.badge && (
                    <div className="absolute -top-3 right-5">
                      <span className="flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-xs font-bold text-white">
                        <Star size={11} fill="white" />
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  {/* Plan name + tagline */}
                  <div>
                    <div className="mb-1 text-xs font-bold uppercase tracking-widest text-brand-dark/40">
                      {plan.name}
                    </div>
                    <div className="mb-1 flex flex-wrap items-baseline gap-1">
                      <span className="text-xs font-medium text-brand-dark/50">Rp</span>
                      <span className="text-2xl font-black text-brand-dark md:text-3xl">
                        {plan.price}
                      </span>
                      <span className="text-xs text-brand-dark/40 md:text-sm">/tahun</span>
                    </div>
                    <p className="mb-3 text-xs font-medium text-brand-dark/40">
                      Perpanjangan: Rp {plan.renewal}/tahun
                    </p>
                    <p className="border-brand-dark/6 border-t pt-3 text-sm leading-relaxed text-brand-dark/60">
                      {plan.tagline}
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="flex-1 space-y-2.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <Check size={15} className="mt-0.5 flex-shrink-0 text-accent" />
                        <span className="text-sm text-brand-dark/70">{f}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.name === "Web Starter" && (
                    <div className="border-brand-dark/6 border-t pt-3 text-xs font-medium text-brand-dark/40">
                      ⚡ Garansi revisi 2× — belum puas? diskusikan sampai cocok.
                    </div>
                  )}

                  {/* CTA */}
                  <a
                    href={plan.wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block rounded-xl py-3.5 text-center text-sm font-bold transition-all duration-200 ${
                      plan.featured
                        ? "bg-accent text-white shadow-lg shadow-accent/20 hover:bg-accent/90"
                        : "border border-brand-dark/15 text-brand-dark/70 hover:border-accent hover:text-accent"
                    }`}
                  >
                    {plan.cta}
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Comparison Table ──────────────────────────────────────── */}
        <section className="py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <span className="mb-2 block text-sm font-bold uppercase tracking-wider text-accent">
                  Perbandingan
                </span>
                <h2 className="text-3xl font-extrabold text-brand-dark">
                  Fitur Lengkap Tiap Paket
                </h2>
              </div>
              {/* Mobile toggle */}
              <button
                onClick={() => setTableOpen(!tableOpen)}
                className="flex items-center gap-2 rounded-lg border border-brand-dark/15 px-4 py-2 text-sm font-semibold text-brand-dark/60 md:hidden"
              >
                {tableOpen ? "Tutup" : "Lihat tabel"}
                <ChevronDown
                  size={14}
                  className={`transition-transform ${tableOpen ? "rotate-180" : ""}`}
                />
              </button>
            </div>

            <div className={`${tableOpen ? "block" : "hidden"} overflow-x-auto md:block`}>
              <div className="border-brand-dark/8 card-shadow min-w-[600px] overflow-hidden rounded-lg border bg-white">
                {/* Header row */}
                <div className="border-brand-dark/8 bg-brand-dark/2 grid grid-cols-4 border-b">
                  <div className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-brand-dark/40">
                    Fitur
                  </div>
                  {["Starter", "Pro", "Expert"].map((h) => (
                    <div
                      key={h}
                      className={`px-3 py-4 text-center text-sm font-extrabold ${
                        h === "Pro"
                          ? "bg-accent/8 border-l-2 border-l-accent/30 text-accent"
                          : "border-brand-dark/6 border-l text-brand-dark"
                      }`}
                    >
                      {h}
                    </div>
                  ))}
                </div>

                {/* Data rows */}
                {tableRows.map((row, i) => (
                  <div
                    key={i}
                    className={`grid grid-cols-4 border-b border-brand-dark/5 last:border-0 ${
                      i % 2 === 0 ? "bg-transparent" : "bg-brand-dark/1"
                    }`}
                  >
                    <div className="flex items-center gap-2 px-5 py-3.5 text-sm font-medium text-brand-dark/70">
                      {row.icon && (
                        <row.icon size={13} className="flex-shrink-0 text-brand-dark/30" />
                      )}
                      {row.feature}
                    </div>
                    {(["starter", "pro", "expert"] as const).map((col) => (
                      <div
                        key={col}
                        className={`flex items-center justify-center px-3 py-3.5 text-center ${
                          col === "pro"
                            ? "bg-accent/8 border-l-2 border-l-accent/30"
                            : "border-l border-brand-dark/5"
                        }`}
                      >
                        <CellValue val={row[col] as boolean | string} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Notes Box ─────────────────────────────────────────────── */}
        <section className="pb-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-6">
              <div className="mb-4 text-xs font-bold uppercase tracking-wider text-amber-700">
                Catatan Penting
              </div>
              <div className="grid gap-5 sm:grid-cols-3">
                {notes.map((n, i) => {
                  const Icon = n.icon;
                  return (
                    <div key={i} className="flex gap-3">
                      <Icon size={15} className="mt-0.5 flex-shrink-0 text-amber-600" />
                      <div>
                        <div className="mb-0.5 text-sm font-semibold text-amber-800">{n.title}</div>
                        <div className="text-sm leading-relaxed text-amber-700/80">{n.text}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────────── */}
        <section ref={ctaRef} className="py-20">
          <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <h2 className="mb-4 text-3xl font-extrabold text-brand-dark sm:text-4xl">
                Tidak Yakin Paket Mana
                <br />
                Yang Cocok?
              </h2>
              <p className="mb-8 text-lg text-brand-dark/60">
                Ceritakan bisnis Anda, kami bantu rekomendasikan yang paling sesuai — gratis.
              </p>
              <a
                href={
                  WA_BASE +
                  encodeURIComponent(
                    "Halo Teman UMKM Kita, saya tertarik dengan layanan Web Development. Saya ingin konsultasi paket mana yang cocok untuk bisnis saya."
                  )
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-lg bg-accent px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-accent/20 transition-colors hover:bg-accent/90"
              >
                <MessageCircle size={20} />
                Konsultasi via WhatsApp
              </a>
              <p className="mt-4 text-sm text-brand-dark/60">Gratis, tanpa komitmen</p>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
