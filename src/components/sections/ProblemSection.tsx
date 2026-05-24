"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { SearchX, Globe, TrendingDown, type LucideIcon } from "lucide-react";

const problems: {
  Icon: LucideIcon;
  title: string;
  desc: string;
  detail: string;
}[] = [
  {
    Icon: SearchX,
    title: "Susah ditemukan di Google",
    desc: "Calon pelanggan cari produkmu tapi muncul kompetitor, bukan kamu.",
    detail: "Tanpa SEO dan Google Maps yang teroptimasi, bisnismu tidak terlihat saat momen paling penting — saat calon pembeli sedang mencari.",
  },
  {
    Icon: Globe,
    title: "Belum punya website",
    desc: "Tanpa website, bisnis terlihat kurang profesional dan sulit dipercaya.",
    detail: "Di era digital, website adalah kartu nama pertama. Calon pelanggan menilai kredibilitas bisnis kamu dari kehadiran online yang profesional.",
  },
  {
    Icon: TrendingDown,
    title: "Sosmed jarang dikelola",
    desc: "Postingan tidak konsisten, engagement rendah, follower tidak tumbuh.",
    detail: "Konsistensi adalah kunci media sosial. Tanpa strategi konten yang terencana, bisnismu kehilangan kesempatan membangun komunitas pelanggan setia.",
  },
];

function TimelineItem({
  problem,
  index,
  inView,
}: {
  problem: (typeof problems)[0];
  index: number;
  inView: boolean;
}) {
  const isLeft = index % 2 === 0;
  const { Icon } = problem;

  const card = (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.18 + 0.1, duration: 0.55, ease: "easeOut" }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-brand-dark/8 card-shadow"
    >
      <span className="text-accent font-bold text-xs uppercase tracking-widest">Masalah {index + 1}</span>
      <h3 className="text-xl sm:text-2xl font-extrabold text-brand-dark mt-2 mb-3 leading-tight">
        {problem.title}
      </h3>
      <p className="text-brand-dark/55 text-sm leading-relaxed">{problem.detail}</p>
    </motion.div>
  );

  const dot = (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : {}}
      transition={{ delay: index * 0.18, duration: 0.35, ease: "backOut" }}
      className="flex flex-col items-center gap-2 relative z-10"
    >
      <div className="w-12 h-12 rounded-full bg-white border-2 border-accent/40 flex items-center justify-center shadow-md flex-shrink-0">
        <Icon size={20} className="text-accent" strokeWidth={1.8} />
      </div>
      {index === 0 && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="bg-accent text-white text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap shadow-sm"
        >
          📍 Kalian di sini
        </motion.div>
      )}
    </motion.div>
  );

  return (
    <>
      {/* ── Desktop: timeline left/right ─────────── */}
      <div className="hidden md:flex items-start gap-0 mb-14 last:mb-0">
        {/* Left 45% */}
        <div className="w-[45%] flex justify-end pr-8 pt-1">
          {isLeft && card}
        </div>
      <div className="w-[10%] flex justify-center">
          {dot}
        </div>
        {/* Right 45% */}
        <div className="w-[45%] pl-8 pt-1">
          {!isLeft && card}
        </div>
      </div>

      {/* ── Mobile: left-side vertical timeline ──── */}
      <motion.div
        className="md:hidden flex gap-4 mb-8 last:mb-0"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: index * 0.15 + 0.1, duration: 0.5 }}
      >
        <div className="flex flex-col items-center pt-0.5">
          <div className="w-10 h-10 rounded-full bg-white border-2 border-accent/40 flex items-center justify-center shadow-sm flex-shrink-0 z-10">
            <Icon size={16} className="text-accent" strokeWidth={1.8} />
          </div>
          {index < problems.length - 1 && (
            <div className="w-0.5 flex-1 mt-2 mb-0 bg-accent/25 min-h-[48px]" />
          )}
        </div>
        <div className="flex-1 pb-2">
          {index === 0 && (
            <div className="mb-2">
              <span className="inline-flex bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                📍 Kalian di sini
              </span>
            </div>
          )}
          <span className="text-accent font-bold text-xs uppercase tracking-widest">Masalah {index + 1}</span>
          <h3 className="text-xl font-extrabold text-brand-dark mt-1 mb-2 leading-tight">{problem.title}</h3>
          <p className="text-brand-dark/55 text-sm leading-relaxed">{problem.detail}</p>
        </div>
      </motion.div>
    </>
  );
}

export default function ProblemSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });

  return (
    <section ref={ref} className="py-20 bg-transparent relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-accent font-bold text-sm uppercase tracking-wider">Masalah yang Kami Pahami</span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-brand-dark mt-3 leading-tight">
            Bisnis bagus, tapi susah<br />
            <span className="text-accent">ditemukan online?</span>
          </h2>
          <p className="text-brand-dark/60 mt-4 text-lg max-w-2xl mx-auto">
            Banyak UMKM punya produk luar biasa, tapi tak ada yang tahu. Di sinilah kami hadir.
          </p>
        </motion.div>

        {/* Timeline wrapper */}
        <div className="relative">
          {/* Vertical center line (desktop only) */}
          <div
            className="hidden md:block absolute left-1/2 top-6 bottom-6 -translate-x-1/2"
            style={{ width: "2px", background: "rgba(36,36,35,0.1)" }}
          />

          {problems.map((p, i) => (
            <TimelineItem key={i} problem={p} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
