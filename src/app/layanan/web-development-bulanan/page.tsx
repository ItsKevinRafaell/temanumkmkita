"use client";

import { motion } from "framer-motion";
import { Globe, MessageCircle, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BlobDecoration from "@/components/ui/BlobDecoration";

const WA_BASE = "https://wa.me/6289501925395?text=";

export default function WebDevelopmentBulananPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="relative min-h-[70vh] flex items-center">
          <BlobDecoration position="top-right" size={400} opacity={0.18} shape={1} />
          <BlobDecoration position="bottom-left" size={320} opacity={0.12} shape={2} />

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
            {/* Breadcrumb */}
            <div className="flex items-center justify-center gap-1.5 text-xs text-brand-dark/40 font-medium mb-10">
              <Link href="/" className="hover:text-brand-dark transition-colors">Beranda</Link>
              <ChevronRight size={12} />
              <Link href="/layanan/web-development" className="hover:text-brand-dark transition-colors">Layanan</Link>
              <ChevronRight size={12} />
              <span className="text-brand-dark/70">Web Development Bulanan</span>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 px-4 py-1.5 rounded-full mb-8">
                <Globe size={13} className="text-accent" />
                <span className="text-sm font-semibold text-brand-dark">Web Development · Bulanan</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-dark leading-tight mb-6">
                Paket bulanan<br />
                <span className="text-accent">segera hadir.</span>
              </h1>

              <p className="text-brand-dark/60 text-lg max-w-xl mx-auto mb-10">
                Kami sedang menyiapkan paket berlangganan bulanan yang lebih fleksibel.
                Sementara itu, cek paket tahunan kami yang sudah tersedia.
              </p>

              {/* Info chip */}
              <div className="inline-flex items-center gap-2.5 bg-white/70 backdrop-blur-sm border border-brand-dark/8 px-5 py-3 rounded-full mb-12">
                <Clock size={14} className="text-accent" />
                <span className="text-sm font-semibold text-brand-dark/70">Coming soon</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/layanan/web-development"
                  className="inline-flex items-center gap-2.5 bg-accent text-white font-bold px-8 py-3.5 rounded-full text-sm hover:bg-accent/90 hover:scale-105 transition-all duration-200 shadow-lg shadow-accent/20"
                >
                  <Globe size={15} />
                  Lihat Paket Tahunan
                </Link>
                <a
                  href={WA_BASE + encodeURIComponent("Halo, saya tertarik dengan paket Web Development bulanan. Kapan tersedia?")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 border border-brand-dark/15 text-brand-dark/70 font-bold px-8 py-3.5 rounded-full text-sm hover:border-accent hover:text-accent transition-all duration-200"
                >
                  <MessageCircle size={15} />
                  Notifikasi via WhatsApp
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
