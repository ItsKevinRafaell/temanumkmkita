"use client";

import { Star, MapPin, Phone, Globe, Clock, Navigation, Search } from "lucide-react";

interface Props {
  namaUsaha: string;
  jenisUsaha: string;
  kota: string;
  loading: boolean;
}

/**
 * Preview tampilan bisnis di Google (Search + panel Maps) — ala Chrome.
 * SEMUA ilustratif. Rating, jumlah review, jam buka = contoh tampilan, bukan
 * data asli. Diberi label "Simulasi" biar jujur (bukan klaim data real).
 */
export default function GbpPreview({ namaUsaha, jenisUsaha, kota, loading }: Props) {
  const nama = namaUsaha || "Nama Usahamu";
  const jenis = jenisUsaha || "Jenis Usaha";
  const kotaSafe = kota || "Kotamu";

  if (loading) {
    return (
      <div className="overflow-hidden rounded-xl border border-brand-dark/10 bg-white shadow-card">
        <BrowserChrome query={`${jenis} di ${kotaSafe}`} />
        <div className="animate-pulse space-y-4 p-5">
          <div className="h-4 w-1/3 rounded bg-brand-dark/10" />
          <div className="h-24 rounded-lg bg-brand-dark/10" />
          <div className="h-3 w-2/3 rounded bg-brand-dark/10" />
          <div className="h-3 w-1/2 rounded bg-brand-dark/10" />
          <div className="h-3 w-3/5 rounded bg-brand-dark/10" />
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-brand-dark/10 bg-white shadow-card">
      <BrowserChrome query={`${jenis} di ${kotaSafe}`} />

      {/* Body ala hasil Google */}
      <div className="grid gap-0 sm:grid-cols-[1.4fr_1fr]">
        {/* Kolom kiri: hasil search */}
        <div className="border-b border-brand-dark/8 p-4 sm:border-b-0 sm:border-r">
          <p className="mb-3 text-[11px] text-brand-dark/40">
            Sekitar 12.400 hasil (0,42 detik)
          </p>
          {/* Kartu bisnis (highlight) */}
          <div className="rounded-lg border border-accent/40 bg-accent/5 p-3">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/15 text-lg font-extrabold text-accent">
                {nama.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate font-bold text-brand-dark">{nama}</p>
                <div className="mt-0.5 flex items-center gap-1.5 text-xs">
                  <span className="font-bold text-amber-600">4,8</span>
                  <span className="flex">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <Star key={i} size={11} className="fill-amber-400 text-amber-400" />
                    ))}
                  </span>
                  <span className="text-brand-dark/45">(127)</span>
                </div>
                <p className="mt-0.5 truncate text-xs text-brand-dark/55">
                  {jenis} · {kotaSafe}
                </p>
                <span className="mt-1 inline-block rounded bg-green-50 px-1.5 py-0.5 text-[10px] font-semibold text-green-700">
                  Buka · Tutup 21.00
                </span>
              </div>
            </div>
          </div>
          {/* Kompetitor buram (di bawah) */}
          <div className="mt-2 space-y-2 opacity-45">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-brand-dark/8 p-3">
                <div className="h-9 w-9 shrink-0 rounded-full bg-brand-dark/10" />
                <div className="min-w-0 flex-1">
                  <div className="h-3 w-2/3 rounded bg-brand-dark/10" />
                  <div className="mt-1.5 h-2.5 w-1/2 rounded bg-brand-dark/8" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kolom kanan: panel bisnis (Knowledge Panel) */}
        <div className="p-4">
          <div className="mb-3 h-24 rounded-lg bg-gradient-to-br from-accent/25 to-accent/5" />
          <p className="font-extrabold text-brand-dark">{nama}</p>
          <div className="mt-1 flex items-center gap-1.5 text-xs">
            <span className="font-bold text-amber-600">4,8</span>
            <span className="flex">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} size={11} className="fill-amber-400 text-amber-400" />
              ))}
            </span>
            <span className="text-brand-dark/45">127 ulasan</span>
          </div>
          <p className="mt-0.5 text-xs text-brand-dark/55">{jenis}</p>

          <div className="mt-3 space-y-2 text-xs text-brand-dark/70">
            <Row icon={<MapPin size={13} />} text={`Jl. Contoh No. 12, ${kotaSafe}`} />
            <Row icon={<Clock size={13} />} text="Buka · Tutup pukul 21.00" />
            <Row icon={<Phone size={13} />} text="0812-xxxx-xxxx" />
            <Row icon={<Globe size={13} />} text={`${nama.toLowerCase().replace(/\s+/g, "")}.com`} />
          </div>

          <div className="mt-3 flex gap-2">
            <button className="flex flex-1 items-center justify-center gap-1 rounded-md bg-blue-50 px-2 py-1.5 text-[11px] font-semibold text-blue-700">
              <Navigation size={12} /> Rute
            </button>
            <button className="flex flex-1 items-center justify-center gap-1 rounded-md bg-blue-50 px-2 py-1.5 text-[11px] font-semibold text-blue-700">
              <Phone size={12} /> Telepon
            </button>
          </div>
        </div>
      </div>

      <p className="border-t border-brand-dark/8 bg-canvas px-4 py-2 text-center text-[11px] text-brand-dark/40">
        ✦ Ini simulasi tampilan — data (rating, ulasan, jam) hanya contoh ilustrasi
      </p>
    </div>
  );
}

function Row({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-accent">{icon}</span>
      <span className="truncate">{text}</span>
    </div>
  );
}

function BrowserChrome({ query }: { query: string }) {
  return (
    <div className="border-b border-brand-dark/10 bg-brand-dark/[0.03] px-3 py-2.5">
      <div className="flex items-center gap-2">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
        </div>
        <div className="ml-2 flex flex-1 items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm ring-1 ring-brand-dark/8">
          <Search size={13} className="text-brand-dark/40" />
          <span className="truncate text-xs text-brand-dark/70">{query}</span>
        </div>
      </div>
    </div>
  );
}
