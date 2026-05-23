"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Handshake, Wallet, Star, Heart } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CTASection from "@/components/sections/CTASection";
import BlobDecoration from "@/components/ui/BlobDecoration";

const stats = [
  { value: "120+", label: "Proyek Selesai" },
  { value: "50+", label: "Klien Aktif" },
  { value: "2+", label: "Tahun Pengalaman" },
];

const values = [
  {
    icon: Handshake,
    title: "Jujur & Transparan",
    desc: "Tidak ada biaya tersembunyi. Semua disampaikan jelas dari awal.",
  },
  {
    icon: Wallet,
    title: "Terjangkau",
    desc: "Harga disesuaikan dengan kantong UMKM, tanpa kompromi kualitas.",
  },
  {
    icon: Star,
    title: "Profesional",
    desc: "Kualitas kerja setara agensi besar, dengan sentuhan personal.",
  },
  {
    icon: Heart,
    title: "Peduli Sesama",
    desc: "Kami tumbuh bersama klien. Sukses kamu adalah sukses kami.",
  },
];

function HeroSection() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-16 pb-12">
      <BlobDecoration position="top-right" size={440} opacity={0.22} shape={1} />
      <BlobDecoration position="bottom-left" size={320} opacity={0.16} shape={2} />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 px-4 py-1.5 rounded-full mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-sm font-semibold text-brand-dark">Kenali Kami</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-brand-dark leading-tight mb-6"
        >
          Teman terbaik untuk{" "}
          <span className="text-accent">bisnis kamu</span>
          <br />
          di era digital
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-xl text-brand-dark/60 max-w-2xl mx-auto leading-relaxed"
        >
          Kami lahir dari kepedulian terhadap UMKM Indonesia yang belum bisa
          memanfaatkan potensi digital secara maksimal.
        </motion.p>
      </div>
    </section>
  );
}

function StatsSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section ref={ref} className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-white/80 backdrop-blur-sm border border-brand-dark/8 card-shadow rounded-2xl p-8 text-center"
            >
              <div className="text-5xl font-extrabold text-accent mb-2">{s.value}</div>
              <div className="text-brand-dark/60 font-medium">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MisiVisiSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="text-accent font-bold text-sm uppercase tracking-wider">
            Arah & Tujuan
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-brand-dark mt-3">
            Misi & Visi kami
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              label: "Visi",
              text: "Menjadi mitra digital terpercaya bagi 10.000 UMKM Indonesia — membantu setiap bisnis lokal punya kehadiran online yang kuat dan bermartabat.",
            },
            {
              label: "Misi",
              text: "Membantu UMKM hadir secara online dengan solusi yang terjangkau, mudah dipahami, dan berdampak nyata pada pertumbuhan bisnis mereka.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i === 0 ? -24 : 24 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
              className="bg-white/80 backdrop-blur-sm border border-brand-dark/8 card-shadow rounded-2xl p-8 border-l-4 border-l-accent"
            >
              <span className="text-accent font-bold text-sm uppercase tracking-wider mb-3 block">
                {item.label}
              </span>
              <p className="text-brand-dark text-lg leading-relaxed font-medium">
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ValuesSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="text-accent font-bold text-sm uppercase tracking-wider">
            Yang Kami Pegang
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-brand-dark mt-3">
            Nilai kami
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="bg-white/80 backdrop-blur-sm border border-brand-dark/8 card-shadow rounded-2xl p-6 flex flex-col items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={22} className="text-accent" />
                </div>
                <div>
                  <div className="font-bold text-brand-dark mb-1">{v.title}</div>
                  <div className="text-brand-dark/60 text-sm leading-relaxed">{v.desc}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function TentangKamiPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <MisiVisiSection />
        <ValuesSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
