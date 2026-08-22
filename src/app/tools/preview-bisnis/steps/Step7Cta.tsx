"use client";

import { User, Phone, Mail, MessageSquare } from "lucide-react";
import type { StepProps } from "../types";

const inputClass =
  "w-full px-4 py-3 rounded-lg border border-brand-dark/12 bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 text-brand-dark placeholder:text-brand-dark/35 transition-all text-sm";

// Step 7 — CTA lead.
// "Yuk wujudin ini" -> form kontak minimal: nama, WA (wajib), email (opsional), pesan (opsional).
// Submit di-handle MulaiClient.submitLead() -> POST /api/contact-form -> ERP /api/leads/external.
// Data: nama, wa, email, pesan (jawaban step2-5 dibungkus di message oleh MulaiClient).
export default function Step7Cta({ state, update }: StepProps) {
  const usaha = state.namaUsaha.trim();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-brand-dark">
          Yuk wujudin ini buat {usaha || "usahamu"} 🚀
        </h2>
        <p className="mt-1 text-brand-dark/60">
          Tinggal satu langkah. Isi kontakmu, nanti tim Teman UMKM Kita yang
          hubungi buat bantu mulai — ngobrol dulu, gratis, tanpa paksaan sama
          sekali.
        </p>
      </div>

      <div className="space-y-4">
        <Field label="Nama kamu" icon={<User size={15} />} required>
          <input
            type="text"
            value={state.nama}
            onChange={(e) => update({ nama: e.target.value })}
            placeholder="Nama lengkap"
            className={inputClass}
          />
        </Field>

        <Field label="Nomor WhatsApp" icon={<Phone size={15} />} required>
          <input
            type="tel"
            value={state.wa}
            onChange={(e) => update({ wa: e.target.value })}
            placeholder="08xxxxxxxxxx"
            className={inputClass}
          />
        </Field>

        <Field label="Email (opsional)" icon={<Mail size={15} />}>
          <input
            type="email"
            value={state.email}
            onChange={(e) => update({ email: e.target.value })}
            placeholder="email@usahamu.com"
            className={inputClass}
          />
        </Field>

        <Field label="Pesan (opsional)" icon={<MessageSquare size={15} />}>
          <textarea
            rows={3}
            value={state.pesan}
            onChange={(e) => update({ pesan: e.target.value })}
            placeholder="Ada yang mau diceritain soal usahamu?"
            className={`${inputClass} resize-none`}
          />
        </Field>
      </div>

      <p className="text-xs text-brand-dark/45">
        Dengan lanjut, kamu setuju dihubungi tim kami. Data kamu aman &amp; nggak
        dibagikan ke pihak lain.
      </p>
    </div>
  );
}

function Field({
  label,
  icon,
  required,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-bold text-brand-dark">
        <span className="text-accent">{icon}</span>
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}
