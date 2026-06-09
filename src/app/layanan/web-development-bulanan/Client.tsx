"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Check, X, ChevronRight, ChevronDown, Globe, Layout, MapPin,
  Search, BarChart2, Mail, FileText, Zap, MessageCircle, Star,
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
    price: "120.000",
    renewal: "50.000",
    tagline: "Untuk bisnis yang baru pertama kali mau hadir online.",
    features: [
      "1 Halaman (Sales Focus)",
      "Domain & Hosting (Tahun ke-1)",
      "Tombol WhatsApp Chat",
      "SSL & Mobile Friendly",
    ],
    cta: "Pilih Starter",
    wa: WA_BASE + encodeURIComponent("Halo, saya tertarik dengan paket Web Starter Bulanan."),
    featured: false,
  },
  {
    id: "pro",
    name: "Web Pro",
    price: "250.000",
    renewal: "75.000",
    badge: "Paling Populer",
    tagline: "Untuk bisnis yang butuh website lengkap dan mulai terlihat di Google.",
    features: [
      "Max. 5 Halaman",
      "Maps Embed + SEO Dasar",
      "Google Analytics",
    ],
    cta: "Pilih Pro",
    wa: WA_BASE + encodeURIComponent("Halo, saya tertarik dengan paket Web Pro Bulanan."),
    featured: true,
  },
  {
    id: "expert",
    name: "Web Expert",
    price: "375.000",
    renewal: "100.000",
    tagline: "Untuk bisnis yang serius membangun kehadiran digital skala penuh.",
    features: [
      "Max. 10 Halaman",
      "Email Profesional (Titan Mail)",
      "Blog System + Speed Optimization",
    ],
    cta: "Pilih Expert",
    wa: WA_BASE + encodeURIComponent("Halo, saya tertarik dengan paket Web Expert Bulanan."),
    featured: false,
  },
];

