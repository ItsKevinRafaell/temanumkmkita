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
    <section ref={ref} className="relative py-24 bg-canvas">
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="grid lg:grid-cols-[1fr_auto] gap-10 items-center rounded-lg border border-accent/25 bg-white p-6 sm:p-8 lg:p-10 shadow-card"
        >
          <div>
            <span className="text-accent font-bold text-sm uppercase tracking-wider">
              Audit gratis
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-dark mt-3 leading-tight max-w-3xl">
              Cari Tahu Dulu Kenapa Bisnismu Belum Cukup Kelihatan Online.
            </h2>
            <p className="text-brand-dark/60 text-lg mt-5 max-w-2xl leading-relaxed">
              Ceritakan kondisi bisnismu. Kami bantu petakan masalah paling prioritas
              sebelum bicara paket, supaya keputusanmu tidak asal ikut-ikutan.
            </p>
          </div>

          <div className="lg:min-w-[320px] rounded-lg border border-brand-dark/10 bg-canvas p-5">
            <a
              href="https://wa.me/6289501925395?text=Halo%2C+saya+ingin+audit+gratis+untuk+bisnis+saya"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 bg-accent text-white font-bold px-6 py-3.5 rounded-lg text-base hover:bg-accent/90 transition-colors"
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
