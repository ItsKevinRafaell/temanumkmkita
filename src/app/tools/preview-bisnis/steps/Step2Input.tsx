"use client";

import { useEffect, useState } from "react";
import { Store, MapPin, Tag } from "lucide-react";
import type { StepProps } from "../types";
import { fetchIndustries, type Industry } from "../catalog";
import SearchableDropdown from "./SearchableDropdown";

const inputClass =
  "w-full px-4 py-3 rounded-lg border border-brand-dark/12 bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 text-brand-dark placeholder:text-brand-dark/35 transition-all text-sm";

// Step 2 — Input ringan.
// 3 field santai: nama usaha, kota, jenis usaha.
// jenis usaha = custom SEARCHABLE dropdown (22 industri dari backend catalog).
// Menyimpan industrySlug + jenisUsaha(label). Dipakai step 3/5/6.
export default function Step2Input({ state, update }: StepProps) {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ctrl = new AbortController();
    fetchIndustries(ctrl.signal).then((list) => {
      setIndustries(list);
      setLoading(false);
    });
    return () => ctrl.abort();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-brand-dark">
          Kenalan dulu sama usahamu 👋
        </h2>
        <p className="mt-1 text-brand-dark/60">
          Cukup 3 hal ringan. Ini yang kami pakai buat nunjukin realita usahamu
          di langkah berikutnya.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nama usaha" icon={<Store size={15} />}>
          <input
            type="text"
            value={state.namaUsaha}
            onChange={(e) => update({ namaUsaha: e.target.value })}
            placeholder="Contoh: Kopi Senja"
            className={inputClass}
          />
        </Field>

        <Field label="Kota" icon={<MapPin size={15} />}>
          <input
            type="text"
            value={state.kota}
            onChange={(e) => update({ kota: e.target.value })}
            placeholder="Contoh: Bandung"
            className={inputClass}
          />
        </Field>

        <div className="sm:col-span-2">
          <Field label="Jenis usaha" icon={<Tag size={15} />}>
            <SearchableDropdown
              industries={industries}
              valueSlug={state.industrySlug}
              loading={loading}
              onSelect={(ind) =>
                update({
                  industrySlug: ind.slug,
                  jenisUsaha: ind.label,
                  // Reset template terpilih kalau industri ganti.
                  ...(ind.slug !== state.industrySlug ? { templateSlug: "" } : {}),
                })
              }
            />
            <p className="mt-1.5 text-xs text-brand-dark/45">
              Ketik untuk cari cepat — pilih kategori yang paling mendekati usahamu.
              Ini yang kami pakai buat cocokkan template & simulasi.
            </p>
          </Field>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-bold text-brand-dark">
        <span className="text-accent">{icon}</span>
        {label}
      </label>
      {children}
    </div>
  );
}
