"use client";

import { motion } from "framer-motion";
import { BarChart3, MapPin, MessageCircle, Search, ShieldCheck, Smartphone } from "lucide-react";
import type { HomepageProof } from "@/lib/site-proof";

interface Props {
  proof: HomepageProof;
}

const auditItems = [
  { icon: Search, label: "Pencarian Google", value: "SEO dasar & keyword lokal" },
  { icon: MapPin, label: "Google Maps", value: "Profil, foto, review, area" },
  { icon: Smartphone, label: "Sosial media", value: "Konsistensi konten" },
  { icon: ShieldCheck, label: "Website", value: "Trust, speed, CTA" },
];

export default function HeroSection({ proof }: Props) {
  const stats = [
    { value: proof.clientsActive, label: "Klien aktif" },
    { value: proof.projectsCompleted, label: "Proyek lintas layanan" },
    { value: proof.foundedYear, label: "Mulai bantu UMKM" },
  ];

  return (
    <section className="relative overflow-hidden pb-20 pt-28 lg:pb-24 lg:pt-32">
      <div className="absolute inset-x-0 top-0 h-px bg-brand-dark/10" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="mb-4 text-sm font-bold uppercase tracking-wider text-accent"
            >
              Fokus {proof.primaryServiceAreas}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.5 }}
              className="max-w-3xl text-4xl font-extrabold leading-[1.05] text-brand-dark sm:text-5xl lg:text-6xl"
            >
              Jangan Biarkan Kompetitor Muncul Duluan Saat Pelanggan Mencari.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.5 }}
              className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-dark/60 sm:text-xl"
            >
              Teman UMKM Kita bantu kehadiran digital bisnismu terlihat lebih rapi, mudah ditemukan,
              dan layak dipercaya saat calon pelanggan membandingkan pilihan.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24, duration: 0.5 }}
              className="mt-9 flex flex-col gap-3 sm:flex-row"
            >
              <a
                href="https://wa.me/6289501925395?text=Halo%2C+saya+ingin+audit+gratis+untuk+bisnis+saya"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-accent/20 transition-colors hover:bg-accent/90"
              >
                <MessageCircle size={18} />
                Minta audit gratis
              </a>
              <a
                href="/layanan"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-brand-dark/15 bg-white px-6 py-3.5 font-bold text-brand-dark transition-colors hover:border-brand-dark/35"
              >
                <BarChart3 size={18} />
                Lihat paket layanan
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32, duration: 0.5 }}
              className="mt-10 grid max-w-xl grid-cols-3 overflow-hidden rounded-lg border border-brand-dark/10 bg-white"
            >
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="border-brand-dark/8 border-r px-4 py-4 last:border-r-0"
                >
                  <div className="text-2xl font-extrabold tabular-nums text-brand-dark sm:text-3xl">
                    {item.value}
                  </div>
                  <div className="mt-1 text-xs leading-snug text-brand-dark/50 sm:text-sm">
                    {item.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.55 }}
            className="relative"
          >
            <div className="overflow-hidden rounded-lg border border-brand-dark/10 bg-white shadow-card">
              <div className="border-brand-dark/8 flex items-center justify-between border-b px-5 py-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-dark/40">
                    Audit snapshot
                  </p>
                  <h2 className="mt-0.5 text-lg font-extrabold text-brand-dark">
                    Cek Dulu Yang Bikin Bisnis Kalah Tampil
                  </h2>
                </div>
                <span className="rounded-md bg-accent/10 px-2.5 py-1 text-xs font-bold text-accent">
                  Gratis
                </span>
              </div>

              <div className="space-y-3 p-5">
                {auditItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="border-brand-dark/8 flex items-center gap-3 rounded-lg border px-4 py-3"
                    >
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-accent/10">
                        <Icon size={17} className="text-accent" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-bold text-brand-dark">{item.label}</div>
                        <div className="mt-0.5 text-xs text-brand-dark/50">{item.value}</div>
                      </div>
                      <span className="rounded-md bg-brand-dark/5 px-2 py-1 text-[11px] font-bold text-brand-dark/45">
                        Dicek
                      </span>
                    </div>
                  );
                })}

                <div className="rounded-lg border border-accent/25 bg-accent/10 p-4">
                  <p className="text-sm font-bold text-brand-dark">Prioritasnya sederhana:</p>
                  <p className="mt-1 text-sm leading-relaxed text-brand-dark/65">
                    bikin bisnismu ditemukan saat orang sudah berniat beli, lalu pastikan
                    tampilannya cukup meyakinkan untuk dihubungi.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
