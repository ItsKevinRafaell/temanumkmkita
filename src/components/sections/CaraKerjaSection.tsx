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
    detail:
      "Kami dengarkan dulu. Tidak ada tekanan, tidak ada biaya. Cukup ceritakan bisnis kamu dan apa yang ingin dicapai — kami bantu analisis dan rekomendasikan solusi terbaik.",
    IconComponent: MessageCircle,
  },
  {
    number: "02",
    title: "DP & Mulai",
    desc: "Setuju dengan paket? Bayar DP, kami langsung mulai.",
    detail:
      "Setelah sepakat dengan paket dan timeline, kamu cukup bayar DP. Tidak ada biaya tersembunyi. Kontrak jelas, scope jelas, ekspektasi jelas.",
    IconComponent: CreditCard,
  },
  {
    number: "03",
    title: "Eksekusi",
    desc: "Tim kami kerjakan proyekmu dengan update berkala.",
    detail:
      "Kamu bisa pantau progress kapan saja. Kami kirimkan update rutin, terbuka terhadap masukan, dan siap melakukan penyesuaian selama proses berlangsung.",
    IconComponent: Zap,
  },
  {
    number: "04",
    title: "Go-Live",
    desc: "Hasil final dikirim, revisi gratis, bisnis hadir online.",
    detail:
      "Setelah kamu approve hasil akhir, kami bantu proses go-live. Revisi gratis disertakan. Tidak selesai sebelum kamu puas.",
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
    <div
      ref={sectionRef}
      className="mx-auto hidden h-screen max-w-6xl items-center gap-16 px-8 lg:flex"
    >
      {/* Left nav */}
      <div className="w-2/5 space-y-1">
        <div className="mb-8">
          <span className="text-sm font-bold uppercase tracking-wider text-accent">
            Proses Kerja
          </span>
          <h2 className="mt-2 text-4xl font-extrabold text-brand-dark">
            Sederhana, Transparan, <span className="text-accent">Tanpa Ribet</span>
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
              className="flex w-full items-center gap-4 rounded-lg p-4 text-left transition-colors"
              style={{ background: active ? "rgba(245,167,0,0.09)" : "transparent" }}
            >
              <div
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md transition-colors"
                style={{ background: active ? "rgba(245,167,0,0.15)" : "rgba(36,36,35,0.05)" }}
              >
                <IC size={17} className={active ? "text-accent" : "text-brand-dark/40"} />
              </div>
              <div>
                <div
                  className={`text-base font-bold ${active ? "text-brand-dark" : "text-brand-dark/50"}`}
                >
                  {s.title}
                </div>
                <div className="mt-0.5 text-xs text-brand-dark/40">{s.desc}</div>
              </div>
            </motion.button>
          );
        })}

        {/* Scroll hint */}
        <div className="flex items-center gap-2 pt-4 text-xs text-brand-dark/30">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M7 2v10M4 9l3 3 3-3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
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
            className="border-brand-dark/8 card-shadow rounded-lg border bg-white p-10"
          >
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-md bg-accent/10">
              <IconComponent size={30} className="text-accent" />
            </div>
            <span className="text-sm font-bold uppercase tracking-widest text-accent">
              Langkah {step.number}
            </span>
            <h3 className="mb-4 mt-2 text-3xl font-extrabold text-brand-dark">{step.title}</h3>
            <p className="text-lg leading-relaxed text-brand-dark/60">{step.detail}</p>
            <div className="mt-8 flex gap-2">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-md transition-all duration-500 ${
                    i === activeStep ? "flex-1 bg-accent" : "w-6 bg-brand-dark/10"
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
    <div ref={ref} className="bg-transparent py-20 lg:hidden">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <span className="text-sm font-bold uppercase tracking-wider text-accent">
            Proses Kerja
          </span>
          <h2 className="mt-3 text-4xl font-extrabold text-brand-dark">
            Sederhana, Transparan,
            <br />
            <span className="text-accent">Tanpa Ribet</span>
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
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md border border-accent/20 bg-accent/10">
                    <IconComponent size={17} className="text-accent" />
                  </div>
                  {i < steps.length - 1 && (
                    <div className="mt-2 min-h-[28px] w-0.5 flex-1 bg-accent/20" />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <span className="text-xs font-bold uppercase tracking-widest text-accent">
                    {step.number}
                  </span>
                  <h3 className="mb-2 mt-1 text-xl font-bold text-brand-dark">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-brand-dark/60">{step.detail}</p>
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
