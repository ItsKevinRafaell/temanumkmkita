"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Check, X, ChevronRight, ChevronDown, Globe, Layout, MapPin,
  Search, BarChart2, Mail, FileText, Zap, MessageCircle, Star,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BlobDecoration from "@/components/ui/BlobDecoration";

// ─── Data ─────────────────────────────────────────────────────────────────────

const WA_BASE = "https://wa.me/6289501925395?text=";

const plans = [
  {
    id: "starter",
    name: "Web Starter",
    price: "1.000.000",
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

const portfolioItems = [
  { name: "Toko Batik Nusantara", category: "Fashion & Retail", plan: "Web Pro", accent: "bg-orange-50 border-orange-100" },
  { name: "Jasa Catering Keluarga", category: "Makanan & Minuman", plan: "Web Starter", accent: "bg-green-50 border-green-100" },
  { name: "Kontraktor & Renovasi", category: "Konstruksi", plan: "Web Expert", accent: "bg-blue-50 border-blue-100" },
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
    return <span className="font-semibold text-brand-dark text-sm">{val}</span>;
  }
  return val ? (
    <Check size={16} className="text-accent mx-auto" />
  ) : (
    <X size={14} className="text-brand-dark/20 mx-auto" />
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WebDevelopmentPage() {
  const [tableOpen, setTableOpen] = useState(false);
  const { ref: pricingRef, inView: pricingInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: portfolioRef, inView: portfolioInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: ctaRef, inView: ctaInView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <>
      <Navbar />
      <main className="pt-20">

        {/* ── Header ────────────────────────────────────────────────── */}
        <section className="relative pt-12 pb-10">
          <BlobDecoration position="top-right" size={340} opacity={0.16} shape={1} />

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-brand-dark/40 font-medium mb-6">
              <Link href="/" className="hover:text-brand-dark transition-colors">Beranda</Link>
              <ChevronRight size={12} />
              <Link href="/layanan/web-development" className="hover:text-brand-dark transition-colors">Layanan</Link>
              <ChevronRight size={12} />
              <span className="text-brand-dark/70">Website</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl"
              >
                <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 px-4 py-1.5 rounded-full mb-5">
                  <Globe size={13} className="text-accent" />
                  <span className="text-sm font-semibold text-brand-dark">Web Development</span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-dark leading-tight mb-4">
                  Website profesional yang<br />
                  <span className="text-accent">bekerja untuk bisnis Anda.</span>
                </h1>
                <p className="text-brand-dark/60 text-lg">
                  Bayar sekali, nikmati setahun penuh. Domain, hosting, dan setup sudah termasuk.
                </p>
              </motion.div>

              {/* Tahunan / Bulanan toggle */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="flex items-center bg-white/80 backdrop-blur-sm border border-brand-dark/8 rounded-xl p-1 self-start sm:self-auto flex-shrink-0"
              >
                <span className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-bold">
                  Tahunan
                </span>
                <Link
                  href="/produk/web-development-bulanan"
                  className="px-4 py-2 rounded-lg text-brand-dark/50 text-sm font-semibold hover:text-brand-dark transition-colors"
                >
                  Bulanan
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Portfolio Placeholder ──────────────────────────────────── */}
        <section ref={portfolioRef} className="py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={portfolioInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <span className="text-accent font-bold text-sm uppercase tracking-wider block mb-3">
                Portofolio
              </span>
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <h2 className="text-4xl font-extrabold text-brand-dark">
                  Website yang sudah<br />
                  <span className="text-accent">kami bangun</span>
                </h2>
                <span className="inline-flex items-center gap-2 bg-brand-dark/5 border border-brand-dark/8 px-4 py-2 rounded-full text-xs text-brand-dark/50 font-semibold flex-shrink-0">
                  Portofolio lengkap segera hadir
                </span>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {portfolioItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  animate={portfolioInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="bg-white/80 backdrop-blur-sm border border-brand-dark/8 card-shadow rounded-2xl overflow-hidden group"
                >
                  {/* Image placeholder */}
                  <div className={`h-44 ${item.accent} border-b border-brand-dark/6 flex items-center justify-center relative`}>
                    <Globe size={36} className="text-brand-dark/15" />
                    <div className="absolute top-3 right-3">
                      <span className="bg-white/80 backdrop-blur-sm text-brand-dark/50 text-xs font-semibold px-2.5 py-1 rounded-full border border-brand-dark/8">
                        {item.plan}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="text-xs text-accent font-bold uppercase tracking-wider mb-1">{item.category}</div>
                    <div className="font-bold text-brand-dark">{item.name}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing Cards ─────────────────────────────────────────── */}
        <section ref={pricingRef} className="py-10 pb-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-6 items-start">
              {plans.map((plan, i) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={pricingInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className={`relative rounded-3xl p-7 flex flex-col gap-5 ${
                    plan.featured
                      ? "bg-white border-2 border-accent shadow-xl shadow-accent/10 md:-mt-3 md:pb-10"
                      : "bg-white/80 backdrop-blur-sm border border-brand-dark/8 card-shadow"
                  }`}
                >
                  {/* Popular badge */}
                  {plan.badge && (
                    <div className="absolute -top-3 right-5">
                      <span className="bg-accent text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                        <Star size={11} fill="white" />
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  {/* Plan name + tagline */}
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-brand-dark/40 mb-1">
                      {plan.name}
                    </div>
                    <div className="flex items-baseline gap-1 mb-3">
                      <span className="text-xs text-brand-dark/50 font-medium">Rp</span>
                      <span className="text-3xl font-black text-brand-dark">{plan.price}</span>
                      <span className="text-brand-dark/40 text-sm">/tahun</span>
                    </div>
                    <p className="text-brand-dark/60 text-sm leading-relaxed border-t border-brand-dark/6 pt-3">
                      {plan.tagline}
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2.5 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <Check size={15} className="text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-brand-dark/70">{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
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
                <h2 className="text-3xl font-extrabold text-brand-dark">Fitur lengkap tiap paket</h2>
              </div>
              {/* Mobile toggle */}
              <button
                onClick={() => setTableOpen(!tableOpen)}
                className="md:hidden flex items-center gap-2 text-sm font-semibold text-brand-dark/60 border border-brand-dark/15 px-4 py-2 rounded-xl"
              >
                {tableOpen ? "Tutup" : "Lihat tabel"}
                <ChevronDown size={14} className={`transition-transform ${tableOpen ? "rotate-180" : ""}`} />
              </button>
            </div>

            <div className={`${tableOpen ? "block" : "hidden"} md:block`}>
              <div className="bg-white/80 backdrop-blur-sm border border-brand-dark/8 card-shadow rounded-2xl overflow-hidden">
                {/* Header row */}
                <div className="grid grid-cols-4 border-b border-brand-dark/8 bg-brand-dark/2">
                  <div className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-brand-dark/40">Fitur</div>
                  {["Starter", "Pro", "Expert"].map((h) => (
                    <div
                      key={h}
                      className={`px-3 py-4 text-center text-sm font-extrabold ${
                        h === "Pro" ? "text-accent border-l-2 border-l-accent/30" : "text-brand-dark border-l border-brand-dark/6"
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
                    <div className="px-5 py-3.5 text-sm text-brand-dark/70 font-medium flex items-center gap-2">
                      {row.icon && <row.icon size={13} className="text-brand-dark/30 flex-shrink-0" />}
                      {row.feature}
                    </div>
                    {(["starter", "pro", "expert"] as const).map((col) => (
                      <div
                        key={col}
                        className={`px-3 py-3.5 text-center flex items-center justify-center ${
                          col === "pro" ? "border-l-2 border-l-accent/30 bg-accent/3" : "border-l border-brand-dark/5"
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
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-4">Catatan Penting</div>
              <div className="grid sm:grid-cols-3 gap-5">
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
                Tidak yakin paket mana<br />yang cocok?
              </h2>
              <p className="text-brand-dark/60 text-lg mb-8">
                Ceritakan bisnis Anda, kami bantu rekomendasikan yang paling sesuai — gratis.
              </p>
              <a
                href={WA_BASE + encodeURIComponent("Halo, saya ingin konsultasi pilihan paket website yang cocok untuk bisnis saya.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-accent text-white font-bold px-10 py-4 rounded-full text-lg hover:bg-accent/90 hover:scale-105 transition-all duration-200 shadow-xl shadow-accent/30"
              >
                <MessageCircle size={20} />
                Konsultasi via WhatsApp
              </a>
              <p className="text-brand-dark/35 text-sm mt-4">Gratis, tanpa komitmen</p>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
