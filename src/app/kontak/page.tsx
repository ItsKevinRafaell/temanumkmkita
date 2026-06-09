"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Mail, AtSign, Clock, MapPin, CheckCircle, Send, ChevronRight } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://api.temanumkmkita.com";

const layananOptions: { value: string; label: string }[] = [
  { value: "web_development", label: "Web Development" },
  { value: "seo_google_maps", label: "SEO & Google Maps" },
  { value: "kelola_sosial_media", label: "Kelola Sosial Media" },
  { value: "maintenance_website", label: "Maintenance Website" },
  { value: "desain_logo", label: "Desain Logo" },
];

const contactItems = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+62 895-0192-5395",
    href: "https://wa.me/6289501925395",
    cta: "Hubungi",
    ctaStyle: "bg-[#25D366] text-white",
  },
  {
    icon: Mail,
    label: "Email",
    value: "sales@temanumkmkita.com",
    href: "mailto:sales@temanumkmkita.com",
    cta: null,
  },
  {
    icon: AtSign,
    label: "Instagram",
    value: "@temanumkmkita",
    href: "https://instagram.com/temanumkmkita",
    cta: null,
    muted: true,
  },
];

const reassuranceItems = [
  "Konsultasi gratis, tanpa syarat",
  "Berusaha balas dalam 24 jam",
  "Tidak ada tekanan untuk langsung deal",
];

const inputClass =
  "w-full px-4 py-3 rounded-lg border border-brand-dark/12 bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 text-brand-dark placeholder:text-brand-dark/35 transition-all text-sm";

const labelClass = "block text-sm font-semibold text-brand-dark mb-2";

