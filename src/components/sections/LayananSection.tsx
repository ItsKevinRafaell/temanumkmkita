"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Globe, MapPin, Smartphone, Wrench, PenLine } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const services: {
  IconComponent: LucideIcon;
  title: string;
  desc: string;
  href: string;
  featured?: boolean;
}[] = [
  {
    IconComponent: Globe,
    title: "Web Development",
    desc: "Website profesional yang cepat, SEO-friendly, dan mudah dikelola. Bukan sekadar tampilan — tapi mesin penjualan yang bekerja 24 jam untuk bisnis kamu.",
    href: "/layanan/web-development",
    featured: true,
  },
  {
    IconComponent: MapPin,
    title: "SEO & Google Maps",
    desc: "Muncul di halaman pertama Google dan Maps saat calon pelanggan mencari bisnismu.",
    href: "/layanan/seo-google-maps",
  },
  {
    IconComponent: Smartphone,
    title: "Kelola Sosial Media",
    desc: "Konten konsisten, desain menarik, engagement tumbuh.",
    href: "/layanan/kelola-sosial-media",
  },
  {
    IconComponent: Wrench,
    title: "Maintenance Website",
    desc: "Website tetap aman, cepat, dan up-to-date tanpa pusing teknikal.",
    href: "/layanan/maintenance-website",
  },
  {
    IconComponent: PenLine,
    title: "Desain Logo",
    desc: "Identitas visual yang berkesan, profesional, dan mencerminkan bisnismu.",
    href: "/layanan/desain-logo",
  },
];

function TiltCard({
  service,
  className,
}: {
  service: (typeof services)[0];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-50, 50], [6, -6]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-50, 50], [-6, 6]), { stiffness: 300, damping: 30 });

  function handleMouse(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  }
  function handleLeave() { x.set(0); y.set(0); }

  const { IconComponent } = service;

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      className={className}
    >
      <Link
        href={service.href}
        className={`group flex flex-col h-full bg-white/80 backdrop-blur-sm rounded-2xl border border-brand-dark/8 card-shadow hover:card-shadow-hover hover:-translate-y-1 transition-all duration-300 shine-sweep ${
          service.featured ? "p-8 sm:p-10" : "p-6"
        }`}
      >
        <div className={`rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0 mb-5 ${
          service.featured ? "w-14 h-14" : "w-11 h-11"
        }`}>
          <IconComponent size={service.featured ? 26 : 22} className="text-accent" />
        </div>
        <h3 className={`font-bold text-brand-dark leading-tight mb-3 group-hover:text-accent transition-colors ${
          service.featured ? "text-2xl" : "text-lg"
        }`}>
          {service.title}
        </h3>
        <p className={`text-brand-dark/60 leading-relaxed flex-1 ${
          service.featured ? "text-base" : "text-sm"
        }`}>
          {service.desc}
        </p>
        <span className="mt-4 inline-flex items-center gap-1 text-accent font-bold text-sm group-hover:gap-2 transition-all">
          Pelajari lebih →
        </span>
      </Link>
    </motion.div>
  );
}

export default function LayananSection() {
  const featured = services[0];
  const rest = services.slice(1);

  return (
    <section className="py-24 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-accent font-bold text-sm uppercase tracking-wider">
            Apa yang Kami Lakukan
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-brand-dark mt-3">
            Semua yang kamu butuhkan
            <br />
            <span className="text-accent">untuk hadir online</span>
          </h2>
        </motion.div>

        {/* Bento grid — desktop */}
        <div className="hidden lg:grid lg:grid-cols-3 lg:grid-rows-2 gap-4 auto-rows-fr">
          <motion.div
            className="lg:col-span-1 lg:row-span-2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <TiltCard service={featured} className="h-full" />
          </motion.div>
          {rest.map((service, i) => (
            <motion.div
              key={service.href}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i + 1) * 0.08, duration: 0.5 }}
            >
              <TiltCard service={service} className="h-full" />
            </motion.div>
          ))}
        </div>

        {/* Card grid — mobile/tablet */}
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
          {services.map((service, i) => (
            <motion.div
              key={service.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
            >
              <TiltCard service={service} className="h-full" />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-10 text-center"
        >
          <Link
            href="/layanan"
            className="inline-flex items-center gap-2 border border-brand-dark/20 text-brand-dark font-semibold px-6 py-3 rounded-full hover:border-brand-dark/40 transition-colors"
          >
            Lihat semua layanan →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
