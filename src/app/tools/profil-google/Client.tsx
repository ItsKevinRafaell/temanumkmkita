"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Copy,
  Check,
  Store,
  MapPin,
  Tag,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const WA_LINK =
  "https://wa.me/6289501925395?text=" +
  encodeURIComponent("Halo, saya sudah pakai Generator Profil Google. Mau bantuan supaya bisnis saya muncul di halaman 1 Google Maps.");

interface Result {
  deskripsi: string;
  keywords: string[];
  template_review_baik: string;
  template_review_buruk: string;
}

const LOADING_STEPS = [
  "Menganalisis bisnismu...",
  "Menyusun deskripsi yang menjual...",
  "Meracik keyword pencarian lokal...",
  "Menyiapkan template balasan review...",
  "Merapikan hasil akhir...",
];

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }}
      className="inline-flex items-center gap-1.5 rounded-md border border-brand-dark/15 bg-white px-3 py-1.5 text-sm font-semibold text-brand-dark/70 transition-colors hover:border-accent hover:text-accent"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? "Tersalin" : label ?? "Salin"}
    </button>
  );
}

export default function ProfilGoogleClient() {
  const [namaUsaha, setNamaUsaha] = useState("");
  const [jenisUsaha, setJenisUsaha] = useState("");
  const [kota, setKota] = useState("");
  const [keunikan, setKeunikan] = useState("");

  const [loading, setLoading] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reviewTab, setReviewTab] = useState<"baik" | "buruk">("baik");

  const resultRef = useRef<HTMLDivElement>(null);

  // Animasi langkah loading (tool AI ~25 detik).
  useEffect(() => {
    if (!loading) return;
    setStepIdx(0);
    const interval = setInterval(() => {
      setStepIdx((i) => (i + 1) % LOADING_STEPS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  const canSubmit = namaUsaha.trim() && jenisUsaha.trim() && kota.trim() && !loading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/tools/generate-profil", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama_usaha: namaUsaha.trim(),
          jenis_usaha: jenisUsaha.trim(),
          kota: kota.trim(),
          keunikan: keunikan.trim() || undefined,
        }),
      });

      if (res.status === 429) {
        setError("Kamu sudah pakai beberapa kali. Coba lagi dalam 30 menit ya.");
        return;
      }
      if (!res.ok) {
        setError("Gagal membuat profil. Coba lagi sebentar lagi.");
        return;
      }
      const data = (await res.json()) as Result;
      setResult(data);
    } catch {
      setError("Koneksi bermasalah. Coba lagi ya.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="bg-canvas">
        {/* Hero */}
        <section className="relative overflow-hidden pt-32 pb-12">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-bold text-accent">
              <Sparkles size={15} /> Tool Gratis untuk UMKM
            </span>
            <h1 className="mt-5 text-3xl font-extrabold leading-tight text-brand-dark sm:text-4xl lg:text-5xl">
              Bikin Profil Google Bisnismu Terlihat Profesional
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-brand-dark/60">
              Isi 3 kolom di bawah. Dalam 30 detik kamu dapat deskripsi, keyword, dan template
              balasan review yang <strong className="text-brand-dark/80">tinggal tempel</strong> ke
              Google Business Profile-mu. Gratis.
            </p>
          </div>
        </section>

        {/* Form */}
        <section className="pb-8">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-brand-dark/10 bg-white p-6 shadow-card sm:p-8"
            >
              <div className="space-y-5">
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-sm font-bold text-brand-dark">
                    <Store size={15} className="text-accent" /> Nama Usaha
                  </label>
                  <input
                    type="text"
                    value={namaUsaha}
                    onChange={(e) => setNamaUsaha(e.target.value)}
                    placeholder="Contoh: Bakso Pak Kumis"
                    maxLength={100}
                    className="w-full rounded-lg border border-brand-dark/15 bg-canvas px-4 py-3 text-brand-dark outline-none transition-colors focus:border-accent"
                  />
                </div>
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-sm font-bold text-brand-dark">
                    <Tag size={15} className="text-accent" /> Jenis Usaha
                  </label>
                  <input
                    type="text"
                    value={jenisUsaha}
                    onChange={(e) => setJenisUsaha(e.target.value)}
                    placeholder="Contoh: Warung bakso, Kedai kopi, Salon"
                    maxLength={100}
                    className="w-full rounded-lg border border-brand-dark/15 bg-canvas px-4 py-3 text-brand-dark outline-none transition-colors focus:border-accent"
                  />
                </div>
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-sm font-bold text-brand-dark">
                    <MapPin size={15} className="text-accent" /> Kota
                  </label>
                  <input
                    type="text"
                    value={kota}
                    onChange={(e) => setKota(e.target.value)}
                    placeholder="Contoh: Bekasi"
                    maxLength={80}
                    className="w-full rounded-lg border border-brand-dark/15 bg-canvas px-4 py-3 text-brand-dark outline-none transition-colors focus:border-accent"
                  />
                </div>
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-sm font-bold text-brand-dark">
                    <Sparkles size={15} className="text-accent" /> Keunikan{" "}
                    <span className="font-normal text-brand-dark/40">(opsional, tapi bikin hasil lebih bagus)</span>
                  </label>
                  <textarea
                    value={keunikan}
                    onChange={(e) => setKeunikan(e.target.value)}
                    placeholder="Contoh: bakso urat jumbo isi keju, buka sampai malam, cocok buat keluarga"
                    maxLength={300}
                    rows={2}
                    className="w-full resize-none rounded-lg border border-brand-dark/15 bg-canvas px-4 py-3 text-brand-dark outline-none transition-colors focus:border-accent"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!canSubmit}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-base font-bold text-white transition-all hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Sedang membuat...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} /> Buat Profil Saya
                  </>
                )}
              </button>

              {/* Loading step animation */}
              <AnimatePresence>
                {loading && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 overflow-hidden"
                  >
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={stepIdx}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.3 }}
                        className="text-center text-sm font-medium text-brand-dark/60"
                      >
                        {LOADING_STEPS[stepIdx]}
                      </motion.p>
                    </AnimatePresence>
                    <p className="mt-1 text-center text-xs text-brand-dark/35">
                      Butuh sekitar 20-30 detik. Ditunggu ya.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {error && (
                <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  {error}
                </div>
              )}
            </form>
          </div>
        </section>

        {/* Result */}
        {result && (
          <section ref={resultRef} className="scroll-mt-24 pb-16">
            <div className="mx-auto max-w-2xl space-y-5 px-4 sm:px-6">
              <div className="text-center">
                <h2 className="text-2xl font-extrabold text-brand-dark">Profil Google Kamu Siap 🎉</h2>
                <p className="mt-1 text-brand-dark/55">Tinggal salin dan tempel ke Google Business Profile-mu.</p>
              </div>

              {/* Deskripsi */}
              <div className="rounded-xl border border-brand-dark/10 bg-white p-5 shadow-card">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 font-bold text-brand-dark">
                    <MessageSquare size={16} className="text-accent" /> Deskripsi Bisnis
                  </h3>
                  <CopyButton text={result.deskripsi} />
                </div>
                <p className="whitespace-pre-line leading-relaxed text-brand-dark/75">{result.deskripsi}</p>
              </div>

              {/* Keywords */}
              <div className="rounded-xl border border-brand-dark/10 bg-white p-5 shadow-card">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 font-bold text-brand-dark">
                    <Tag size={16} className="text-accent" /> Keyword / Kategori
                  </h3>
                  <CopyButton text={result.keywords.join(", ")} label="Salin semua" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="rounded-full border border-accent/25 bg-accent/8 px-3 py-1 text-sm text-brand-dark/75"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Template Review */}
              <div className="rounded-xl border border-brand-dark/10 bg-white p-5 shadow-card">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 font-bold text-brand-dark">
                    <MessageSquare size={16} className="text-accent" /> Template Balasan Review
                  </h3>
                  <CopyButton
                    text={reviewTab === "baik" ? result.template_review_baik : result.template_review_buruk}
                  />
                </div>
                <div className="mb-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setReviewTab("baik")}
                    className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold transition-colors ${
                      reviewTab === "baik"
                        ? "bg-accent text-white"
                        : "bg-canvas text-brand-dark/60 hover:text-brand-dark"
                    }`}
                  >
                    <ThumbsUp size={14} /> Review Positif
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewTab("buruk")}
                    className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold transition-colors ${
                      reviewTab === "buruk"
                        ? "bg-accent text-white"
                        : "bg-canvas text-brand-dark/60 hover:text-brand-dark"
                    }`}
                  >
                    <ThumbsDown size={14} /> Review Negatif
                  </button>
                </div>
                <p className="whitespace-pre-line leading-relaxed text-brand-dark/75">
                  {reviewTab === "baik" ? result.template_review_baik : result.template_review_buruk}
                </p>
              </div>

              {/* CTA lembut ke jasa */}
              <div className="rounded-xl border border-accent/25 bg-white p-6 shadow-card">
                <h3 className="text-lg font-extrabold text-brand-dark">
                  Profil sudah bagus. Tapi apakah bisnismu muncul saat orang cari di Google?
                </h3>
                <p className="mt-2 text-brand-dark/60">
                  Deskripsi keren saja belum cukup. Biar toko-mu muncul di halaman 1 Google Maps saat
                  calon pelanggan mencari, butuh optimasi yang tepat. Kami bisa bantu.
                </p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={WA_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-accent/90"
                  >
                    <MessageCircle size={16} /> Konsultasi Gratis via WhatsApp
                  </a>
                  <Link
                    href="/layanan/seo-google-maps"
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-brand-dark/15 px-5 py-3 text-sm font-bold text-brand-dark/70 transition-colors hover:border-accent hover:text-accent"
                  >
                    Lihat Layanan SEO Google Maps <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
