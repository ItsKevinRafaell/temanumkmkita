"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const layananOptions = [
  "Web Development",
  "SEO & Google Maps",
  "Kelola Sosial Media",
  "Maintenance Website",
  "Desain Logo",
  "Lainnya",
];

export default function KontakPage() {
  const [form, setForm] = useState({
    nama: "",
    wa: "",
    layanan: "",
    pesan: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = `Halo Teman UMKM Kita!%0A%0ANama: ${encodeURIComponent(form.nama)}%0ANo. WA: ${encodeURIComponent(form.wa)}%0ALayanan: ${encodeURIComponent(form.layanan)}%0A%0APesan:%0A${encodeURIComponent(form.pesan)}`;
    window.open(`https://wa.me/6289501925395?text=${text}`, "_blank");
  }

  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="py-16 bg-canvas">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-accent font-bold text-sm uppercase tracking-wider">Hubungi Kami</span>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-dark mt-3 mb-4">
                Mulai percakapan<br />
                <span className="text-accent">bersama kami</span>
              </h1>
              <p className="text-brand-dark/60 text-lg">
                Konsultasi gratis, tanpa tekanan. Ceritakan bisnismu dan kami bantu temukan solusinya.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Form + Info */}
        <section className="pb-24 bg-canvas">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Form */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="bg-white rounded-2xl p-8 border border-brand-dark/8 shadow-sm"
              >
                <h2 className="text-2xl font-bold text-brand-dark mb-6">Kirim Pesan</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-brand-dark mb-2">
                      Nama Lengkap *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Nama kamu"
                      value={form.nama}
                      onChange={(e) => setForm({ ...form, nama: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-brand-dark/15 bg-canvas focus:outline-none focus:ring-2 focus:ring-accent/40 text-brand-dark placeholder:text-brand-dark/40"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-brand-dark mb-2">
                      No. WhatsApp *
                    </label>
                    <input
                      required
                      type="tel"
                      placeholder="08xx-xxxx-xxxx"
                      value={form.wa}
                      onChange={(e) => setForm({ ...form, wa: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-brand-dark/15 bg-canvas focus:outline-none focus:ring-2 focus:ring-accent/40 text-brand-dark placeholder:text-brand-dark/40"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-brand-dark mb-2">
                      Layanan yang Diminati *
                    </label>
                    <select
                      required
                      value={form.layanan}
                      onChange={(e) => setForm({ ...form, layanan: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-brand-dark/15 bg-canvas focus:outline-none focus:ring-2 focus:ring-accent/40 text-brand-dark"
                    >
                      <option value="" disabled>Pilih layanan</option>
                      {layananOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-brand-dark mb-2">
                      Ceritakan Bisnismu
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Ceritakan sedikit tentang bisnis kamu dan apa yang ingin kamu capai..."
                      value={form.pesan}
                      onChange={(e) => setForm({ ...form, pesan: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-brand-dark/15 bg-canvas focus:outline-none focus:ring-2 focus:ring-accent/40 text-brand-dark placeholder:text-brand-dark/40 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-accent text-brand-dark font-bold py-4 rounded-xl text-lg hover:bg-accent/90 hover:scale-[1.01] transition-all duration-200 shadow-lg shadow-accent/20"
                  >
                    Kirim via WhatsApp →
                  </button>

                  <p className="text-center text-brand-dark/40 text-xs">
                    Kamu akan diarahkan ke WhatsApp. Respons biasanya dalam 1–2 jam kerja.
                  </p>
                </form>
              </motion.div>

              {/* Info kontak */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-brand-dark mb-6">Informasi Kontak</h2>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-brand-dark/8">
                  <div className="text-2xl mb-3">📱</div>
                  <h3 className="font-bold text-brand-dark mb-1">WhatsApp</h3>
                  <p className="text-brand-dark/60 text-sm mb-3">
                    Cara tercepat untuk menghubungi kami. Respons dalam jam kerja.
                  </p>
                  <a
                    href="https://wa.me/6289501925395"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent font-bold hover:underline"
                  >
                    +62 895-0192-5395
                  </a>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-brand-dark/8">
                  <div className="text-2xl mb-3">🌐</div>
                  <h3 className="font-bold text-brand-dark mb-1">Website</h3>
                  <p className="text-brand-dark/60 text-sm mb-3">
                    Jelajahi layanan dan portofolio kami.
                  </p>
                  <a
                    href="https://temanumkmkita.com"
                    className="text-accent font-bold hover:underline"
                  >
                    temanumkmkita.com
                  </a>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-brand-dark/8">
                  <div className="text-2xl mb-3">⏰</div>
                  <h3 className="font-bold text-brand-dark mb-2">Jam Operasional</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between text-brand-dark/70">
                      <span>Senin – Jumat</span>
                      <span className="font-semibold text-brand-dark">08.00 – 17.00 WIB</span>
                    </div>
                    <div className="flex justify-between text-brand-dark/70">
                      <span>Sabtu</span>
                      <span className="font-semibold text-brand-dark">09.00 – 14.00 WIB</span>
                    </div>
                    <div className="flex justify-between text-brand-dark/70">
                      <span>Minggu</span>
                      <span className="font-semibold text-brand-dark/40">Tutup</span>
                    </div>
                  </div>
                </div>

                <div className="bg-accent/10 border border-accent/30 rounded-2xl p-6">
                  <div className="text-2xl mb-3">🎁</div>
                  <h3 className="font-bold text-brand-dark mb-2">Konsultasi Gratis</h3>
                  <p className="text-brand-dark/70 text-sm">
                    Sesi konsultasi pertama selalu gratis. Tidak ada tekanan, tidak ada kewajiban membeli.
                    Kami di sini untuk bantu kamu menemukan solusi terbaik.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
