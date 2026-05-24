"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Save, ChevronLeft, Loader2, Link2 } from "lucide-react";
import { fetchAdminSettings, updateSettings, type SiteSettings } from "@/lib/api/admin";

const FIELDS: {
  key: keyof Omit<SiteSettings, "id" | "updated_at">;
  label: string;
  placeholder: string;
  icon?: React.ReactNode;
}[] = [
  { key: "instagram_url", label: "Instagram", placeholder: "https://instagram.com/temanumkmkita", icon: <Link2 size={14} /> },
  { key: "facebook_url", label: "Facebook", placeholder: "https://facebook.com/temanumkmkita", icon: <Link2 size={14} /> },
  { key: "linkedin_url", label: "LinkedIn", placeholder: "https://linkedin.com/company/temanumkmkita", icon: <Link2 size={14} /> },
  { key: "tiktok_url", label: "TikTok", placeholder: "https://tiktok.com/@temanumkmkita" },
  { key: "youtube_url", label: "YouTube", placeholder: "https://youtube.com/@temanumkmkita", icon: <Link2 size={14} /> },
  { key: "twitter_url", label: "X / Twitter", placeholder: "https://x.com/temanumkmkita", icon: <Link2 size={14} /> },
  { key: "phone", label: "Nomor WhatsApp / Telepon", placeholder: "+62 895-0192-5395" },
  { key: "address", label: "Alamat", placeholder: "Jl. ..., Kota, Provinsi, Indonesia" },
];

export default function SettingsPage() {
  const [form, setForm] = useState<Partial<Omit<SiteSettings, "id" | "updated_at">>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAdminSettings()
      .then((s) => {
        setForm({
          instagram_url: s.instagram_url ?? "",
          facebook_url: s.facebook_url ?? "",
          linkedin_url: s.linkedin_url ?? "",
          tiktok_url: s.tiktok_url ?? "",
          youtube_url: s.youtube_url ?? "",
          twitter_url: s.twitter_url ?? "",
          phone: s.phone ?? "",
          address: s.address ?? "",
        });
      })
      .catch(() => setError("Gagal memuat pengaturan"))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const payload: Partial<Omit<SiteSettings, "id" | "updated_at">> = {};
      for (const { key } of FIELDS) {
        const val = (form as Record<string, string>)[key as string];
        (payload as Record<string, string | null>)[key as string] = val?.trim() || null;
      }
      await updateSettings(payload);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fcfaf7]">
      <header className="bg-white border-b border-[#242423]/8 px-6 py-3.5 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="flex items-center gap-1 text-xs text-[#242423]/50 hover:text-[#242423] transition">
            <ChevronLeft size={13} /> Dashboard
          </Link>
          <span className="text-[#242423]/20">/</span>
          <span className="text-sm font-bold text-[#242423]">Pengaturan Website</span>
        </div>
        <div className="flex items-center gap-2">
          {error && <span className="text-xs text-red-600">{error}</span>}
          {saved && <span className="text-xs text-green-600 font-semibold">Tersimpan</span>}
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="flex items-center gap-1.5 bg-[#f5a700] text-white font-bold px-4 py-1.5 rounded-lg text-sm hover:bg-[#f5a700]/90 disabled:opacity-60 transition"
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-[#242423]/30" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Social Media */}
            <div className="bg-white border border-[#242423]/8 rounded-2xl p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-[#242423]/40 mb-4">Sosial Media</p>
              <div className="space-y-3">
                {FIELDS.filter((f) => f.key !== "phone" && f.key !== "address").map(({ key, label, placeholder, icon }) => (
                  <div key={key}>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-[#242423]/55 mb-1">
                      {icon && <span className="text-[#242423]/35">{icon}</span>}
                      {label}
                    </label>
                    <input
                      type="url"
                      className="w-full border border-[#242423]/12 rounded-lg px-3 py-2 text-sm text-[#242423] bg-white focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30 focus:border-[#f5a700]"
                      placeholder={placeholder}
                      value={(form as Record<string, string>)[key as string] ?? ""}
                      onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white border border-[#242423]/8 rounded-2xl p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-[#242423]/40 mb-4">Kontak & Alamat</p>
              <div className="space-y-3">
                {FIELDS.filter((f) => f.key === "phone" || f.key === "address").map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-[#242423]/55 mb-1">{label}</label>
                    <input
                      type="text"
                      className="w-full border border-[#242423]/12 rounded-lg px-3 py-2 text-sm text-[#242423] bg-white focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30 focus:border-[#f5a700]"
                      placeholder={placeholder}
                      value={(form as Record<string, string>)[key as string] ?? ""}
                      onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                    />
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-[#242423]/40 text-center">
              Data ini dipakai untuk Organization schema (Google SEO) dan footer website.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
