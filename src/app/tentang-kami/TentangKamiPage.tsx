"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Users, BarChart2, Target } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CTASection from "@/components/sections/CTASection";
import BlobDecoration from "@/components/ui/BlobDecoration";

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
    <section className="relative min-h-[65vh] flex flex-col items-center justify-center pt-24 pb-16 overflow-hidden">
      <BlobDecoration position="top-right" size={460} opacity={0.22} shape={1} />
      <BlobDecoration position="bottom-left" size={340} opacity={0.16} shape={2} />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 px-4 py-1.5 rounded-full mb-10"
        >
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-sm font-semibold text-brand-dark">Kenali Kami</span>
        </motion.div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 text-brand-dark">
          {headline1.map((word, i) => (
            <motion.span
              key={`h1-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
              className="inline-block mr-[0.25em]"
            >
              {word}
            </motion.span>
          ))}
          <br />
          {headline2.map((word, i) => {
            const accentWords = ["teman", "bisnis", "kamu."];
            return (
              <motion.span
                key={`h2-${i}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.08, duration: 0.4 }}
                className={`inline-block mr-[0.25em] ${accentWords.includes(word) ? "text-accent" : ""}`}
              >
                {word}
              </motion.span>
            );
          })}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          className="text-brand-dark/60 text-lg max-w-2xl mx-auto leading-relaxed"
        >
          Teman UMKM Kita hadir karena terlalu banyak bisnis lokal yang bagus
          tapi tidak terlihat online. Kami di sini untuk mengubah itu.
        </motion.p>
      </div>
    </section>
  );
}

function CeritaSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="text-accent font-bold text-sm uppercase tracking-wider block mb-4">
            Cerita Kami
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-brand-dark mb-8 leading-tight">
            Berawal dari frustrasi yang sama.
          </h2>
          <p className="text-brand-dark/60 text-lg leading-relaxed mb-6">
            Terlalu banyak UMKM punya produk bagus, pelayanan solid, tapi kalah
            dari kompetitor yang &ldquo;keliatan&rdquo; di Google. Bukan karena kualitas.
            Tapi karena tidak punya tim digital.
          </p>

          <blockquote className="border-l-4 border-accent pl-6 py-1 my-8">
            <p className="text-brand-dark/70 text-xl italic leading-relaxed">
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
  { value: 2, label: "Klien aktif saat ini" },
  { value: 6, label: "Proyek dikerjakan" },
  { value: 5, label: "Layanan tersedia" },
  { value: 2025, label: "Tahun mulai beroperasi", noCountUp: true },
];

function StatsSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section ref={ref} className="bg-accent py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-0 divide-y divide-brand-dark/15">
          {statsData.map((s, i) => (
            <StatRow key={i} {...s} active={inView} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatRow({
  value,
  label,
  noCountUp,
  active,
  index,
}: {
  value: number;
  label: string;
  noCountUp?: boolean;
  active: boolean;
  index: number;
}) {
  const count = useCountUp(noCountUp ? 0 : value, active && !noCountUp);
  const display = noCountUp ? (active ? value : "——") : count;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={active ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="flex items-center gap-8 py-6"
    >
      <div className="w-28 text-right flex-shrink-0">
        <span className="text-5xl font-black text-brand-dark tabular-nums leading-none">
          {display}
        </span>
      </div>
      <div className="w-px h-10 bg-brand-dark/20 flex-shrink-0" />
      <div className="text-sm font-semibold uppercase tracking-widest text-brand-dark/70">
        {label}
      </div>
    </motion.div>
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
            <div className="flex-shrink-0">
              <div className="w-28 h-28 rounded-2xl border-2 border-accent bg-accent/10 flex items-center justify-center text-3xl font-extrabold text-accent">
                K
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-brand-dark mb-1">Kevin</div>
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
      name: "PT Mitra Lindung Sarana",
      services: ["SEO & Google Maps"],
      description: "Optimasi pencarian lokal & visibilitas Maps untuk bisnis yang ingin lebih mudah ditemukan.",
    },
    {
      name: "PT Momen Harmoni Kreatif",
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

              <div className="font-bold text-brand-dark text-lg mb-3 pr-16">{c.name}</div>

              <div className="flex flex-wrap gap-2 mb-4">
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
