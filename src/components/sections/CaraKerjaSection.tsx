"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const steps = [
  {
    number: "01",
    title: "Konsultasi",
    desc: "Ceritakan kebutuhan bisnismu. Gratis, tanpa syarat. Kami dengarkan dulu.",
    icon: "💬",
  },
  {
    number: "02",
    title: "DP & Mulai",
    desc: "Setuju dengan paket? Bayar DP, dan kami langsung mulai bekerja.",
    icon: "✅",
  },
  {
    number: "03",
    title: "Eksekusi",
    desc: "Tim kami kerjakan proyekmu dengan update berkala. Kamu bisa pantau progresnya.",
    icon: "⚡",
  },
  {
    number: "04",
    title: "Go-Live",
    desc: "Hasil final dikirim, revisi gratis, dan bisnismu siap hadir secara digital.",
    icon: "🚀",
  },
];

export default function CaraKerjaSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-24 bg-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-accent font-bold text-sm uppercase tracking-wider">Proses Kerja</span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-brand-dark mt-3">
            Sederhana, transparan,<br />
            <span className="text-accent">tanpa ribet</span>
          </h2>
        </motion.div>

        <div className="relative">
          {/* connector line */}
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="relative text-center"
              >
                <div className="w-24 h-24 mx-auto bg-white rounded-2xl border-2 border-accent/20 flex flex-col items-center justify-center mb-4 shadow-sm relative z-10">
                  <span className="text-2xl">{step.icon}</span>
                  <span className="text-xs font-bold text-accent mt-1">{step.number}</span>
                </div>
                <h3 className="font-bold text-brand-dark text-lg mb-2">{step.title}</h3>
                <p className="text-brand-dark/60 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
