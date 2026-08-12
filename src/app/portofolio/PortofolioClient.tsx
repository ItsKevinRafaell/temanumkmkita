"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

type Demo = {
  slug: string;
  category: string;
  name: string;
  desc: string;
  tags: string[];
  featured?: boolean;
};

const demos: Demo[] = [
  {
    slug: "karya-bangun-nusantara",
    category: "Kontraktor & Konstruksi",
    name: "Karya Bangun Nusantara",
    desc: "Jasa konstruksi terpercaya untuk hunian, ruko, dan proyek komersial. Dari perencanaan, pengerjaan struktur, sampai serah terima kunci — dikawal tim yang paham cara kerja di lapangan.",
    tags: ["jasa"],
    featured: true,
  },
  { slug: "wibawa-hukum", category: "Kantor Hukum & Notaris", name: "Wibawa Hukum", desc: "Notaris, PPAT, dan advokat untuk urusan legal usaha maupun pribadi Anda.", tags: ["jasa"] },
  { slug: "griya-asri", category: "Properti & Real Estate", name: "Griya Asri", desc: "Jual, beli, dan sewa properti — rumah, ruko, dan tanah — dengan pendampingan sampai akad.", tags: ["retail", "jasa"] },
  { slug: "rania-aesthetic", category: "Klinik Kecantikan", name: "Rania Aesthetic", desc: "Perawatan kulit dan estetika modern dengan tenaga profesional.", tags: ["kesehatan", "jasa"] },
  { slug: "garasi-presisi", category: "Bengkel & Servis Mobil", name: "Garasi Presisi", desc: "Servis dan perawatan mobil menyeluruh, dikerjakan teliti oleh teknisi berpengalaman.", tags: ["jasa"] },
  { slug: "baja-perkasa", category: "Jual & Sewa Alat Berat", name: "Baja Perkasa", desc: "Penyedia alat berat — excavator, forklift, hingga crane — untuk kebutuhan proyek Anda.", tags: ["jasa"] },
  { slug: "presisi-teknik", category: "Fabrikasi & Machining", name: "Presisi Teknik", desc: "Fabrikasi baja, welding, dan machining presisi untuk kebutuhan industri.", tags: ["jasa"] },
  { slug: "cetak-kilat", category: "Percetakan", name: "Cetak Kilat", desc: "Cetak banner, kartu nama, undangan, sampai kemasan — cepat dan rapi.", tags: ["kreatif", "retail"] },
  { slug: "kopi-rehat", category: "Coffee Shop", name: "Kopi Rehat", desc: "Ruang santai dengan racikan kopi lokal pilihan untuk melepas penat.", tags: ["fnb"] },
  { slug: "dapur-rasa-nusantara", category: "Food & Beverage", name: "Dapur Rasa Nusantara", desc: "Cita rasa autentik masakan Nusantara, disaji hangat setiap hari.", tags: ["fnb"] },
  { slug: "bingkai-cerita", category: "Fotografi & Videografi", name: "Bingkai Cerita", desc: "Abadikan momen pernikahan dan prewedding dalam bingkai visual yang bercerita.", tags: ["kreatif", "jasa"] },
  { slug: "helai-studio", category: "Fashion & Apparel", name: "Helai Studio", desc: "Busana bermaterial pilihan yang menemani gaya keseharian Anda.", tags: ["retail", "kreatif"] },
  { slug: "rupa-lokal", category: "Lifestyle & Kriya", name: "Rupa Lokal", desc: "Brand lifestyle dan kriya buatan tangan yang mengangkat karya lokal.", tags: ["retail", "kreatif"] },
  { slug: "arah-konsultan", category: "Konsultan Bisnis & Pajak", name: "Arah Konsultan", desc: "Pendampingan bisnis, manajemen, dan pajak untuk usaha yang siap tumbuh.", tags: ["jasa", "edukasi"] },
];

const filters = [
  { label: "Semua", value: "semua" },
  { label: "Jasa", value: "jasa" },
  { label: "F&B", value: "fnb" },
  { label: "Retail", value: "retail" },
  { label: "Kreatif", value: "kreatif" },
  { label: "Kesehatan", value: "kesehatan" },
];

