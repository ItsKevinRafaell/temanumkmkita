"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Clock, MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import { DEFAULT_HOMEPAGE_PROOF, type HomepageProof } from "@/lib/site-proof";

interface Props {
  proof?: HomepageProof;
}

export default function CTASection({ proof = DEFAULT_HOMEPAGE_PROOF }: Props) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="relative bg-canvas py-24">
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="grid items-center gap-10 rounded-lg border border-accent/25 bg-white p-6 shadow-card sm:p-8 lg:grid-cols-[1fr_auto] lg:p-10"
        >
          <div>
            <span className="text-sm font-bold uppercase tracking-wider text-accent">
              Audit gratis
            </span>
            <h2 className="mt-3 max-w-3xl text-3xl font-extrabold leading-tight text-brand-dark sm:text-4xl lg:text-5xl">
              Cari Tahu Dulu Kenapa Bisnismu Belum Cukup Kelihatan Online.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-brand-dark/60">
              Ceritakan kondisi bisnismu. Kami bantu petakan masalah paling prioritas sebelum bicara
              paket, supaya keputusanmu tidak asal ikut-ikutan.
            </p>
          </div>

          <div className="rounded-lg border border-brand-dark/10 bg-canvas p-5 lg:min-w-[320px]">
            <a
              href="https://wa.me/6289501925395?text=Halo%2C+saya+ingin+audit+gratis+untuk+bisnis+saya"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-base font-bold text-white transition-colors hover:bg-accent/90"
            >
              <MessageCircle size={18} />
              Minta audit via WhatsApp
            </a>

            <div className="mt-5 space-y-3 text-sm text-brand-dark/65">
              <span className="flex items-center gap-2">
                <Clock size={15} className="text-accent" /> {proof.responseTime}
              </span>
              <span className="flex items-center gap-2">
                <MapPin size={15} className="text-accent" /> Fokus {proof.primaryServiceAreas}
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck size={15} className="text-accent" /> Konsultasi awal tanpa komitmen
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
