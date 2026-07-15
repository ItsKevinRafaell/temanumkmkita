"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-x-0 top-16 h-px bg-brand-dark/10" />

        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="mb-5 text-sm font-bold uppercase tracking-wider text-accent">
              Halaman Tidak Ditemukan
            </p>

            <div className="text-brand-dark/6 select-none text-[160px] font-extrabold leading-none sm:text-[200px]">
              404
            </div>

            <h1 className="mb-4 mt-2 text-4xl font-extrabold text-brand-dark sm:text-5xl">
              Waduh, Salah Jalan!
            </h1>
            <p className="mx-auto mb-10 max-w-md text-lg text-brand-dark/60">
              Halaman yang kamu cari tidak ada atau sudah dipindahkan. Yuk balik ke jalur yang
              benar.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/"
                className="rounded-lg bg-accent px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-accent/20 transition-colors hover:bg-accent/90"
              >
                Kembali ke Beranda
              </Link>
              <Link
                href="/layanan/web-development"
                className="rounded-lg border border-brand-dark/20 px-6 py-3.5 font-semibold text-brand-dark transition-colors hover:border-brand-dark/40"
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
