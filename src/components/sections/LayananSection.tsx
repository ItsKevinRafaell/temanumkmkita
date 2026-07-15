"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Globe, MapPin, PenLine, Smartphone, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const services: {
  IconComponent: LucideIcon;
  title: string;
  label: string;
  desc: string;
  href: string;
  featured?: boolean;
}[] = [
  {
    IconComponent: Globe,
    title: "Web Development",
    label: "Biar bisnis terlihat kredibel",
    desc: "Website cepat, jelas, mobile-friendly, dan siap jadi pusat informasi saat calon pelanggan membandingkan kamu dengan kompetitor.",
    href: "/layanan/web-development",
    featured: true,
  },
  {
    IconComponent: MapPin,
    title: "SEO & Google Maps",
    label: "Biar muncul saat dicari",
    desc: "Optimasi pencarian lokal, Google Business Profile, dan konten agar bisnis lebih mudah ditemukan di area target.",
    href: "/layanan/seo-google-maps",
  },
  {
    IconComponent: Smartphone,
    title: "Kelola Sosial Media",
    label: "Biar brand tetap hidup",
    desc: "Rencana konten, desain visual, caption, dan jadwal posting supaya akun tidak terlihat kosong saat dicek pelanggan.",
    href: "/layanan/kelola-sosial-media",
  },
  {
    IconComponent: Wrench,
    title: "Maintenance Website",
    label: "Biar website tetap aman",
    desc: "Monitoring, update, backup, dan perbaikan teknis supaya website tidak jadi beban operasional.",
    href: "/layanan/maintenance",
  },
  {
    IconComponent: PenLine,
    title: "Desain Logo",
    label: "Biar brand lebih mudah diingat",
    desc: "Identitas visual yang rapi dan siap dipakai untuk website, sosial media, kemasan, dan materi promosi.",
    href: "/layanan/desain-logo",
  },
];

function ServiceCard({
  service,
  className,
}: {
  service: (typeof services)[0];
  className?: string;
}) {
  const { IconComponent } = service;

  return (
    <Link
      href={service.href}
      className={`group flex h-full flex-col rounded-lg border bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/45 hover:shadow-card ${
        service.featured ? "border-accent/35" : "border-brand-dark/10"
      } ${className ?? ""}`}
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-accent/10">
          <IconComponent size={21} className="text-accent" />
        </div>
        {service.featured && (
          <span className="rounded-md bg-accent/10 px-2.5 py-1 text-[11px] font-bold text-accent">
            Prioritas
          </span>
        )}
      </div>
      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-accent">{service.label}</p>
      <h3
        className={`mb-3 font-extrabold leading-tight text-brand-dark ${
          service.featured ? "text-2xl" : "text-xl"
        }`}
      >
        {service.title}
      </h3>
      <p className="flex-1 text-sm leading-relaxed text-brand-dark/60">{service.desc}</p>
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand-dark transition-colors group-hover:text-accent">
        Lihat detail
        <ArrowRight size={15} />
      </span>
    </Link>
  );
}

export default function LayananSection() {
  const featured = services[0];
  const rest = services.slice(1);

  return (
    <section className="bg-canvas py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 max-w-3xl"
        >
          <span className="text-sm font-bold uppercase tracking-wider text-accent">Layanan</span>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight text-brand-dark sm:text-4xl lg:text-5xl">
            Pilih Titik Yang Paling Bikin Bisnismu Tertinggal Online.
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-brand-dark/60">
            Mulai dari yang paling urgent dulu. Setelah audit, kami bantu tentukan apakah kamu butuh
            website, Maps, konten, maintenance, atau identitas brand.
          </p>
        </motion.div>

        <div className="hidden auto-rows-fr gap-4 lg:grid lg:grid-cols-3 lg:grid-rows-2">
          <motion.div
            className="lg:col-span-1 lg:row-span-2"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <ServiceCard service={featured} className="min-h-[390px]" />
          </motion.div>
          {rest.map((service, i) => (
            <motion.div
              key={service.href}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i + 1) * 0.06, duration: 0.45 }}
            >
              <ServiceCard service={service} />
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
          {services.map((service, i) => (
            <motion.div
              key={service.href}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.35 }}
            >
              <ServiceCard service={service} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-9"
        >
          <Link
            href="/layanan"
            className="inline-flex items-center gap-2 rounded-lg border border-brand-dark/15 bg-white px-5 py-3 font-bold text-brand-dark transition-colors hover:border-accent/45 hover:text-accent"
          >
            Bandingkan semua layanan
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
