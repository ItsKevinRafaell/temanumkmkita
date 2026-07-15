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
    detail:
      "Tanpa SEO dan Google Maps yang teroptimasi, bisnismu tidak terlihat saat momen paling penting — saat calon pembeli sedang mencari.",
  },
  {
    Icon: Globe,
    title: "Belum punya website",
    desc: "Tanpa website, bisnis terlihat kurang profesional dan sulit dipercaya.",
    detail:
      "Di era digital, website adalah kartu nama pertama. Calon pelanggan menilai kredibilitas bisnis kamu dari kehadiran online yang profesional.",
  },
  {
    Icon: TrendingDown,
    title: "Sosmed jarang dikelola",
    desc: "Postingan tidak konsisten, engagement rendah, follower tidak tumbuh.",
    detail:
      "Konsistensi adalah kunci media sosial. Tanpa strategi konten yang terencana, bisnismu kehilangan kesempatan membangun komunitas pelanggan setia.",
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
      className="border-brand-dark/8 card-shadow rounded-lg border bg-white p-6"
    >
      <span className="text-xs font-bold uppercase tracking-widest text-accent">
        Masalah {index + 1}
      </span>
      <h3 className="mb-3 mt-2 text-xl font-extrabold leading-tight text-brand-dark sm:text-2xl">
        {problem.title}
      </h3>
      <p className="text-sm leading-relaxed text-brand-dark/55">{problem.detail}</p>
    </motion.div>
  );

  const dot = (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : {}}
      transition={{ delay: index * 0.18, duration: 0.35, ease: "backOut" }}
      className="relative z-10 flex flex-col items-center gap-2"
    >
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md border border-accent/40 bg-white shadow-sm">
        <Icon size={20} className="text-accent" strokeWidth={1.8} />
      </div>
      {index === 0 && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="whitespace-nowrap rounded-md bg-accent px-2.5 py-1 text-[10px] font-bold text-white shadow-sm"
        >
          Posisi Umum
        </motion.div>
      )}
    </motion.div>
  );

  return (
    <>
      {/* ── Desktop: timeline left/right ─────────── */}
      <div className="mb-14 hidden items-start gap-0 last:mb-0 lg:flex">
        {/* Left 45% */}
        <div className="flex w-[45%] justify-end pr-8 pt-1">{isLeft && card}</div>
        <div className="flex w-[10%] justify-center">{dot}</div>
        {/* Right 45% */}
        <div className="w-[45%] pl-8 pt-1">{!isLeft && card}</div>
      </div>

      {/* ── Mobile: left-side vertical timeline ──── */}
      <motion.div
        className="mb-8 flex gap-4 last:mb-0 lg:hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: index * 0.15 + 0.1, duration: 0.5 }}
      >
        <div className="flex flex-col items-center pt-0.5">
          <div className="z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md border border-accent/40 bg-white shadow-sm">
            <Icon size={16} className="text-accent" strokeWidth={1.8} />
          </div>
          {index < problems.length - 1 && (
            <div className="mb-0 mt-2 min-h-[48px] w-0.5 flex-1 bg-accent/25" />
          )}
        </div>
        <div className="flex-1 pb-2">
          {index === 0 && (
            <div className="mb-2">
              <span className="inline-flex rounded-md bg-accent px-2 py-0.5 text-[10px] font-bold text-white">
                Posisi Umum
              </span>
            </div>
          )}
          <span className="text-xs font-bold uppercase tracking-widest text-accent">
            Masalah {index + 1}
          </span>
          <h3 className="mb-2 mt-1 text-xl font-extrabold leading-tight text-brand-dark">
            {problem.title}
          </h3>
          <p className="text-sm leading-relaxed text-brand-dark/55">{problem.detail}</p>
        </div>
      </motion.div>
    </>
  );
}

export default function ProblemSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });

  return (
    <section ref={ref} className="relative overflow-hidden bg-transparent py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="text-sm font-bold uppercase tracking-wider text-accent">
            Masalah yang Kami Pahami
          </span>
          <h2 className="mt-3 text-4xl font-extrabold leading-tight text-brand-dark sm:text-5xl">
            Bisnis Bagus, Tapi Susah
            <br />
            <span className="text-accent">Ditemukan Online?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-dark/60">
            Banyak UMKM punya produk luar biasa, tapi tak ada yang tahu. Di sinilah kami hadir.
          </p>
        </motion.div>

        {/* Timeline wrapper */}
        <div className="relative">
          {/* Vertical center line (desktop only) */}
          <div
            className="absolute bottom-6 left-1/2 top-6 hidden -translate-x-1/2 lg:block"
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
