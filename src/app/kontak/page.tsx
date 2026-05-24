"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Mail, AtSign, Clock, MapPin, CheckCircle, Send } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BlobDecoration from "@/components/ui/BlobDecoration";

const layananOptions = [
  "Website",
  "SEO & Google Maps",
  "Social Media",
  "Branding / Desain Logo",
  "Maintenance Website",
  "Belum tahu",
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
  "Proposal dalam 1×24 jam",
  "Tidak ada tekanan untuk langsung deal",
];

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-brand-dark/12 bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 text-brand-dark placeholder:text-brand-dark/35 transition-all text-sm";

const labelClass = "block text-sm font-semibold text-brand-dark mb-2";

export default function KontakPage() {
  const [form, setForm] = useState({
    nama: "",
    wa: "",
    email: "",
    layanan: "",
    pesan: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const lines = [
      `Halo Teman UMKM Kita!`,
      ``,
      `Nama: ${form.nama}`,
      `No. WA: ${form.wa}`,
      form.email ? `Email: ${form.email}` : null,
      form.layanan ? `Layanan: ${form.layanan}` : null,
      ``,
      `Pesan:`,
      form.pesan || "—",
    ]
      .filter((l) => l !== null)
      .join("\n");
    window.open(`https://wa.me/6289501925395?text=${encodeURIComponent(lines)}`, "_blank");
  }

  return (
    <>
      <Navbar />
      <main className="pt-20">

        {/* ── Header ─────────────────────────────────────────────── */}
        <section className="relative py-16">
          <BlobDecoration position="top-right" size={380} opacity={0.18} shape={1} />

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 px-4 py-1.5 rounded-full mb-6">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-sm font-semibold text-brand-dark">Hubungi Kami</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-dark mb-4 leading-tight">
                Ceritakan kebutuhan<br />
                <span className="text-accent">bisnis Anda.</span>
              </h1>
              <p className="text-brand-dark/60 text-lg max-w-xl mb-6">
                Kami balas dalam 1×24 jam. Konsultasi pertama gratis, tanpa komitmen.
              </p>

              {/* Reassurance chips */}
              <div className="flex flex-wrap gap-3">
                {reassuranceItems.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
                    className="flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-brand-dark/8 px-4 py-2 rounded-full"
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
                <div className="bg-white/80 backdrop-blur-sm border border-brand-dark/8 card-shadow rounded-2xl overflow-hidden">
                  {contactItems.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={i}
                        className={`flex items-center gap-4 px-5 py-4 ${
                          i < contactItems.length - 1 ? "border-b border-brand-dark/6" : ""
                        } ${item.muted ? "opacity-50" : ""}`}
                      >
                        <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
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
                <div className="bg-white/80 backdrop-blur-sm border border-brand-dark/8 card-shadow rounded-2xl p-5">
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
                <div className="flex items-start gap-3 px-5 py-4 bg-white/80 backdrop-blur-sm border border-brand-dark/8 card-shadow rounded-2xl">
                  <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
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
                <div className="bg-white/80 backdrop-blur-sm border border-brand-dark/8 card-shadow rounded-3xl overflow-hidden">
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
                            <option key={opt} value={opt}>{opt}</option>
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
                        className="w-full bg-accent text-white font-bold py-4 rounded-xl text-base hover:bg-accent/90 transition-all duration-200 shadow-lg shadow-accent/20 flex items-center justify-center gap-2"
                      >
                        <Send size={16} />
                        Kirim Pesan
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
            <div className="rounded-3xl overflow-hidden border border-brand-dark/8 card-shadow h-[420px]">
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
    </>
  );
}
