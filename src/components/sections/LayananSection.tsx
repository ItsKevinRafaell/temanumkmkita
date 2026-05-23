"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";

const services = [
  {
    icon: "🌐",
    title: "Web Development",
    desc: "Website profesional yang cepat, SEO-friendly, dan mudah dikelola. Bukan sekadar tampilan — tapi mesin penjualan.",
    href: "/layanan/web-development",
    color: "from-blue-50 to-blue-100/50",
  },
  {
    icon: "📍",
    title: "SEO & Google Maps",
    desc: "Muncul di halaman pertama Google dan Google Maps saat calon pelanggan mencari bisnismu.",
    href: "/layanan/seo-google-maps",
    color: "from-green-50 to-green-100/50",
  },
  {
    icon: "📲",
    title: "Kelola Sosial Media",
    desc: "Konten konsisten, desain menarik, engagement tumbuh. Kamu fokus bisnis, kami yang urus sosmed.",
    href: "/layanan/kelola-sosial-media",
    color: "from-purple-50 to-purple-100/50",
  },
  {
    icon: "🔧",
    title: "Maintenance Website",
    desc: "Website kamu tetap aman, cepat, dan up-to-date tanpa perlu pusing soal teknikal.",
    href: "/layanan/maintenance-website",
    color: "from-orange-50 to-orange-100/50",
  },
  {
    icon: "✏️",
    title: "Desain Logo",
    desc: "Identitas visual yang mencerminkan nilai dan kepribadian bisnismu. Berkesan, profesional, dan unik.",
    href: "/layanan/desain-logo",
    color: "from-pink-50 to-pink-100/50",
  },
];

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-50, 50], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-50, 50], [-8, 8]), { stiffness: 300, damping: 30 });

  function handleMouse(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group"
    >
      <div className={`bg-gradient-to-br ${service.color} rounded-2xl p-8 border border-brand-dark/8 h-full shine-sweep cursor-pointer hover:shadow-lg transition-shadow duration-300`}>
        <div className="text-4xl mb-4">{service.icon}</div>
        <h3 className="font-bold text-brand-dark text-xl mb-3">{service.title}</h3>
        <p className="text-brand-dark/60 leading-relaxed text-sm mb-6">{service.desc}</p>
        <Link
          href={service.href}
          className="inline-flex items-center gap-1 text-accent font-bold text-sm hover:gap-2 transition-all"
        >
          Pelajari lebih →
        </Link>
      </div>
    </motion.div>
  );
}

export default function LayananSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-accent font-bold text-sm uppercase tracking-wider">Apa yang Kami Lakukan</span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-brand-dark mt-3">
            Semua yang kamu butuhkan<br />
            <span className="text-accent">untuk hadir online</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <ServiceCard key={service.href} service={service} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
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