const tableRows = [
  { feature: "Jumlah Halaman", icon: Layout, starter: "1", pro: "5", expert: "10" },
  { feature: "Hosting Aktif", icon: Globe, starter: true, pro: true, expert: true },
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
    text: "Domain & Hosting termasuk tahun pertama. Pembayaran bulanan — bisa berhenti kapan saja.",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function CellValue({ val }: { val: boolean | string }) {
  if (typeof val === "string") {
    return <span className="font-semibold text-brand-dark text-sm">{val}</span>;
  }
  return val ? (
    <Check size={16} className="text-accent mx-auto" />
  ) : (
    <X size={14} className="text-brand-dark/20 mx-auto" />
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WebDevelopmentBulananPage() {
  const [tableOpen, setTableOpen] = useState(false);
  const [portfolioItems, setPortfolioItems] = useState<Array<{ name: string; category: string; image_url: string }>>([]);
  useEffect(() => {
    fetchPortfolios("web-development-bulanan").then((data) =>
      setPortfolioItems(data.map((item) => ({ name: item.title, category: item.category ?? "", image_url: item.image_url })))
    );
  }, []);
  const { ref: pricingRef } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: ctaRef, inView: ctaInView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <>
      <Navbar />
      <main className="pt-20">

        {/* ── Header ────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-12 pb-12">
          <div className="absolute inset-x-0 top-0 h-px bg-brand-dark/10" />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-brand-dark/40 font-medium mb-6">
              <Link href="/" className="hover:text-brand-dark transition-colors">Beranda</Link>
              <ChevronRight size={12} />
              <Link href="/layanan" className="hover:text-brand-dark transition-colors">Layanan</Link>
              <ChevronRight size={12} />
              <span className="text-brand-dark/70">Website Bulanan</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl"
              >
                <p className="text-accent font-bold text-sm uppercase tracking-wider mb-4">Web Development Bulanan</p>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-dark leading-tight mb-4">
                  Website Profesional Tanpa<br />
                  <span className="text-accent">Bayar Besar Di Awal.</span>
                </h1>
                <p className="text-brand-dark/60 text-lg">
                  Mulai dari Rp 120.000/bulan. Tidak ada biaya setup, tidak ada kontrak tahunan yang menguras modal.
                </p>
              </motion.div>

              {/* Tahunan / Bulanan toggle */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="flex flex-col items-start sm:items-end gap-1.5 self-start sm:self-auto flex-shrink-0"
              >
                <div className="flex items-center bg-white border border-brand-dark/8 rounded-lg p-1">
                  <Link
                    href="/layanan/web-development"
                    className="px-4 py-2 rounded-lg text-brand-dark/50 text-sm font-semibold hover:text-brand-dark transition-colors"
                  >
                    Tahunan
                  </Link>
                  <span className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-bold">
                    Bulanan
                  </span>
                </div>
                <p className="bg-accent/10 text-accent text-xs font-bold px-3 py-1 rounded-md">
                  Hemat hingga 20% dengan paket tahunan
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Portfolio ──────────────────────────────────────────────── */}
        {portfolioItems.length > 0 && (
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
              <div>
                <span className="text-accent font-bold text-sm uppercase tracking-wider block mb-3">
                  Portofolio
                </span>
                <h2 className="text-4xl font-extrabold text-brand-dark">
                  Website Yang Sudah<br />
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
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-6 items-start">
              {plans.map((plan, i) => (
                <motion.div
                  key={plan.id}
                  initial={false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className={`relative rounded-lg p-7 flex flex-col gap-5 ${
                    plan.featured
                      ? "bg-white border-2 border-accent shadow-xl shadow-accent/10 md:-mt-3 md:pb-10"
                      : "bg-white/80 backdrop-blur-sm border border-brand-dark/8 card-shadow"
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 right-5">
                      <span className="bg-accent text-white text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-1.5">
                        <Star size={11} fill="white" />
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-brand-dark/40 mb-1">
                      {plan.name}
                    </div>
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-xs text-brand-dark/50 font-medium">Rp</span>
                      <span className="text-3xl font-black text-brand-dark">{plan.price}</span>
                      <span className="text-brand-dark/40 text-sm">/bulan</span>
                    </div>
                    <p className="text-xs text-brand-dark/40 font-medium mb-3">
                      Perpanjangan: Rp {plan.renewal}/bulan
                    </p>
                    <p className="text-brand-dark/60 text-sm leading-relaxed border-t border-brand-dark/6 pt-3">
                      {plan.tagline}
                    </p>
                  </div>

                  <ul className="space-y-2.5 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <Check size={15} className="text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-brand-dark/70">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={plan.wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block text-center font-bold py-3.5 rounded-xl text-sm transition-all duration-200 ${
                      plan.featured
                        ? "bg-accent text-white hover:bg-accent/90 shadow-lg shadow-accent/20"
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
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-accent font-bold text-sm uppercase tracking-wider block mb-2">Perbandingan</span>
                <h2 className="text-3xl font-extrabold text-brand-dark">Fitur Lengkap Tiap Paket</h2>
              </div>
              <button
                onClick={() => setTableOpen(!tableOpen)}
                className="md:hidden flex items-center gap-2 text-sm font-semibold text-brand-dark/60 border border-brand-dark/15 px-4 py-2 rounded-lg"
              >
                {tableOpen ? "Tutup" : "Lihat tabel"}
                <ChevronDown size={14} className={`transition-transform ${tableOpen ? "rotate-180" : ""}`} />
              </button>
            </div>

            <div className={`${tableOpen ? "block" : "hidden"} md:block overflow-x-auto`}>
              <div className="bg-white border border-brand-dark/8 card-shadow rounded-lg overflow-hidden min-w-[600px]">
                <div className="grid grid-cols-4 border-b border-brand-dark/8 bg-brand-dark/2">
                  <div className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-brand-dark/40">Fitur</div>
                  {["Starter", "Pro", "Expert"].map((h) => (
                    <div
                      key={h}
                      className={`px-3 py-4 text-center text-sm font-extrabold ${
                        h === "Pro" ? "text-accent border-l-2 border-l-accent/30 bg-accent/8" : "text-brand-dark border-l border-brand-dark/6"
                      }`}
                    >
                      {h}
                    </div>
                  ))}
                </div>

                {tableRows.map((row, i) => (
                  <div
                    key={i}
                    className={`grid grid-cols-4 border-b border-brand-dark/5 last:border-0 ${
                      i % 2 === 0 ? "bg-transparent" : "bg-brand-dark/1"
                    }`}
                  >
                    <div className="px-5 py-3.5 text-sm text-brand-dark/70 font-medium flex items-center gap-2">
                      {row.icon && <row.icon size={13} className="text-brand-dark/30 flex-shrink-0" />}
                      {row.feature}
                    </div>
                    {(["starter", "pro", "expert"] as const).map((col) => (
                      <div
                        key={col}
                        className={`px-3 py-3.5 text-center flex items-center justify-center ${
                          col === "pro" ? "border-l-2 border-l-accent/30 bg-accent/8" : "border-l border-brand-dark/5"
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
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-4">Catatan Penting</div>
              <div className="max-w-lg">
                {notes.map((n, i) => {
                  const Icon = n.icon;
                  return (
                    <div key={i} className="flex gap-3">
                      <Icon size={15} className="text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-semibold text-amber-800 mb-0.5">{n.title}</div>
                        <div className="text-sm text-amber-700/80 leading-relaxed">{n.text}</div>
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
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-dark mb-4">
                Tidak Yakin Paket Mana<br />Yang Cocok?
              </h2>
              <p className="text-brand-dark/60 text-lg mb-8">
                Ceritakan bisnis Anda, kami bantu rekomendasikan yang paling sesuai — gratis.
              </p>
              <a
                href={WA_BASE + encodeURIComponent("Halo, saya ingin konsultasi pilihan paket website bulanan yang cocok untuk bisnis saya.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-accent text-white font-bold px-8 py-3.5 rounded-lg text-base hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20"
              >
                <MessageCircle size={20} />
                Konsultasi via WhatsApp
              </a>
              <p className="text-brand-dark/60 text-sm mt-4">Gratis, tanpa komitmen</p>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
