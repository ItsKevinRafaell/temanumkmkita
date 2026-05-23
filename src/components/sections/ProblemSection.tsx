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

function ProblemRow({
  problem,
  index,
  inView,
}: {
  problem: (typeof problems)[0];
  index: number;
  inView: boolean;
}) {
  const isEven = index % 2 === 0;
  const { Icon } = problem;

  const visualSide = (
    <motion.div
      initial={{ opacity: 0, x: isEven ? -40 : 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.15 + 0.1, duration: 0.6, ease: "easeOut" }}
      className="flex items-center justify-center"
    >
      <div className="relative">
        <div className="w-32 h-32 rounded-3xl bg-accent/10 flex items-center justify-center">
          <Icon size={52} className="text-accent" strokeWidth={1.5} />
        </div>
        <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-accent/20 blur-sm" />
        <div className="absolute -bottom-4 -left-4 w-12 h-12 rounded-full bg-accent/10 blur-md" />
      </div>
    </motion.div>
  );

  const textSide = (
    <motion.div
      initial={{ opacity: 0, x: isEven ? 40 : -40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}
    >
      <span className="text-accent font-bold text-xs uppercase tracking-widest">Masalah {index + 1}</span>
      <h3 className="text-2xl sm:text-3xl font-extrabold text-brand-dark mt-2 mb-3 leading-tight">
        {problem.title}
      </h3>
      <p className="text-brand-dark/50 text-lg leading-relaxed mb-4">{problem.desc}</p>
      <p className="text-brand-dark/60 text-sm leading-relaxed">{problem.detail}</p>
    </motion.div>
  );

  return (
    <div className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-10 md:gap-16 py-12`}>
      <div className="w-full md:w-2/5 flex justify-center">{visualSide}</div>
      <div className="w-full md:w-3/5">{textSide}</div>
    </div>
  );
}

export default function ProblemSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });

  return (
    <section ref={ref} className="py-24 bg-transparent relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-4"
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

        <div className="divide-y divide-brand-dark/5">
          {problems.map((p, i) => (
            <ProblemRow key={i} problem={p} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
