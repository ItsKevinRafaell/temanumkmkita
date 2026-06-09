"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { BarChart2, CalendarDays, ChevronRight, MapPin, Target, Users } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CTASection from "@/components/sections/CTASection";

// ─── Hero ─────────────────────────────────────────────────────────────────────

const heroStats = [
  { value: "3", label: "Klien Aktif" },
  { value: "10+", label: "Proyek Lintas Layanan" },
  { value: "2025", label: "Berdiri" },
  { value: "Kaltim", label: "Akar Layanan Utama" },
];

const focusItems = [
  { icon: MapPin, title: "Area Fokus", text: "Kalimantan Timur dan Jabodetabek." },
  { icon: CalendarDays, title: "Respons", text: "Berusaha membalas dalam 24 jam." },
  { icon: Target, title: "Cara Kerja", text: "Mulai dari kebutuhan paling prioritas." },
];

function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-28 pb-20 lg:pt-32 lg:pb-24">
      <div className="absolute inset-x-0 top-0 h-px bg-brand-dark/10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1.5 text-xs text-brand-dark/40 font-medium mb-8">
          <Link href="/" className="hover:text-brand-dark transition-colors">Beranda</Link>
          <ChevronRight size={12} />
          <span className="text-brand-dark/70">Tentang Kami</span>
        </div>

        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="text-accent font-bold text-sm uppercase tracking-wider"
            >
              Tentang Teman UMKM Kita
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.5 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] text-brand-dark mt-4 max-w-3xl"
            >
              Kami Bukan Vendor. Kami Teman Bisnis Kamu.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.5 }}
              className="text-lg sm:text-xl text-brand-dark/60 max-w-2xl mt-6 leading-relaxed"
            >
              Teman UMKM Kita hadir buat bantu bisnis lokal yang sebenarnya kuat,
              tapi belum cukup terlihat saat calon pelanggan mencari, membandingkan,
              dan akhirnya memutuskan untuk beli.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24, duration: 0.5 }}
              className="mt-9 grid grid-cols-2 sm:grid-cols-4 max-w-3xl border border-brand-dark/10 bg-white rounded-lg overflow-hidden"
            >
              {heroStats.map((s) => (
                <div key={s.label} className="px-4 py-4 border-r border-b sm:border-b-0 border-brand-dark/8 last:border-r-0 even:border-r-0 sm:even:border-r">
                  <div className="text-2xl sm:text-3xl font-extrabold text-brand-dark tabular-nums">{s.value}</div>
                  <div className="text-xs sm:text-sm text-brand-dark/50 mt-1 leading-snug">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.55 }}
            className="rounded-lg border border-brand-dark/10 bg-white shadow-card overflow-hidden"
          >
            <div className="border-b border-brand-dark/8 px-5 py-4">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-dark/40">Prinsip Kerja</p>
              <h2 className="text-lg font-extrabold text-brand-dark mt-0.5">Dekat, Praktis, Dan Bisa Dicek</h2>
            </div>

            <div className="p-5 space-y-3">
              {focusItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex items-start gap-3 rounded-lg border border-brand-dark/8 px-4 py-3">
                    <div className="h-9 w-9 rounded-md bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={17} className="text-accent" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-brand-dark">{item.title}</div>
                      <p className="text-xs text-brand-dark/55 mt-0.5 leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                );
              })}

              <div className="rounded-lg border border-accent/25 bg-accent/10 p-4">
                <p className="text-sm font-bold text-brand-dark">Bukan soal terlihat ramai.</p>
                <p className="text-sm text-brand-dark/65 mt-1 leading-relaxed">
                  Fokus kami adalah bikin bisnis lebih mudah ditemukan, lebih dipercaya,
                  dan lebih jelas saat calon pelanggan butuh jawaban cepat.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
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
              Berawal Dari Frustrasi Yang Sama.
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
            <div className="bg-white border border-accent/25 rounded-lg p-8 flex flex-col gap-6 shadow-card">
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
    <section ref={ref} className="bg-white border-y border-brand-dark/8 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-dark leading-tight"
        >
          Kami Tidak Sekadar Mengerjakan Proyek.
          <br />
          <span className="text-accent">Kami Ikut Menjaga Momentum Bisnismu.</span>
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
            Satu Misi,{" "}
            <span className="text-accent">Tiga Cara</span>
            {" "}Kami Kerja
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
                whileHover={{ y: -4 }}
                className="bg-white border border-brand-dark/8 card-shadow rounded-lg p-8 cursor-default"
              >
                <div className="w-14 h-14 rounded-md bg-accent/10 flex items-center justify-center mb-6">
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
            Siapa Di Balik{" "}
            <span className="text-accent">Teman UMKM Kita?</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="bg-white border border-brand-dark/8 card-shadow rounded-lg p-8 sm:p-12"
        >
          <div className="grid md:grid-cols-5 gap-10 items-start">
            {/* Left — identity */}
            <div className="md:col-span-2 flex flex-col items-center md:items-start gap-4">
              <div className="w-32 h-32 rounded-lg border-2 border-accent bg-accent/10 flex items-center justify-center text-4xl font-extrabold text-accent flex-shrink-0">
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
                    className="inline-block bg-brand-dark/5 text-brand-dark/60 text-xs font-semibold px-3 py-1.5 rounded-md mr-2"
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
