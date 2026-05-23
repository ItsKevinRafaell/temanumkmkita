"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const problems = [
  {
    icon: "🔍",
    title: "Susah ditemukan di Google",
    desc: "Calon pelanggan cari produkmu tapi muncul kompetitor, bukan kamu.",
  },
  {
    icon: "📱",
    title: "Belum punya website",
    desc: "Tanpa website, bisnis terlihat kurang profesional dan sulit dipercaya.",
  },
  {
    icon: "📣",
    title: "Sosmed jarang dikelola",
    desc: "Postingan tidak konsisten, engagement rendah, follower tidak tumbuh.",
  },
];

export default function ProblemSection() {
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
          <span className="text-accent font-bold text-sm uppercase tracking-wider">Masalah yang Kami Pahami</span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-brand-dark mt-3 leading-tight">
            Bisnis bagus, tapi susah<br />
            <span className="text-accent">ditemukan online?</span>
          </h2>
          <p className="text-brand-dark/60 mt-4 text-lg max-w-2xl mx-auto">
            Banyak UMKM punya produk dan layanan yang luar biasa, tapi tak ada yang tahu.
            Di sinilah kami hadir.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {problems.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="bg-white rounded-2xl p-8 border border-brand-dark/8 shadow-sm"
            >
              <div className="text-4xl mb-4">{p.icon}</div>
              <h3 className="font-bold text-brand-dark text-xl mb-2">{p.title}</h3>
              <p className="text-brand-dark/60 leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-brand-dark/50 text-lg">
            Kami <span className="font-bold text-brand-dark">Teman UMKM Kita</span> hadir untuk menyelesaikan semua ini, satu per satu.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
