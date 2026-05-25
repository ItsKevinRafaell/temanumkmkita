"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Users, BarChart2, Target, ChevronRight } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CTASection from "@/components/sections/CTASection";
import BlobDecoration from "@/components/ui/BlobDecoration";

// ─── Hero ─────────────────────────────────────────────────────────────────────

const heroWords1 = "Kami bukan vendor.".split(" ");
const heroWords2 = "Kami teman bisnis kamu.".split(" ");
const accentWords = new Set(["teman", "bisnis", "kamu."]);

const heroStats = [
  { value: "2", label: "Klien Aktif" },
  { value: "6", label: "Proyek" },
  { value: "5", label: "Layanan" },
  { value: "2025", label: "Berdiri" },
];

function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16">
      <BlobDecoration position="top-right" size={500} opacity={0.2} shape={1} />
      <BlobDecoration position="bottom-left" size={380} opacity={0.15} shape={2} />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex items-center justify-center gap-1.5 text-xs text-brand-dark/40 font-medium mb-6">
          <Link href="/" className="hover:text-brand-dark transition-colors">Beranda</Link>
          <ChevronRight size={12} />
          <span className="text-brand-dark/70">Tentang Kami</span>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 px-4 py-1.5 rounded-full mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-sm font-semibold text-brand-dark">Kenali Kami</span>
        </motion.div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-5">
          {heroWords1.map((word, i) => (
            <motion.span
              key={`a${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
              className="inline-block mr-[0.25em] text-brand-dark"
            >
              {word}
            </motion.span>
          ))}
          <br />
          {heroWords2.map((word, i) => (
            <motion.span
              key={`b${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.08, duration: 0.4 }}
              className={`inline-block mr-[0.25em] ${accentWords.has(word) ? "text-accent" : "text-brand-dark"}`}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          className="text-brand-dark/60 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
        >
          Teman UMKM Kita hadir karena terlalu banyak bisnis lokal yang bagus
          tapi tidak terlihat online. Kami di sini untuk mengubah itu.
        </motion.p>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.5 }}
          className="w-full max-w-lg mx-auto grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-brand-dark/10 bg-white/60 backdrop-blur-sm border border-brand-dark/8 rounded-2xl overflow-hidden"
        >
          {heroStats.map((s) => (
            <div key={s.label} className="px-4 py-5 text-center">
              <div className="text-2xl font-extrabold text-brand-dark tabular-nums">{s.value}</div>
              <div className="text-xs text-brand-dark/50 font-medium mt-0.5">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Cerita ───────────────────────────────────────────────────────────────────

function CeritaSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-5 gap-16 items-start">
          {/* Text — 3/5 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="md:col-span-3"
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

          {/* Pull-quote card — 2/5 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="md:col-span-2 md:sticky md:top-28"
          >
            <div className="bg-accent/8 border border-accent/25 rounded-3xl p-8 flex flex-col gap-6">
              <span className="text-6xl text-accent/30 font-serif leading-none select-none">&ldquo;</span>
              <p className="text-brand-dark text-2xl font-bold leading-relaxed">
                Bukan karena kualitas yang kurang. Tapi karena tidak terlihat.
              </p>
              <p className="text-brand-dark/50 text-sm font-semibold uppercase tracking-wider">
                — Akar masalah yang kami temukan
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Manifesto strip ──────────────────────────────────────────────────────────

function ManifestoStrip() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <section ref={ref} className="bg-accent py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight"
        >
          Kami tidak sekadar mengerjakan proyek.
          <br />
          <span className="text-white/60">Kami bagian dari tim kamu.</span>
        </motion.p>
      </div>
    </section>
  );
}

// ─── Misi & Nilai ─────────────────────────────────────────────────────────────

const nilaiItems = [
  {
    icon: Users,
    title: "Teman, bukan vendor",
    desc: "Kami tidak hilang setelah proyek selesai. Hubungan kami jangka panjang, dan kami tetap ada untuk kamu.",
  },
  {
    icon: BarChart2,
    title: "Hasil yang bisa diukur",
    desc: "Tidak ada janji kosong. Semua ada laporannya, semua bisa diverifikasi. Transparan dari awal sampai akhir.",
  },
  {
    icon: Target,
    title: "Fokus pada bisnis kamu",
    desc: "Solusi disesuaikan dengan kebutuhan nyata bisnismu, bukan paket copy-paste yang sama untuk semua.",
  },
];

function MisiNilaiSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <span className="text-accent font-bold text-sm uppercase tracking-wider block mb-3">
            Cara Kami Kerja
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-brand-dark max-w-xl">
            Satu misi,{" "}
            <span className="text-accent">tiga cara</span>
            {" "}kami kerja
          </h2>
          <p className="text-brand-dark/60 text-lg mt-4 max-w-xl">
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
                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
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

// ─── Tim ──────────────────────────────────────────────────────────────────────

function TimSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <section ref={ref} className="py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <span className="text-accent font-bold text-sm uppercase tracking-wider block mb-3">
            Tim Kami
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-brand-dark">
            Siapa di balik{" "}
            <span className="text-accent">Teman UMKM Kita?</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="bg-white/80 backdrop-blur-sm border border-brand-dark/8 card-shadow rounded-3xl p-8 sm:p-12"
        >
          <div className="grid md:grid-cols-5 gap-10 items-start">
            {/* Left — identity */}
            <div className="md:col-span-2 flex flex-col items-center md:items-start gap-4">
              <div className="w-32 h-32 rounded-2xl border-2 border-accent bg-accent/10 flex items-center justify-center text-4xl font-extrabold text-accent flex-shrink-0">
                K
              </div>
              <div>
                <div className="text-2xl font-bold text-brand-dark">Kevin</div>
                <div className="text-accent font-semibold text-sm mt-1">Founder & Digital Strategist</div>
              </div>

              {/* Mini highlights */}
              <div className="w-full space-y-2 mt-2">
                {[
                  "Digital Marketing",
                  "Web Strategy",
                  "UMKM Enthusiast",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="inline-block bg-brand-dark/5 text-brand-dark/60 text-xs font-semibold px-3 py-1.5 rounded-full mr-2"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — story */}
            <div className="md:col-span-3 space-y-4 text-brand-dark/70 text-lg leading-relaxed">
              <p>
                Bergabung di dunia digital marketing karena percaya setiap UMKM
                berhak bersaing secara online — bukan cuma bisnis besar yang punya
                budget ratusan juta.
              </p>
              <p>
                Setelah melihat langsung bagaimana banyak bisnis lokal yang
                berkualitas kalah bersaing hanya karena tidak &ldquo;terlihat&rdquo; di Google,
                Kevin mendirikan Teman UMKM Kita sebagai jawaban praktisnya.
              </p>
              <p>
                Bukan sebagai agensi yang transaksional — tapi sebagai teman yang
                benar-benar hadir, memahami bisnis klien dari dalam, dan kerja
                seperti bagian dari timnya sendiri.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function TentangKamiPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <CeritaSection />
        <ManifestoStrip />
        <MisiNilaiSection />
        <TimSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
