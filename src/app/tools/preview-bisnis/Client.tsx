"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Store, Tag, MapPin, AlertCircle, MessageCircle, ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GbpPreview from "./GbpPreview";
import SeoSimulation from "./SeoSimulation";

const LOADING_STEPS = [
  "Menyiapkan tampilan bisnismu di Google...",
  "Menghitung potensi pertumbuhan ranking...",
  "Menyusun simulasi awareness merek...",
  "Merapikan hasil akhir...",
];

export default function PreviewBisnisClient() {
  const [namaUsaha, setNamaUsaha] = useState("");
  const [jenisUsaha, setJenisUsaha] = useState("");
  const [kota, setKota] = useState("");

  const [loading, setLoading] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [data, setData] = useState<{ nama: string; jenis: string; kota: string } | null>(null);

  const [wa, setWa] = useState("");
  const [email, setEmail] = useState("");
  const [leadSent, setLeadSent] = useState(false);
  const [leadError, setLeadError] = useState<string | null>(null);
  const [leadLoading, setLeadLoading] = useState(false);

  const resultRef = useRef<HTMLDivElement>(null);

  const canSubmit = namaUsaha.trim() && jenisUsaha.trim() && kota.trim() && !loading;

  function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setShowResult(false);
    setLeadSent(false);
    setStepIdx(0);
    const iv = setInterval(() => setStepIdx((i) => (i + 1) % LOADING_STEPS.length), 700);
    // Simulasi proses ~2.4 detik biar terasa "sistem bekerja" (skeleton).
    setTimeout(() => {
      clearInterval(iv);
      setData({ nama: namaUsaha.trim(), jenis: jenisUsaha.trim(), kota: kota.trim() });
      setLoading(false);
      setShowResult(true);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }, 2400);
  }

  async function handleLead(e: React.FormEvent) {
    e.preventDefault();
    if (!wa.trim() && !email.trim()) {
      setLeadError("Isi WhatsApp atau email dulu ya.");
      return;
    }
    setLeadLoading(true);
    setLeadError(null);
    try {
      const res = await fetch(`/api/tools/preview-lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama_usaha: data?.nama || namaUsaha.trim(),
          jenis_usaha: data?.jenis || jenisUsaha.trim(),
          kota: data?.kota || kota.trim(),
          wa: wa.trim() || undefined,
          email: email.trim() || undefined,
        }),
      });
      if (res.status === 429) { setLeadError("Kamu sudah kirim beberapa kali. Coba lagi nanti ya."); return; }
      if (!res.ok) { setLeadError("Gagal mengirim. Coba lagi sebentar lagi."); return; }
      setLeadSent(true);
    } catch {
      setLeadError("Koneksi bermasalah. Coba lagi ya.");
    } finally {
      setLeadLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="bg-canvas">
        {/* Hero */}
        <section className="relative overflow-hidden pt-32 pb-10">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-bold text-accent">
              <Sparkles size={15} /> Tool Gratis untuk UMKM
            </span>
            <h1 className="mt-5 text-3xl font-extrabold leading-tight text-brand-dark sm:text-4xl lg:text-5xl">
              Lihat Simulasi Bisnismu Naik ke Halaman 1 Google
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-brand-dark/60">
              Isi 3 kolom di bawah. Lihat simulasi tampilan bisnismu di Google Maps dan
              prediksi pertumbuhannya kalau dioptimasi SEO. <strong className="text-brand-dark/80">Gratis.</strong>
            </p>
          </div>
        </section>

        {/* Form */}
        <section className="pb-8">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <form onSubmit={handleGenerate} className="rounded-2xl border border-brand-dark/10 bg-white p-6 shadow-card sm:p-8">
              <div className="space-y-5">
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-sm font-bold text-brand-dark">
                    <Store size={15} className="text-accent" /> Nama Usaha
                  </label>
                  <input type="text" value={namaUsaha} onChange={(e) => setNamaUsaha(e.target.value)}
                    placeholder="Contoh: Bakso Pak Kumis" maxLength={100}
                    className="w-full rounded-lg border border-brand-dark/15 bg-canvas px-4 py-3 text-brand-dark outline-none transition-colors focus:border-accent" />
                </div>
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-sm font-bold text-brand-dark">
                    <Tag size={15} className="text-accent" /> Jenis Usaha
                  </label>
                  <input type="text" value={jenisUsaha} onChange={(e) => setJenisUsaha(e.target.value)}
                    placeholder="Contoh: Warung bakso, Kedai kopi, Salon" maxLength={100}
                    className="w-full rounded-lg border border-brand-dark/15 bg-canvas px-4 py-3 text-brand-dark outline-none transition-colors focus:border-accent" />
                </div>
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-sm font-bold text-brand-dark">
                    <MapPin size={15} className="text-accent" /> Kota
                  </label>
                  <input type="text" value={kota} onChange={(e) => setKota(e.target.value)}
                    placeholder="Contoh: Bekasi" maxLength={80}
                    className="w-full rounded-lg border border-brand-dark/15 bg-canvas px-4 py-3 text-brand-dark outline-none transition-colors focus:border-accent" />
                </div>
              </div>

              <button type="submit" disabled={!canSubmit}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-base font-bold text-white transition-all hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50">
                {loading ? (
                  <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> Sedang membuat...</>
                ) : (
                  <><Sparkles size={18} /> Lihat Simulasi Bisnisku</>
                )}
              </button>

              <AnimatePresence>
                {loading && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-4 overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.p key={stepIdx} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }}
                        className="text-center text-sm font-medium text-brand-dark/60">
                        {LOADING_STEPS[stepIdx]}
                      </motion.p>
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </section>

        {/* Hasil */}
        {(loading || showResult) && (
          <section ref={resultRef} className="scroll-mt-24 pb-16">
            <div className="mx-auto max-w-2xl space-y-6 px-4 sm:px-6">
              <div>
                <h2 className="mb-1 text-center text-sm font-bold uppercase tracking-wider text-accent">Tampilan di Google</h2>
                <GbpPreview namaUsaha={data?.nama || namaUsaha} jenisUsaha={data?.jenis || jenisUsaha} kota={data?.kota || kota} loading={loading} />
              </div>

              {showResult && data && (
                <>
                  <div>
                    <h2 className="mb-3 text-center text-sm font-bold uppercase tracking-wider text-accent">Proyeksi Pertumbuhan</h2>
                    <SeoSimulation namaUsaha={data.nama} active={showResult} />
                  </div>

                  {/* CTA lead */}
                  <div className="rounded-2xl border border-accent/25 bg-white p-6 shadow-card">
                    {leadSent ? (
                      <div className="text-center">
                        <span className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                          <Check size={24} />
                        </span>
                        <h3 className="text-lg font-extrabold text-brand-dark">Sip, data kamu tersimpan!</h3>
                        <p className="mt-1 text-brand-dark/60">Tim Teman UMKM Kita bakal hubungi kamu buat bantu wujudkan ini jadi nyata.</p>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-lg font-extrabold text-brand-dark">Mau bisnismu beneran naik seperti simulasi ini?</h3>
                        <p className="mt-2 text-sm text-brand-dark/60">
                          Tinggalkan kontak, tim kami bantu wujudkan {data.nama} muncul di halaman 1 Google. Gratis konsultasi.
                        </p>
                        <form onSubmit={handleLead} className="mt-4 space-y-3">
                          <div className="flex flex-col gap-3 sm:flex-row">
                            <input type="tel" value={wa} onChange={(e) => setWa(e.target.value)} placeholder="Nomor WhatsApp"
                              className="w-full rounded-lg border border-brand-dark/15 bg-canvas px-4 py-3 text-sm text-brand-dark outline-none focus:border-accent" />
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email (opsional)"
                              className="w-full rounded-lg border border-brand-dark/15 bg-canvas px-4 py-3 text-sm text-brand-dark outline-none focus:border-accent" />
                          </div>
                          {leadError && (
                            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                              <AlertCircle size={16} className="mt-0.5 shrink-0" /> {leadError}
                            </div>
                          )}
                          <button type="submit" disabled={leadLoading}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-base font-bold text-white transition-all hover:bg-accent/90 disabled:opacity-50">
                            {leadLoading ? "Mengirim..." : (<><MessageCircle size={18} /> Minta Bantuan Tim Kami</>)}
                          </button>
                        </form>
                        <Link href="/layanan/seo-google-maps" className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-brand-dark/60 transition-colors hover:text-accent">
                          Lihat Layanan SEO Google Maps <ArrowRight size={15} />
                        </Link>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
