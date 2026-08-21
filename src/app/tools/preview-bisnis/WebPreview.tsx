"use client";

import { useState } from "react";
import { Phone, MapPin, Star, Menu, ArrowRight, Check } from "lucide-react";

interface Props {
  namaUsaha: string;
  jenisUsaha: string;
  kota: string;
}

/**
 * Preview web usaha — mockup browser frame + landing page ala web beneran,
 * di-render 100% dari data user (nama/jenis/kota). React murni, instan (<1s),
 * TANPA Playwright/screenshot. User bisa ganti style (4 varian palet+layout).
 *
 * Semua ILUSTRATIF: alamat/telepon/rating = contoh tampilan, diberi disclaimer.
 */

interface Style {
  id: string;
  label: string;
  // Warna
  primary: string; // hex — header/CTA
  primaryText: string; // teks di atas primary
  heroFrom: string;
  heroTo: string;
  accentSoft: string; // bg lembut section
  // Karakter layout
  heroAlign: "left" | "center";
  rounded: string; // radius util
}

const STYLES: Style[] = [
  {
    id: "warm",
    label: "Hangat",
    primary: "#f5a700",
    primaryText: "#242423",
    heroFrom: "#fff8ec",
    heroTo: "#ffedcc",
    accentSoft: "#fff8ec",
    heroAlign: "left",
    rounded: "rounded-xl",
  },
  {
    id: "trust",
    label: "Profesional",
    primary: "#1e63d4",
    primaryText: "#ffffff",
    heroFrom: "#eef4ff",
    heroTo: "#dbe8ff",
    accentSoft: "#f2f7ff",
    heroAlign: "center",
    rounded: "rounded-lg",
  },
  {
    id: "fresh",
    label: "Segar",
    primary: "#12a67a",
    primaryText: "#ffffff",
    heroFrom: "#eafaf4",
    heroTo: "#cdf1e3",
    accentSoft: "#f0fbf6",
    heroAlign: "left",
    rounded: "rounded-2xl",
  },
  {
    id: "bold",
    label: "Elegan",
    primary: "#242423",
    primaryText: "#ffffff",
    heroFrom: "#f4f4f5",
    heroTo: "#e4e4e7",
    accentSoft: "#f7f7f8",
    heroAlign: "center",
    rounded: "rounded-md",
  },
];

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export default function WebPreview({ namaUsaha, jenisUsaha, kota }: Props) {
  const [styleId, setStyleId] = useState(STYLES[0].id);
  const s = STYLES.find((x) => x.id === styleId) ?? STYLES[0];

  const nama = namaUsaha.trim() || "Nama Usahamu";
  const jenis = jenisUsaha.trim() || "Jenis Usaha";
  const kotaSafe = kota.trim() || "Kotamu";
  const domain = nama.toLowerCase().replace(/[^a-z0-9]+/g, "") || "usahaku";

  const layanan = [
    { t: `Layanan ${jenis} Terbaik`, d: `Kami melayani kebutuhan ${jenis.toLowerCase()} di ${kotaSafe} dengan kualitas terjaga.` },
    { t: "Harga Bersahabat", d: "Kualitas profesional dengan harga yang pas untuk kebutuhanmu." },
    { t: "Pelayanan Cepat", d: "Respons cepat dan ramah. Kepuasanmu prioritas kami." },
  ];

  return (
    <div className="space-y-3">
      {/* Style switcher */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs font-semibold text-brand-dark/45">Pilih gaya:</span>
        {STYLES.map((st) => (
          <button
            key={st.id}
            type="button"
            onClick={() => setStyleId(st.id)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition-all ${
              styleId === st.id
                ? "border-accent bg-accent/10 text-accent"
                : "border-brand-dark/12 bg-white text-brand-dark/55 hover:border-brand-dark/25"
            }`}
          >
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: st.primary }} />
            {st.label}
          </button>
        ))}
      </div>

      {/* Browser frame */}
      <div className="overflow-hidden rounded-xl border border-brand-dark/10 bg-white shadow-card">
        {/* Chrome bar */}
        <div className="flex items-center gap-2 border-b border-brand-dark/10 bg-brand-dark/[0.03] px-3 py-2.5">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
          </div>
          <div className="ml-2 flex flex-1 items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm ring-1 ring-brand-dark/8">
            <span className="text-[11px] text-brand-dark/40">🔒 www.{domain}.com</span>
          </div>
        </div>

        {/* Rendered mini-site */}
        <div className="max-h-[520px] overflow-y-auto">
          {/* Nav */}
          <div
            className="flex items-center justify-between px-5 py-3.5"
            style={{ backgroundColor: "#ffffff", borderBottom: "1px solid rgba(36,36,35,0.08)" }}
          >
            <div className="flex items-center gap-2">
              <span
                className="flex h-7 w-7 items-center justify-center rounded-md text-xs font-extrabold"
                style={{ backgroundColor: s.primary, color: s.primaryText }}
              >
                {initials(nama)}
              </span>
              <span className="text-sm font-extrabold text-brand-dark">{nama}</span>
            </div>
            <div className="hidden items-center gap-4 text-[11px] font-semibold text-brand-dark/55 sm:flex">
              <span>Beranda</span>
              <span>Layanan</span>
              <span>Tentang</span>
              <span
                className="rounded-full px-3 py-1.5 font-bold"
                style={{ backgroundColor: s.primary, color: s.primaryText }}
              >
                Hubungi Kami
              </span>
            </div>
            <Menu size={18} className="text-brand-dark/40 sm:hidden" />
          </div>

          {/* Hero */}
          <div
            className={`px-6 py-10 ${s.heroAlign === "center" ? "text-center" : "text-left"}`}
            style={{ backgroundImage: `linear-gradient(135deg, ${s.heroFrom}, ${s.heroTo})` }}
          >
            <div className={s.heroAlign === "center" ? "mx-auto max-w-md" : "max-w-lg"}>
              <span
                className="inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider"
                style={{ backgroundColor: s.primary, color: s.primaryText }}
              >
                {jenis} · {kotaSafe}
              </span>
              <h2 className="mt-3 text-2xl font-extrabold leading-tight text-brand-dark sm:text-3xl">
                {nama}
              </h2>
              <p className="mt-2 text-sm text-brand-dark/60">
                Solusi {jenis.toLowerCase()} terpercaya di {kotaSafe}. Pesan sekarang, layanan cepat dan
                berkualitas.
              </p>
              <div className={`mt-4 flex gap-2 ${s.heroAlign === "center" ? "justify-center" : ""}`}>
                <span
                  className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold"
                  style={{ backgroundColor: s.primary, color: s.primaryText }}
                >
                  <Phone size={13} /> Pesan Sekarang
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-brand-dark/15 px-4 py-2 text-xs font-bold text-brand-dark/70">
                  Lihat Layanan <ArrowRight size={13} />
                </span>
              </div>
            </div>
          </div>

          {/* Layanan */}
          <div className="px-6 py-8" style={{ backgroundColor: s.accentSoft }}>
            <h3 className="text-center text-base font-extrabold text-brand-dark">Layanan Kami</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {layanan.map((l, i) => (
                <div key={i} className="rounded-lg border border-brand-dark/8 bg-white p-4">
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-extrabold"
                    style={{ backgroundColor: `${s.primary}22`, color: s.primary }}
                  >
                    {i + 1}
                  </span>
                  <p className="mt-2 text-sm font-bold text-brand-dark">{l.t}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-brand-dark/55">{l.d}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Kenapa kami + rating */}
          <div className="grid gap-0 sm:grid-cols-2">
            <div className="border-b border-brand-dark/8 px-6 py-7 sm:border-b-0 sm:border-r">
              <h3 className="text-base font-extrabold text-brand-dark">Kenapa Pilih Kami?</h3>
              <ul className="mt-3 space-y-2">
                {["Berpengalaman & terpercaya", "Harga transparan", "Garansi kepuasan"].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-brand-dark/70">
                    <Check size={14} style={{ color: s.primary }} /> {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="px-6 py-7">
              <div className="flex items-center gap-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} size={15} className="fill-amber-400 text-amber-400" />
                ))}
                <span className="ml-1 text-sm font-bold text-brand-dark">4,9</span>
              </div>
              <p className="mt-2 text-xs italic text-brand-dark/60">
                &ldquo;Pelayanan {nama} memuaskan, cepat dan ramah. Recommended banget!&rdquo;
              </p>
              <p className="mt-1 text-[11px] font-semibold text-brand-dark/45">— Pelanggan di {kotaSafe}</p>
            </div>
          </div>

          {/* Footer CTA */}
          <div
            className="px-6 py-7 text-center"
            style={{ backgroundColor: s.primary, color: s.primaryText }}
          >
            <p className="text-sm font-extrabold">Siap Melayani Kebutuhanmu</p>
            <div className="mt-2 flex items-center justify-center gap-3 text-xs">
              <span className="flex items-center gap-1">
                <Phone size={12} /> 0812-xxxx-xxxx
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={12} /> {kotaSafe}
              </span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-[11px] text-brand-dark/40">
        ✦ Ini <strong>simulasi tampilan web</strong> — isi (alamat, telepon, testimoni) hanya contoh ilustrasi
      </p>
    </div>
  );
}
