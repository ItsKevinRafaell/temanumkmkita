"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Globe, MapPin, Smartphone, Wrench, PenLine, ChevronRight } from "lucide-react";
import type { ServiceData } from "@/lib/data/services";

const iconMap: Record<string, React.ElementType> = {
  "web-development": Globe,
  "seo-google-maps": MapPin,
  "kelola-sosial-media": Smartphone,
  "maintenance": Wrench,
  "desain-logo": PenLine,
};

interface Props {
  service: ServiceData;
}

export default function ServiceHero({ service }: Props) {
  const IconComponent = iconMap[service.slug] || Globe;

  return (
    <section className="relative overflow-hidden bg-canvas pt-28 pb-20">
      <div className="absolute inset-x-0 top-0 h-px bg-brand-dark/10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 text-sm text-brand-dark/40 mb-8">
            <Link href="/" className="hover:text-brand-dark transition-colors">Beranda</Link>
            <ChevronRight size={14} />
            <Link href="/layanan" className="hover:text-brand-dark transition-colors">Layanan</Link>
            <ChevronRight size={14} />
            <span className="text-brand-dark/70 font-medium">{service.title}</span>
          </div>

          <div className="w-14 h-14 bg-accent/10 rounded-md flex items-center justify-center mb-5">
            <IconComponent size={32} className="text-accent" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brand-dark mb-6 leading-tight max-w-3xl"
        >
          {service.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-xl text-brand-dark/60 mb-4 max-w-2xl leading-relaxed"
        >
          {service.hook}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-brand-dark/50 max-w-2xl leading-relaxed"
        >
          {service.empathy}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-8"
        >
          <a
            href={`https://wa.me/6289501925395?text=Halo%2C+saya+tertarik+dengan+layanan+${encodeURIComponent(service.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-accent text-white font-bold px-6 py-3.5 rounded-lg text-base hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20 inline-block"
          >
            Konsultasi Gratis →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