const WA = "https://wa.me/6289501925395?text=Halo%2C+saya+ingin+konsultasi+gratis";

function DemoCard({ demo }: { demo: Demo }) {
  return (
    <Link
      href={`/portofolio/${demo.slug}/index.html`}
      className={`group relative flex h-full flex-col overflow-hidden rounded-lg border bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/45 hover:shadow-card ${
        demo.featured ? "border-accent/35 lg:col-span-1 lg:flex-row" : "border-brand-dark/10"
      }`}
    >
      <div
        className={`relative overflow-hidden bg-brand-dark/5 ${
          demo.featured ? "aspect-[16/10] lg:aspect-auto lg:w-1/2" : "aspect-[16/10]"
        }`}
      >
        <Image
          src={`/portofolio/${demo.slug}/assets/img/gen/hero.jpg`}
          alt={`Demo website ${demo.name}`}
          fill
          className="object-cover"
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
          unoptimized
        />
      </div>
      <div className={`flex flex-1 flex-col p-6 ${demo.featured ? "lg:w-1/2 lg:justify-center lg:p-10" : ""}`}>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-accent">{demo.category}</p>
        <h3
          className={`mb-3 font-extrabold leading-tight text-brand-dark ${
            demo.featured ? "text-2xl" : "text-xl"
          }`}
        >
          {demo.name}
        </h3>
        <p className="flex-1 text-sm leading-relaxed text-brand-dark/60">{demo.desc}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand-dark transition-colors group-hover:text-accent">
          Lihat demo
          <ArrowUpRight size={15} />
        </span>
      </div>
    </Link>
  );
}

export default function PortofolioClient() {
  const [active, setActive] = useState("semua");
  const shown = demos.filter((d) => active === "semua" || d.tags.includes(active));

  return (
    <>
      <Navbar />

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-4 pb-6 pt-28 sm:px-6 lg:px-8 lg:pt-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <span className="text-sm font-bold uppercase tracking-wider text-accent">Portofolio</span>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight text-brand-dark sm:text-5xl lg:text-6xl">
              Bukan sekadar website.{" "}
              <span className="text-accent">Sebuah karakter usaha.</span>
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-brand-dark/60">
              Apa pun industri Anda, kami bangun kehadiran digital yang benar-benar terasa seperti
              bisnis Anda — bukan template seragam.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#galeri"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-bold text-white transition-all duration-200 hover:bg-accent/90 hover:shadow-md"
              >
                Lihat galeri demo
                <ArrowRight size={16} />
              </a>
              <a
                href={WA}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-brand-dark/15 bg-white px-5 py-3 font-bold text-brand-dark transition-colors hover:border-accent/45 hover:text-accent"
              >
                Konsultasi gratis
              </a>
            </div>
          </motion.div>
        </section>

        {/* Galeri */}
        <section id="galeri" className="mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6 lg:px-8">
          <div className="mb-8 max-w-3xl">
            <span className="text-sm font-bold uppercase tracking-wider text-accent">Galeri</span>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-brand-dark sm:text-4xl">
              Pilih sektor, lihat karyanya.
            </h2>
            <p className="mt-4 text-lg text-brand-dark/60">
              Setiap sektor punya bahasa visualnya sendiri — hukum, properti, konstruksi, F&amp;B,
              kecantikan, otomotif, dan lainnya.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {filters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setActive(f.value)}
                  className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    active === f.value
                      ? "border-brand-dark bg-brand-dark text-white"
                      : "border-brand-dark/15 bg-white text-brand-dark/60 hover:border-accent/45 hover:text-brand-dark"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((demo, i) => (
              <motion.div
                key={demo.slug}
                layout
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (i % 6) * 0.05, duration: 0.35 }}
                className={demo.featured ? "sm:col-span-2 lg:col-span-3" : ""}
              >
                <DemoCard demo={demo} />
              </motion.div>
            ))}
          </div>

          <p className="mt-10 text-sm text-brand-dark/50">
            Semua demo di atas hanya untuk keperluan portofolio.
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}
