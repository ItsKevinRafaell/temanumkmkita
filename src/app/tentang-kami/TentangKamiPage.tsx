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
    <section className="relative overflow-hidden pb-20 pt-28 lg:pb-24 lg:pt-32">
      <div className="absolute inset-x-0 top-0 h-px bg-brand-dark/10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-1.5 text-xs font-medium text-brand-dark/40">
          <Link href="/" className="transition-colors hover:text-brand-dark">
            Beranda
          </Link>
          <ChevronRight size={12} />
          <span className="text-brand-dark/70">Tentang Kami</span>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="text-sm font-bold uppercase tracking-wider text-accent"
            >
              Tentang Teman UMKM Kita
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.5 }}
              className="mt-4 max-w-3xl text-4xl font-extrabold leading-[1.05] text-brand-dark sm:text-5xl lg:text-6xl"
            >
              Kami Bukan Vendor. Kami Teman Bisnis Kamu.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.5 }}
              className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-dark/60 sm:text-xl"
            >
              Teman UMKM Kita hadir buat bantu bisnis lokal yang sebenarnya kuat, tapi belum cukup
              terlihat saat calon pelanggan mencari, membandingkan, dan akhirnya memutuskan untuk
              beli.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24, duration: 0.5 }}
              className="mt-9 grid max-w-3xl grid-cols-2 overflow-hidden rounded-lg border border-brand-dark/10 bg-white sm:grid-cols-4"
            >
              {heroStats.map((s) => (
                <div
                  key={s.label}
                  className="border-brand-dark/8 border-b border-r px-4 py-4 last:border-r-0 even:border-r-0 sm:border-b-0 sm:even:border-r"
                >
                  <div className="text-2xl font-extrabold tabular-nums text-brand-dark sm:text-3xl">
                    {s.value}
                  </div>
                  <div className="mt-1 text-xs leading-snug text-brand-dark/50 sm:text-sm">
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.55 }}
            className="overflow-hidden rounded-lg border border-brand-dark/10 bg-white shadow-card"
          >
            <div className="border-brand-dark/8 border-b px-5 py-4">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-dark/40">
                Prinsip Kerja
              </p>
              <h2 className="mt-0.5 text-lg font-extrabold text-brand-dark">
                Dekat, Praktis, Dan Bisa Dicek
              </h2>
            </div>

            <div className="space-y-3 p-5">
              {focusItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="border-brand-dark/8 flex items-start gap-3 rounded-lg border px-4 py-3"
                  >
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-accent/10">
                      <Icon size={17} className="text-accent" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-brand-dark">{item.title}</div>
                      <p className="mt-0.5 text-xs leading-relaxed text-brand-dark/55">
                        {item.text}
                      </p>
                    </div>
                  </div>
                );
              })}

              <div className="rounded-lg border border-accent/25 bg-accent/10 p-4">
                <p className="text-sm font-bold text-brand-dark">Bukan soal terlihat ramai.</p>
                <p className="mt-1 text-sm leading-relaxed text-brand-dark/65">
                  Fokus kami adalah bikin bisnis lebih mudah ditemukan, lebih dipercaya, dan lebih
                  jelas saat calon pelanggan butuh jawaban cepat.
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
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-16 md:grid-cols-5">
          {/* Text — 3/5 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="md:col-span-3"
          >
            <span className="mb-4 block text-sm font-bold uppercase tracking-wider text-accent">
              Cerita Kami
            </span>
            <h2 className="mb-8 text-4xl font-extrabold leading-tight text-brand-dark sm:text-5xl">
              Berawal Dari Frustrasi Yang Sama.
            </h2>
            <p className="mb-6 text-lg leading-relaxed text-brand-dark/60">
              Terlalu banyak UMKM punya produk bagus, pelayanan solid, tapi kalah dari kompetitor
              yang &ldquo;keliatan&rdquo; di Google. Bukan karena kualitas. Tapi karena tidak punya
              tim digital.
            </p>
            <blockquote className="my-8 border-l-4 border-accent py-1 pl-6">
              <p className="text-xl italic leading-relaxed text-brand-dark/70">
                &ldquo;Teman UMKM Kita lahir dari situ. Bukan agensi besar dengan klien ratusan —
                tapi mitra yang benar-benar hadir, tahu nama pemiliknya, dan kerja seperti bagian
                dari timnya.&rdquo;
              </p>
            </blockquote>
            <p className="text-lg leading-relaxed text-brand-dark/60">
              Kami percaya setiap bisnis lokal berhak punya kehadiran digital yang kuat. Dan kami di
              sini untuk mewujudkan itu.
            </p>
          </motion.div>

          {/* Pull-quote card — 2/5 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="md:sticky md:top-28 md:col-span-2"
          >
            <div className="flex flex-col gap-6 rounded-lg border border-accent/25 bg-white p-8 shadow-card">
              <span className="select-none font-serif text-6xl leading-none text-accent/30">
                &ldquo;
              </span>
              <p className="text-2xl font-bold leading-relaxed text-brand-dark">
                Bukan karena kualitas yang kurang. Tapi karena tidak terlihat.
              </p>
              <p className="text-sm font-semibold uppercase tracking-wider text-brand-dark/50">
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
    <section ref={ref} className="border-brand-dark/8 border-y bg-white py-20">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-3xl font-extrabold leading-tight text-brand-dark sm:text-4xl lg:text-5xl"
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
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <span className="mb-3 block text-sm font-bold uppercase tracking-wider text-accent">
            Cara Kami Kerja
          </span>
          <h2 className="max-w-xl text-4xl font-extrabold text-brand-dark sm:text-5xl">
            Satu Misi, <span className="text-accent">Tiga Cara</span> Kami Kerja
          </h2>
          <p className="mt-4 max-w-xl text-lg text-brand-dark/60">
            Bantu UMKM Indonesia tumbuh lewat kehadiran digital yang nyata dan terukur.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {nilaiItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -4 }}
                className="border-brand-dark/8 card-shadow cursor-default rounded-lg border bg-white p-8"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-md bg-accent/10">
                  <Icon size={24} className="text-accent" />
                </div>
                <h3 className="mb-3 text-lg font-bold text-brand-dark">{item.title}</h3>
                <p className="leading-relaxed text-brand-dark/60">{item.desc}</p>
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
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <span className="mb-3 block text-sm font-bold uppercase tracking-wider text-accent">
            Tim Kami
          </span>
          <h2 className="text-4xl font-extrabold text-brand-dark sm:text-5xl">
            Siapa Di Balik <span className="text-accent">Teman UMKM Kita?</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="border-brand-dark/8 card-shadow rounded-lg border bg-white p-8 sm:p-12"
        >
          <div className="grid items-start gap-10 md:grid-cols-5">
            {/* Left — identity */}
            <div className="flex flex-col items-center gap-4 md:col-span-2 md:items-start">
              <div className="flex h-32 w-32 flex-shrink-0 items-center justify-center rounded-lg border-2 border-accent bg-accent/10 text-4xl font-extrabold text-accent">
                K
              </div>
              <div>
                <div className="text-2xl font-bold text-brand-dark">Kevin</div>
                <div className="mt-1 text-sm font-semibold text-accent">
                  Founder & Digital Strategist
                </div>
              </div>

              {/* Mini highlights */}
              <div className="mt-2 w-full space-y-2">
                {["Digital Marketing", "Web Strategy", "UMKM Enthusiast"].map((tag) => (
                  <span
                    key={tag}
                    className="mr-2 inline-block rounded-md bg-brand-dark/5 px-3 py-1.5 text-xs font-semibold text-brand-dark/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — story */}
            <div className="space-y-4 text-lg leading-relaxed text-brand-dark/70 md:col-span-3">
              <p>
                Bergabung di dunia digital marketing karena percaya setiap UMKM berhak bersaing
                secara online — bukan cuma bisnis besar yang punya budget ratusan juta.
              </p>
              <p>
                Setelah melihat langsung bagaimana banyak bisnis lokal yang berkualitas kalah
                bersaing hanya karena tidak &ldquo;terlihat&rdquo; di Google, Kevin mendirikan Teman
                UMKM Kita sebagai jawaban praktisnya.
              </p>
              <p>
                Bukan sebagai agensi yang transaksional — tapi sebagai teman yang benar-benar hadir,
                memahami bisnis klien dari dalam, dan kerja seperti bagian dari timnya sendiri.
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
