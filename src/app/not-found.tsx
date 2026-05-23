"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BlobDecoration from "@/components/ui/BlobDecoration";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <BlobDecoration position="top-right" size={400} opacity={0.2} shape={1} />
        <BlobDecoration position="bottom-left" size={300} opacity={0.15} shape={2} />

        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 px-4 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-sm font-semibold text-brand-dark">Halaman Tidak Ditemukan</span>
            </div>

            <div className="text-[160px] sm:text-[200px] font-extrabold text-brand-dark/6 leading-none select-none">
              404
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-dark mt-2 mb-4">
              Waduh, salah jalan!
            </h1>
            <p className="text-brand-dark/60 text-lg mb-10 max-w-md mx-auto">
              Halaman yang kamu cari tidak ada atau sudah dipindahkan. Yuk balik ke jalur yang benar.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/"
                className="bg-accent text-white font-bold px-8 py-4 rounded-full text-base hover:bg-accent/90 hover:scale-105 transition-all duration-200 shadow-lg shadow-accent/30"
              >
                Kembali ke Beranda
              </Link>
              <Link
                href="/layanan/web-development"
                className="text-brand-dark font-semibold px-8 py-4 rounded-full border border-brand-dark/20 hover:border-brand-dark/40 transition-colors"
              >
                Lihat Layanan
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
