"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Users, BarChart2, Target, Monitor } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CTASection from "@/components/sections/CTASection";

// ─── Count-up hook ────────────────────────────────────────────────────────────
function useCountUp(target: number, active: boolean, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = Date.now();
    function tick() {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [active, target, duration]);
  return value;
}

// ─── Sections ─────────────────────────────────────────────────────────────────

function HeroSection() {
  const headline1 = "Kami bukan vendor.".split(" ");
  const headline2 = "Kami teman bisnis kamu.".split(" ");

  return (
    <section className="relative bg-[#242423] min-h-[70vh] flex flex-col items-center justify-center pt-24 pb-20 overflow-hidden">
      {/* Subtle grid texture on dark bg */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-white/8 border border-white/15 px-4 py-1.5 rounded-full mb-10"
        >
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-sm font-semibold text-white/70">Kenali Kami</span>
        </motion.div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
          {headline1.map((word, i) => (
            <motion.span
              key={`h1-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
              className="inline-block mr-[0.25em] text-white"
            >
              {word}
            </motion.span>
          ))}
          <br />
          {headline2.map((word, i) => (
            <motion.span
              key={`h2-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.08, duration: 0.4 }}
              className={cn(
                "inline-block mr-[0.25em]",
                word === "teman" || word === "bisnis" || word === "kamu."
                  ? "text-accent"
                  : "text-white"
              )}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          className="text-white/50 text-lg max-w-2xl mx-auto leading-relaxed"
        >
          Teman UMKM Kita hadir karena terlalu banyak bisnis lokal yang bagus
          tapi tidak terlihat online. Kami di sini untuk mengubah itu.
        </motion.p>
      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/8" />
    </section>
  );
}

function CeritaSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="text-accent font-bold text-sm uppercase tracking-wider block mb-4">
              Cerita Kami
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-brand-dark mb-6 leading-tight">
              Berawal dari frustrasi yang sama.
            </h2>
            <p className="text-brand-dark/60 text-lg leading-relaxed mb-6">
              Terlalu banyak UMKM punya produk bagus, pelayanan solid, tapi kalah
              dari kompetitor yang &ldquo;keliatan&rdquo; di Google. Bukan karena kualitas.
              Tapi karena tidak punya tim digital.
            </p>

            {/* Quote block */}
            <blockquote className="border-l-4 border-accent pl-5 py-1 mb-6">
              <p className="text-brand-dark/70 text-lg italic leading-relaxed">
                &ldquo;Teman UMKM Kita lahir dari situ. Bukan agensi besar dengan klien
                ratusan — tapi mitra yang benar-benar hadir, tahu nama pemiliknya,
                dan kerja seperti bagian dari timnya.&rdquo;
              </p>
            </blockquote>

            <p className="text-brand-dark/60 text-lg leading-relaxed">
              Kami percaya setiap bisnis lokal berhak punya kehadiran digital
              yang kuat. Dan kami di sini untuk mewujudkan itu.
            </p>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div className="bg-brand-dark/4 border border-brand-dark/8 rounded-3xl p-6 space-y-4">
              {/* Browser chrome mock */}
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-brand-dark/15" />
                <div className="w-3 h-3 rounded-full bg-brand-dark/15" />
                <div className="w-3 h-3 rounded-full bg-brand-dark/15" />
                <div className="flex-1 h-5 bg-brand-dark/8 rounded-full ml-2" />
              </div>
              {/* Hero area mock */}
              <div className="h-28 bg-brand-dark/6 rounded-2xl flex items-center justify-center">
                <Monitor size={32} className="text-brand-dark/20" />
              </div>
              {/* Content rows mock */}
              <div className="grid grid-cols-2 gap-3">
                <div className="h-16 bg-accent/12 rounded-xl" />
                <div className="h-16 bg-brand-dark/6 rounded-xl" />
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-brand-dark/10 rounded-full" />
                <div className="h-2 bg-brand-dark/8 rounded-full w-3/4" />
                <div className="h-2 bg-brand-dark/6 rounded-full w-1/2" />
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -right-4 bg-accent rounded-2xl px-5 py-3 shadow-lg shadow-accent/30">
              <div className="text-brand-dark font-bold text-sm">Siap Online</div>
              <div className="text-brand-dark/60 text-xs">Website profesional</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const nilaiItems = [
  {
    icon: Users,
    title: "Teman, bukan vendor",
    desc: "Kami tidak hilang setelah proyek selesai. Hubungan kami jangka panjang.",
  },
  {
    icon: BarChart2,
    title: "Hasil yang bisa diukur",
    desc: "Tidak ada janji kosong. Semua ada laporannya, semua bisa diverifikasi.",
  },
  {
    icon: Target,
    title: "Fokus pada bisnis kamu",
    desc: "Solusi disesuaikan dengan kebutuhan nyata, bukan paket copy-paste.",
  },
];

function MisiNilaiSection() {
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
          <span className="text-accent font-bold text-sm uppercase tracking-wider block mb-3">
            Cara Kami Kerja
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-brand-dark">
            Satu misi,{" "}
            <span className="text-accent">tiga cara</span>
            {" "}kami kerja
          </h2>
          <p className="text-brand-dark/60 text-lg mt-4 max-w-xl mx-auto">
            Bantu UMKM Indonesia tumbuh lewat kehadiran digital yang nyata dan terukur.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {nilaiItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -6 }}
                className="bg-white/80 backdrop-blur-sm border border-brand-dark/8 card-shadow rounded-2xl p-8 cursor-default"
              >
                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-5">
                  <Icon size={24} className="text-accent" />
                </div>
                <h3 className="font-bold text-brand-dark text-lg mb-3">{item.title}</h3>
                <p className="text-brand-dark/60 leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const statsData = [
  { value: 2, label: "Klien Aktif", suffix: "" },
  { value: 6, label: "Proyek Dikerjakan", suffix: "" },
  { value: 5, label: "Layanan Tersedia", suffix: "" },
  { value: 2025, label: "Tahun Mulai", suffix: "", noCountUp: true },
];

function StatCell({ value, label, suffix, noCountUp, active }: {
  value: number; label: string; suffix: string; noCountUp?: boolean; active: boolean;
}) {
  const count = useCountUp(noCountUp ? 0 : value, active && !noCountUp);
  return (
    <div className="bg-accent px-8 py-12 text-center">
      <div className="text-6xl font-black text-brand-dark tabular-nums">
        {noCountUp ? (active ? value : 0) : count}{suffix}
      </div>
      <div className="text-xs uppercase tracking-widest text-brand-dark/60 mt-2">{label}</div>
    </div>
  );
}

function StatsSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section ref={ref} className="bg-accent">
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-brand-dark/10">
        {statsData.map((s, i) => (
          <StatCell key={i} {...s} active={inView} />
        ))}
      </div>
    </section>
  );
}

function TimSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section ref={ref} className="py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <span className="text-accent font-bold text-sm uppercase tracking-wider block mb-3">
            Tim Kami
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-brand-dark">
            Siapa di balik<br />
            <span className="text-accent">Teman UMKM Kita?</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white/80 backdrop-blur-sm border border-brand-dark/8 card-shadow rounded-3xl p-8 sm:p-12"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 text-left">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-28 h-28 rounded-2xl border-2 border-accent bg-accent/10 flex items-center justify-center text-3xl font-extrabold text-accent">
                K
              </div>
            </div>
            {/* Bio */}
            <div>
              <div className="text-2xl font-bold text-brand-dark mb-1">[Nama Founder]</div>
              <div className="text-accent font-semibold text-sm mb-4">Founder & Digital Strategist</div>
              <p className="text-brand-dark/70 leading-relaxed">
                Bergabung di dunia digital marketing karena percaya setiap UMKM berhak
                bersaing secara online. Telah membantu puluhan bisnis lokal membangun
                kehadiran digital yang solid — dari nol sampai terlihat di halaman pertama Google.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function KlienSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  const clients = [
    {
      services: ["SEO & Google Maps"],
      description: "Optimasi pencarian lokal & visibilitas Maps untuk bisnis yang ingin lebih mudah ditemukan.",
    },
    {
      services: ["Web Development", "Desain Logo", "Maintenance"],
      description: "Dari identitas brand hingga website yang cepat dan terawat — satu ekosistem digital.",
    },
  ];

  return (
    <section ref={ref} className="py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="text-accent font-bold text-sm uppercase tracking-wider block mb-3">
            Kepercayaan Klien
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-brand-dark">
            Bisnis yang sudah<br />
            <span className="text-accent">mempercayai kami</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {clients.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-white/80 backdrop-blur-sm border border-brand-dark/8 card-shadow rounded-2xl p-6 relative"
            >
              <div className="absolute top-4 right-4">
                <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                  Aktif
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4 pr-16">
                {c.services.map((s) => (
                  <span
                    key={s}
                    className="bg-accent/10 text-accent text-xs font-semibold px-3 py-1 rounded-full"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <p className="text-brand-dark/60 text-sm leading-relaxed">{c.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── cn helper (inline to avoid import issues) ───────────────────────────────
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function TentangKamiPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <CeritaSection />
        <MisiNilaiSection />
        <StatsSection />
        <TimSection />
        <KlienSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
