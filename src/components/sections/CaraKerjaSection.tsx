"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
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

function DesktopSteps() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const activeRef = useRef(0);
  const lastScrollMs = useRef(0);
  const isSnappingRef = useRef(false);

  function goTo(n: number) {
    const next = Math.max(0, Math.min(steps.length - 1, n));
    activeRef.current = next;
    setActiveStep(next);
  }

  useEffect(() => {
    function onWheel(e: WheelEvent) {
      const el = sectionRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;

      // Only intercept when section covers ≥50% of viewport
      const visible = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
      if (visible < vh * 0.5) return;

      const cur = activeRef.current;
      const goingDown = e.deltaY > 0;
      const goingUp = e.deltaY < 0;

      // Exit at boundaries — allow natural scroll immediately, no rect.top gating
      if (goingDown && cur >= steps.length - 1) return;
      if (goingUp && cur <= 0) return;

      // Section is active and mid-sequence — intercept
      e.preventDefault();

      // Snap to top first if section isn't precisely positioned
      if (Math.abs(rect.top) > 8 && !isSnappingRef.current) {
        isSnappingRef.current = true;
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        const direction = goingDown ? 1 : -1;
        setTimeout(() => {
          isSnappingRef.current = false;
          const after = activeRef.current;
          const target = after + direction;
          if (target >= 0 && target < steps.length) {
            lastScrollMs.current = Date.now();
            goTo(target);
          }
        }, 500);
        return;
      }

      if (isSnappingRef.current) return;

      const now = Date.now();
      if (now - lastScrollMs.current < 550) return;
      lastScrollMs.current = now;

      if (goingDown && cur < steps.length - 1) goTo(cur + 1);
      else if (goingUp && cur > 0) goTo(cur - 1);
    }

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  // Reset to step 0 when section leaves viewport entirely
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          activeRef.current = 0;
          setActiveStep(0);
        }
      },
      { threshold: 0 }
    );
    const el = sectionRef.current;
    if (el) obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const step = steps[activeStep];
  const { IconComponent } = step;

  return (
    <div ref={sectionRef} className="hidden md:flex items-center h-screen max-w-6xl mx-auto px-8 gap-16">
      {/* Left nav */}
      <div className="w-2/5 space-y-1">
        <div className="mb-8">
          <span className="text-accent font-bold text-sm uppercase tracking-wider">Proses Kerja</span>
          <h2 className="text-4xl font-extrabold text-brand-dark mt-2">
            Sederhana, transparan,{" "}
            <span className="text-accent">tanpa ribet</span>
          </h2>
        </div>
        {steps.map((s, i) => {
          const active = i === activeStep;
          const { IconComponent: IC } = s;
          return (
            <motion.button
              key={i}
              animate={{ opacity: active ? 1 : 0.38, x: active ? 6 : 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => goTo(i)}
              className="w-full text-left flex items-center gap-4 p-4 rounded-2xl transition-colors"
              style={{ background: active ? "rgba(245,167,0,0.09)" : "transparent" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
                style={{ background: active ? "rgba(245,167,0,0.15)" : "rgba(36,36,35,0.05)" }}
              >
                <IC size={17} className={active ? "text-accent" : "text-brand-dark/40"} />
              </div>
              <div>
                <div className={`font-bold text-base ${active ? "text-brand-dark" : "text-brand-dark/50"}`}>{s.title}</div>
                <div className="text-xs text-brand-dark/40 mt-0.5">{s.desc}</div>
              </div>
            </motion.button>
          );
        })}

        {/* Scroll hint */}
        <div className="pt-4 flex items-center gap-2 text-brand-dark/30 text-xs">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 2v10M4 9l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Scroll untuk melihat langkah berikutnya
        </div>
      </div>

      {/* Right: single card */}
      <div className="w-3/5">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -28 }}
            transition={{ duration: 0.38, ease: "easeOut" }}
            className="bg-white/85 backdrop-blur-sm rounded-3xl p-10 border border-brand-dark/8 card-shadow"
          >
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
              <IconComponent size={30} className="text-accent" />
            </div>
            <span className="text-accent font-bold text-sm uppercase tracking-widest">Langkah {step.number}</span>
            <h3 className="text-3xl font-extrabold text-brand-dark mt-2 mb-4">{step.title}</h3>
            <p className="text-brand-dark/60 text-lg leading-relaxed">{step.detail}</p>
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
  );
}

function MobileSteps() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });
  return (
    <div ref={ref} className="md:hidden py-20 bg-transparent">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-accent font-bold text-sm uppercase tracking-wider">Proses Kerja</span>
          <h2 className="text-4xl font-extrabold text-brand-dark mt-3">
            Sederhana, transparan,<br />
            <span className="text-accent">tanpa ribet</span>
          </h2>
        </motion.div>
        <div className="space-y-0">
          {steps.map((step, i) => {
            const { IconComponent } = step;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.12, duration: 0.5 }}
                className="flex gap-4"
              >
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0 border border-accent/20">
                    <IconComponent size={17} className="text-accent" />
                  </div>
                  {i < steps.length - 1 && <div className="w-0.5 flex-1 mt-2 bg-accent/20 min-h-[28px]" />}
                </div>
                <div className="pb-8 flex-1">
                  <span className="text-accent text-xs font-bold uppercase tracking-widest">{step.number}</span>
                  <h3 className="font-bold text-brand-dark text-xl mt-1 mb-2">{step.title}</h3>
                  <p className="text-brand-dark/60 text-sm leading-relaxed">{step.detail}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function CaraKerjaSection() {
  return (
    <>
      <MobileSteps />
      <DesktopSteps />
    </>
  );
}
