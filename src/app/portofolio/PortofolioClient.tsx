"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Globe } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import type { PublicPortfolioItem } from "@/lib/api/portfolio";

const WA = "https://wa.me/6289501925395?text=Halo%2C+saya+ingin+konsultasi+gratis";

// Peta kategori DB -> grup filter. Fleksibel: apa pun yg tak terpeta masuk "lainnya".
function groupOf(category: string | null): string {
  const c = (category || "").toLowerCase();
  if (/(f&b|kuliner|resto|makan|coffee|kopi|minum)/.test(c)) return "fnb";
  if (/(retail|brand|fashion|studio|kriya|toko)/.test(c)) return "retail";
  if (/(foto|video|desain|logo|kreatif|percetak|cetak)/.test(c)) return "kreatif";
  if (/(klinik|kecantikan|kesehatan|estetika|medis)/.test(c)) return "kesehatan";
  return "jasa";
}

// Normalisasi link: /porto/ lama -> /portofolio/.../index.html; eksternal apa adanya.
function resolveLink(link: string | null): { href: string; external: boolean } {
  if (!link) return { href: "#", external: false };
  if (/^https?:\/\//.test(link)) return { href: link, external: true };
  let path = link;
  if (path.startsWith("/porto/")) path = path.replace("/porto/", "/portofolio/");
  path = path.replace(/\/$/, "");
  if (!path.endsWith(".html")) path = `${path}/index.html`;
  return { href: path, external: false };
}

function DemoCard({ item, featured }: { item: PublicPortfolioItem; featured: boolean }) {
  const { href, external } = resolveLink(item.link_url);
  const inner = (
    <>
      <div
        className={`relative overflow-hidden bg-brand-dark/5 ${
          featured ? "aspect-[16/10] lg:aspect-auto lg:w-1/2" : "aspect-[16/10]"
        }`}
      >
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={`Portofolio ${item.title}`}
            fill
            className="object-cover"
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Globe className="text-brand-dark/15" size={40} />
          </div>
        )}
      </div>
      <div className={`flex flex-1 flex-col p-6 ${featured ? "lg:w-1/2 lg:justify-center lg:p-10" : ""}`}>
        {item.category && (
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-accent">{item.category}</p>
        )}
        <h3 className={`mb-3 font-extrabold leading-tight text-brand-dark ${featured ? "text-2xl" : "text-xl"}`}>
          {item.title}
        </h3>
        <p className="flex-1 text-sm leading-relaxed text-brand-dark/60">
          {external ? "Website klien yang sudah live." : "Demo website untuk sektor ini."}
        </p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand-dark transition-colors group-hover:text-accent">
          {external ? "Kunjungi website" : "Lihat demo"}
          <ArrowUpRight size={15} />
        </span>
      </div>
    </>
  );

  const cardCls = `group relative flex h-full flex-col overflow-hidden rounded-lg border bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/45 hover:shadow-card ${
    featured ? "border-accent/35 lg:flex-row" : "border-brand-dark/10"
  }`;

  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cardCls}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cardCls}>
      {inner}
    </Link>
  );
}

export default function PortofolioClient({ items }: { items: PublicPortfolioItem[] }) {
  const [active, setActive] = useState("semua");

  const sorted = useMemo(
    () => [...items].sort((a, b) => a.sort_order - b.sort_order),
    [items]
  );

  // Filter hanya tampilkan grup yg benar-benar ada di data.
  const filters = useMemo(() => {
    const base = [
      { label: "Semua", value: "semua" },
      { label: "Jasa", value: "jasa" },
      { label: "F&B", value: "fnb" },
      { label: "Retail", value: "retail" },
      { label: "Kreatif", value: "kreatif" },
      { label: "Kesehatan", value: "kesehatan" },
    ];
    const present = new Set(sorted.map((i) => groupOf(i.category)));
    return base.filter((f) => f.value === "semua" || present.has(f.value));
  }, [sorted]);

  const shown = useMemo(
    () => sorted.filter((i) => active === "semua" || groupOf(i.category) === active),
    [sorted, active]
  );

  return (
    <>
      <Navbar />

      <main>
        <section className="mx-auto max-w-7xl px-4 pb-6 pt-28 sm:px-6 lg:px-8 lg:pt-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <span className="text-sm font-bold uppercase tracking-wider text-accent">Portofolio</span>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight text-brand-dark sm:text-5xl lg:text-6xl">
              Bukan sekadar website. <span className="text-accent">Sebuah karakter usaha.</span>
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
                Lihat galeri <ArrowRight size={16} />
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

        <section id="galeri" className="mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6 lg:px-8">
          <div className="mb-8 max-w-3xl">
            <span className="text-sm font-bold uppercase tracking-wider text-accent">Galeri</span>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-brand-dark sm:text-4xl">
              Pilih sektor, lihat karyanya.
            </h2>
            <p className="mt-4 text-lg text-brand-dark/60">
              Setiap sektor punya bahasa visualnya sendiri — dari demo lintas industri sampai website
              klien yang sudah live.
            </p>
            {filters.length > 1 && (
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
            )}
          </div>

          {shown.length === 0 ? (
            <p className="text-brand-dark/50">Belum ada portofolio pada kategori ini.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((item, i) => {
                const featured = i === 0 && active === "semua";
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (i % 6) * 0.05, duration: 0.35 }}
                    className={featured ? "sm:col-span-2 lg:col-span-3" : ""}
                  >
                    <DemoCard item={item} featured={featured} />
                  </motion.div>
                );
              })}
            </div>
          )}

          <p className="mt-10 text-sm text-brand-dark/50">
            Demo bertanda sektor dibuat untuk keperluan portofolio. Website klien menautkan ke situs asli.
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}
