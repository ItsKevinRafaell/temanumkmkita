"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { MessageCircle, CreditCard, Zap, Rocket, type LucideIcon } from "lucide-react";

const steps: {
  number: string;
  title: string;
  desc: string;
  detail: string;
  IconComponent: LucideIcon;
}[] = [
  {
    number: "01",
    title: "Konsultasi",
    desc: "Ceritakan kebutuhan bisnismu. Gratis, tanpa syarat.",
    detail: "Kami dengarkan dulu. Tidak ada tekanan, tidak ada biaya. Cukup ceritakan bisnis kamu dan apa yang ingin dicapai — kami bantu analisis dan rekomendasikan solusi terbaik.",
    IconComponent: MessageCircle,
  },
  {
    number: "02",
    title: "DP & Mulai",
    desc: "Setuju dengan paket? Bayar DP, kami langsung mulai.",
    detail: "Setelah sepakat dengan paket dan timeline, kamu cukup bayar DP. Tidak ada biaya tersembunyi. Kontrak jelas, scope jelas, ekspektasi jelas.",
    IconComponent: CreditCard,
  },
  {
    number: "03",
    title: "Eksekusi",
    desc: "Tim kami kerjakan proyekmu dengan update berkala.",
    detail: "Kamu bisa pantau progress kapan saja. Kami kirimkan update rutin, terbuka terhadap masukan, dan siap melakukan penyesuaian selama proses berlangsung.",
    IconComponent: Zap,
  },
  {
    number: "04",
    title: "Go-Live",
    desc: "Hasil final dikirim, revisi gratis, bisnis hadir online.",
    detail: "Setelah kamu approve hasil akhir, kami bantu proses go-live. Revisi gratis disertakan. Tidak selesai sebelum kamu puas.",
    IconComponent: Rocket,
  },
];

function MobileSteps() {
  return (
    <div className="lg:hidden py-24 bg-transparent">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="text-accent font-bold text-sm uppercase tracking-wider">Proses Kerja</span>
          <h2 className="text-4xl font-extrabold text-brand-dark mt-3">
            Sederhana, transparan,<br />
            <span className="text-accent">tanpa ribet</span>
          </h2>
        </div>
        <div className="space-y-8">
          {steps.map((step, i) => {
            const { IconComponent } = step;
            return (
              <div key={i} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <IconComponent size={20} className="text-accent" />
                  </div>
                  {i < steps.length - 1 && <div className="w-px flex-1 mt-3 bg-accent/20" />}
                </div>
                <div className="pb-8">
                  <span className="text-accent text-xs font-bold uppercase tracking-widest">{step.number}</span>
                  <h3 className="font-bold text-brand-dark text-xl mt-1 mb-2">{step.title}</h3>
                  <p className="text-brand-dark/60 text-sm leading-relaxed">{step.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StickySteps() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(Math.floor(v * steps.length), steps.length - 1);
    setActiveStep(idx);
  });

  const step = steps[activeStep];
  const { IconComponent } = step;

  return (
    <div
      ref={sectionRef}
      className="hidden lg:block"
      style={{ height: `${steps.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="max-w-6xl mx-auto w-full px-8">
          {/* Header */}
          <div className="mb-12 text-center">
            <span className="text-accent font-bold text-sm uppercase tracking-wider">Proses Kerja</span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-brand-dark mt-3">
              Sederhana, transparan,{" "}
              <span className="text-accent">tanpa ribet</span>
            </h2>
          </div>

          <div className="flex gap-16 items-start">
            {/* Left: step list */}
            <div className="w-2/5 space-y-3">
              {steps.map((s, i) => (
                <motion.button
                  key={i}
                  animate={{
                    opacity: i === activeStep ? 1 : 0.35,
                    x: i === activeStep ? 8 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="w-full text-left flex items-center gap-4 p-4 rounded-xl transition-colors"
                  style={{ background: i === activeStep ? "rgba(245,167,0,0.08)" : "transparent" }}
                  onClick={() => setActiveStep(i)}
                >
                  <span className={`text-2xl font-black tabular-nums ${i === activeStep ? "text-accent" : "text-brand-dark/30"}`}>
                    {s.number}
                  </span>
                  <div>
                    <div className="font-bold text-brand-dark text-lg">{s.title}</div>
                    <div className="text-brand-dark/50 text-sm">{s.desc}</div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Right: step detail */}
            <div className="w-3/5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 border border-brand-dark/8 card-shadow"
                >
                  <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                    <IconComponent size={30} className="text-accent" />
                  </div>
                  <span className="text-accent font-bold text-sm uppercase tracking-widest">Langkah {step.number}</span>
                  <h3 className="text-3xl font-extrabold text-brand-dark mt-2 mb-4">{step.title}</h3>
                  <p className="text-brand-dark/60 text-lg leading-relaxed">{step.detail}</p>

                  {/* Progress bar */}
                  <div className="mt-8 flex gap-2">
                    {steps.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 rounded-full transition-all duration-500 ${
                          i === activeStep ? "bg-accent flex-1" : "bg-brand-dark/10 w-6"
                        }`}
                      />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CaraKerjaSection() {
  return (
    <>
      <MobileSteps />
      <StickySteps />
    </>
  );
}
