"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { STEPS, TOTAL_STEPS } from "./steps";
import { INITIAL_STATE, type OnboardingState } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://api.temanumkmkita.com";

export default function MulaiClient() {
  const [stepIdx, setStepIdx] = useState(0); // 0-based
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back
  const [state, setState] = useState<OnboardingState>(INITIAL_STATE);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const current = STEPS[stepIdx];
  const StepComponent = current.Component;
  const canProceed = current.isValid(state);
  const isLast = stepIdx === TOTAL_STEPS - 1;

  function update(patch: Partial<OnboardingState>) {
    setState((prev) => ({ ...prev, ...patch }));
  }

  // Kirim lead ke ERP lewat pola yang sama dengan /kontak:
  // POST ${API_BASE}/api/contact-form -> backend forward ke ERP /api/leads/external.
  // Jawaban onboarding (industri, kota, template) dibungkus ke message + service
  // biar lead kualified.
  async function submitLead() {
    setSubmitting(true);
    setError(null);

    const jenis = state.jenisUsaha.trim() || state.industrySlug.trim() || "-";
    const detail = [
      `Usaha: ${state.namaUsaha.trim() || "-"}`,
      `Jenis usaha: ${jenis}`,
      `Kota: ${state.kota.trim() || "-"}`,
      `Template dipilih: ${state.templateSlug.trim() || jenis}`,
    ].join("\n");
    const pesan = state.pesan.trim()
      ? `${state.pesan.trim()}\n\n— Dari onboarding /mulai —\n${detail}`
      : `Lead dari onboarding /mulai.\n${detail}`;

    try {
      const res = await fetch(`${API_BASE}/api/contact-form`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: state.nama,
          phone: state.wa,
          email: state.email || null,
          // Backend memvalidasi service ke enum layanan (VALID_SERVICES).
          // Onboarding = fokus bikin web -> "web_development". Detail industri/kota/
          // template dibawa di message biar lead tetap kualified.
          service: "web_development",
          message: pesan,
        }),
      });
      if (!res.ok) throw new Error("Gagal mengirim");
      setSubmitted(true);
    } catch {
      setError(
        "Yah, gagal ngirim. Cek koneksimu lalu coba lagi ya — atau hubungi kami via WhatsApp."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function goNext() {
    if (!canProceed || submitting) return;
    if (isLast) {
      void submitLead();
      return;
    }
    setDirection(1);
    setStepIdx((i) => Math.min(i + 1, TOTAL_STEPS - 1));
  }

  function goBack() {
    setDirection(-1);
    setStepIdx((i) => Math.max(i - 1, 0));
  }

  const progress = ((stepIdx + 1) / TOTAL_STEPS) * 100;

  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col bg-canvas pb-10 pt-28">
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 sm:px-6 lg:px-8">
          {submitted ? (
            <SuccessState name={state.nama} />
          ) : (
            <>
              {/* Progress */}
              <div className="mb-8">
                <div className="mb-2 flex items-center justify-between text-sm font-bold text-brand-dark/60">
                  <span>
                    Langkah {stepIdx + 1} dari {TOTAL_STEPS}
                  </span>
                  <span>{current.title}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-brand-dark/10">
                  <motion.div
                    className="h-full rounded-full bg-accent"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Step card.
                  ROOT-CAUSE FIX (tombol Lanjut suka ga nendang):
                  AnimatePresence mode="wait" menahan step lama tetap mounted saat
                  animasi keluar (~250ms). Dulu step lama itu masih normal-flow &
                  bisa nangkep pointer -> tap kedua/tap cepat "ketelan" layer transisi,
                  jadi kelihatan seolah butuh pointer-event sequence penuh.
                  Sekarang: pakai popLayout + exiting layer diberi pointer-events-none
                  via style, jadi cuma step aktif yang interaktif. */}
              <div className="relative min-h-[420px] overflow-hidden rounded-2xl border border-brand-dark/10 bg-canvas p-6 shadow-card sm:p-8 lg:p-10">
                <AnimatePresence mode="popLayout" custom={direction} initial={false}>
                  <motion.div
                    key={current.id}
                    custom={direction}
                    initial={{ opacity: 0, x: direction * 32 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction * -32, pointerEvents: "none" }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <StepComponent state={state} update={update} />
                  </motion.div>
                </AnimatePresence>
              </div>

              {error && (
                <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {error}
                </p>
              )}

              {/* Nav */}
              <div className="mt-6 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={stepIdx === 0 || submitting}
                  className="inline-flex items-center gap-2 rounded-lg border border-brand-dark/15 px-5 py-3 font-bold text-brand-dark transition-colors hover:border-accent/40 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowLeft size={18} /> Kembali
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  disabled={!canProceed || submitting}
                  className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-bold text-white transition-all hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Mengirim...
                    </>
                  ) : isLast ? (
                    <>
                      <Check size={18} /> Kirim &amp; Mulai
                    </>
                  ) : (
                    <>
                      Lanjut <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function SuccessState({ name }: { name: string }) {
  return (
    <div className="rounded-2xl border border-accent/25 bg-white p-8 text-center shadow-card">
      <span className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
        <Check size={28} />
      </span>
      <h2 className="text-2xl font-extrabold text-brand-dark">
        Sip, makasih{name ? `, ${name}` : ""}! 🎉
      </h2>
      <p className="mt-2 text-brand-dark/60">
        Datamu udah masuk ke tim Teman UMKM Kita. Kami bakal hubungi kamu via
        WhatsApp buat ngobrol santai soal usahamu — gratis, tanpa paksaan. Sambil
        nunggu, kamu bisa ngopi dulu. ☕
      </p>
      <a
        href="https://wa.me/6289501925395"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 font-bold text-white transition-colors hover:bg-accent/90"
      >
        Chat langsung sekarang
      </a>
    </div>
  );
}
