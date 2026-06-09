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
    <section className="relative overflow-hidden pt-28 pb-20 lg:pt-32 lg:pb-24">
      <div className="absolute inset-x-0 top-0 h-px bg-brand-dark/10" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="text-accent font-bold text-sm uppercase tracking-wider mb-4"
            >
              Fokus {proof.primaryServiceAreas}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.5 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brand-dark leading-[1.05] max-w-3xl"
            >
              Jangan Biarkan Kompetitor Muncul Duluan Saat Pelanggan Mencari.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.5 }}
              className="text-lg sm:text-xl text-brand-dark/60 max-w-2xl mt-6 leading-relaxed"
            >
              Teman UMKM Kita bantu kehadiran digital bisnismu terlihat lebih rapi,
              mudah ditemukan, dan layak dipercaya saat calon pelanggan membandingkan pilihan.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24, duration: 0.5 }}
              className="mt-9 flex flex-col sm:flex-row gap-3"
            >
              <a
                href="https://wa.me/6289501925395?text=Halo%2C+saya+ingin+audit+gratis+untuk+bisnis+saya"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-accent text-white font-bold px-6 py-3.5 rounded-lg text-base hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20"
              >
                <MessageCircle size={18} />
                Minta audit gratis
              </a>
              <a
                href="/layanan"
                className="inline-flex items-center justify-center gap-2 text-brand-dark font-bold px-6 py-3.5 rounded-lg border border-brand-dark/15 bg-white hover:border-brand-dark/35 transition-colors"
              >
                <BarChart3 size={18} />
                Lihat paket layanan
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32, duration: 0.5 }}
              className="mt-10 grid grid-cols-3 max-w-xl border border-brand-dark/10 bg-white rounded-lg overflow-hidden"
            >
              {stats.map((item) => (
                <div key={item.label} className="px-4 py-4 border-r border-brand-dark/8 last:border-r-0">
                  <div className="text-2xl sm:text-3xl font-extrabold text-brand-dark tabular-nums">
                    {item.value}
                  </div>
                  <div className="text-xs sm:text-sm text-brand-dark/50 mt-1 leading-snug">
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
            <div className="rounded-lg border border-brand-dark/10 bg-white shadow-card overflow-hidden">
              <div className="border-b border-brand-dark/8 px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-dark/40">Audit snapshot</p>
                  <h2 className="text-lg font-extrabold text-brand-dark mt-0.5">Cek Dulu Yang Bikin Bisnis Kalah Tampil</h2>
                </div>
                <span className="text-xs font-bold text-accent bg-accent/10 px-2.5 py-1 rounded-md">
                  Gratis
                </span>
              </div>

              <div className="p-5 space-y-3">
                {auditItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center gap-3 rounded-lg border border-brand-dark/8 px-4 py-3">
                      <div className="h-9 w-9 rounded-md bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <Icon size={17} className="text-accent" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-bold text-brand-dark">{item.label}</div>
                        <div className="text-xs text-brand-dark/50 mt-0.5">{item.value}</div>
                      </div>
                      <span className="text-[11px] font-bold text-brand-dark/45 bg-brand-dark/5 px-2 py-1 rounded-md">
                        Dicek
                      </span>
                    </div>
                  );
                })}

                <div className="rounded-lg border border-accent/25 bg-accent/10 p-4">
                  <p className="text-sm font-bold text-brand-dark">Prioritasnya sederhana:</p>
                  <p className="text-sm text-brand-dark/65 mt-1 leading-relaxed">
                    bikin bisnismu ditemukan saat orang sudah berniat beli, lalu pastikan tampilannya cukup meyakinkan untuk dihubungi.
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