export default function KontakPage() {
  const [form, setForm] = useState({
    nama: "",
    wa: "",
    email: "",
    layanan: "",
    pesan: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nama.trim() || !form.wa.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/contact-form`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.nama,
          phone: form.wa,
          email: form.email || null,
          service: form.layanan || null,
          message: form.pesan || null,
        }),
      });
      if (!res.ok) throw new Error("Gagal mengirim");
      setToast({ message: "Pesan terkirim! Tim kami akan segera menghubungi Anda.", type: "success" });
      setForm({ nama: "", wa: "", email: "", layanan: "", pesan: "" });
    } catch {
      setToast({ message: "Gagal mengirim pesan. Silakan coba lagi atau hubungi via WhatsApp.", type: "error" });
    } finally {
      setSubmitting(false);
      setTimeout(() => setToast(null), 5000);
    }
  }

  return (
    <>
      <Navbar />
      <main className="pt-20">

        {/* ── Header ─────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-12 pb-12">
          <div className="absolute inset-x-0 top-0 h-px bg-brand-dark/10" />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-1.5 text-xs text-brand-dark/40 font-medium mb-8">
              <Link href="/" className="hover:text-brand-dark transition-colors">Beranda</Link>
              <ChevronRight size={12} />
              <span className="text-brand-dark/70">Kontak</span>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-accent font-bold text-sm uppercase tracking-wider mb-4">
                Kontak Teman UMKM Kita
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brand-dark mb-5 leading-tight max-w-3xl">
                Ceritakan Kebutuhan Bisnis Anda.
              </h1>
              <p className="text-brand-dark/60 text-lg max-w-2xl mb-8 leading-relaxed">
                Mulai dari kondisi bisnismu sekarang. Kami bantu petakan kebutuhan digital yang paling prioritas sebelum bicara paket.
              </p>

              <div className="grid sm:grid-cols-3 gap-3 max-w-3xl">
                {reassuranceItems.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
                    className="flex items-start gap-2 bg-white border border-brand-dark/8 px-4 py-3 rounded-lg"
                  >
                    <CheckCircle size={13} className="text-accent flex-shrink-0" />
                    <span className="text-brand-dark/70 text-sm font-medium">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Main 2-col ─────────────────────────────────────────── */}
        <section className="pb-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-5 gap-10 items-start">

              {/* Left — info (2/5) */}
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="lg:col-span-2 space-y-4"
              >
                {/* Contact channels */}
                <div className="bg-white border border-brand-dark/8 card-shadow rounded-lg overflow-hidden">
                  {contactItems.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={i}
                        className={`flex items-center gap-4 px-5 py-4 ${
                          i < contactItems.length - 1 ? "border-b border-brand-dark/6" : ""
                        } ${item.muted ? "opacity-50" : ""}`}
                      >
                        <div className="w-9 h-9 rounded-md bg-accent/10 flex items-center justify-center flex-shrink-0">
                          <Icon size={16} className="text-accent" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-brand-dark/40 font-medium uppercase tracking-wider mb-0.5">
                            {item.label}
                          </div>
                          <div className="text-sm font-semibold text-brand-dark truncate">
                            {item.href ? (
                              <a
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-accent transition-colors"
                              >
                                {item.value}
                              </a>
                            ) : (
                              item.value
                            )}
                          </div>
                        </div>
                        {item.cta && (
                          <a
                            href={item.href!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-xs font-bold px-3 py-1.5 rounded-lg flex-shrink-0 ${item.ctaStyle}`}
                          >
                            {item.cta}
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Hours */}
                <div className="bg-white border border-brand-dark/8 card-shadow rounded-lg p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock size={15} className="text-accent" />
                    <span className="text-sm font-bold text-brand-dark uppercase tracking-wider">
                      Jam Operasional
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    {[
                      { day: "Senin – Jumat", time: "09.00 – 17.00 WIB" },
                      { day: "Sabtu", time: "09.00 – 13.00 WIB" },
                      { day: "Minggu", time: "Tutup" },
                    ].map((r) => (
                      <div key={r.day} className="flex justify-between">
                        <span className="text-brand-dark/60">{r.day}</span>
                        <span className={`font-semibold ${r.time === "Tutup" ? "text-brand-dark/30" : "text-brand-dark"}`}>
                          {r.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3 px-5 py-4 bg-white border border-brand-dark/8 card-shadow rounded-lg">
                  <div className="w-9 h-9 rounded-md bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin size={16} className="text-accent" />
                  </div>
                  <div>
                    <div className="text-xs text-brand-dark/40 font-medium uppercase tracking-wider mb-0.5">Lokasi</div>
                    <div className="text-sm font-semibold text-brand-dark leading-snug">
                      Jl. Daksa Timur XIV No.6, Sepinggan<br />
                      Balikpapan Selatan, Kota Balikpapan<br />
                      <span className="text-brand-dark/50">Kalimantan Timur 76116</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right — form (3/5) */}
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                className="lg:col-span-3"
              >
                <div className="bg-white border border-brand-dark/8 card-shadow rounded-lg overflow-hidden">
                  <div className="h-1 bg-accent" />

                  <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-5">
                    <div>
                      <h2 className="text-2xl font-extrabold text-brand-dark">Kirim Pesan</h2>
                      <p className="text-brand-dark/50 text-sm mt-1">
                        Isi form ini dan kami akan follow up via WhatsApp.
                      </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className={labelClass}>Nama Lengkap *</label>
                        <input
                          required
                          type="text"
                          placeholder="Nama kamu"
                          value={form.nama}
                          onChange={(e) => setForm({ ...form, nama: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>No. WhatsApp *</label>
                        <input
                          required
                          type="tel"
                          placeholder="08xx-xxxx-xxxx"
                          value={form.wa}
                          onChange={(e) => setForm({ ...form, wa: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className={labelClass}>
                          Email <span className="text-brand-dark/30 font-normal">(opsional)</span>
                        </label>
                        <input
                          type="email"
                          placeholder="email@kamu.com"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Layanan yang Diminati *</label>
                        <select
                          required
                          value={form.layanan}
                          onChange={(e) => setForm({ ...form, layanan: e.target.value })}
                          className={inputClass}
                        >
                          <option value="" disabled>Pilih layanan</option>
                          {layananOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>
                        Pesan <span className="text-brand-dark/30 font-normal">(opsional)</span>
                      </label>
                      <textarea
                        rows={4}
                        placeholder='Contoh: "saya punya toko baju, mau buat website dan muncul di Google Maps..."'
                        value={form.pesan}
                        onChange={(e) => setForm({ ...form, pesan: e.target.value })}
                        className={`${inputClass} resize-none`}
                      />
                    </div>

                    <div className="pt-1">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-accent text-white font-bold py-4 rounded-xl text-base hover:bg-accent/90 transition-all duration-200 shadow-lg shadow-accent/20 flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <Send size={16} />
                        {submitting ? "Mengirim..." : "Kirim Pesan"}
                      </button>
                      <p className="text-center text-brand-dark/35 text-xs mt-3">
                        Kami tidak akan spam. Data Anda aman.
                      </p>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Google Maps ────────────────────────────────────────── */}
        <section className="pb-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-lg overflow-hidden border border-brand-dark/8 card-shadow h-[420px]">
              <iframe
                src="https://maps.google.com/maps?q=Jl.+Daksa+Timur+XIV+No.6+Sepinggan+Balikpapan+Selatan+Balikpapan+Kalimantan+Timur+76116&output=embed&hl=id"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>

      </main>
      <Footer />

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl shadow-lg max-w-md ${
              toast.type === "success"
                ? "bg-green-50 border-2 border-green-400 text-green-800"
                : "bg-red-50 border-2 border-red-400 text-red-800"
            }`}
          >
            <p className="text-sm font-semibold flex items-center gap-2">
              {toast.type === "success" ? <CheckCircle size={16} /> : null}
              {toast.message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
