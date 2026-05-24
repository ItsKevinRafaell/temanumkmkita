"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Save, ChevronLeft, Loader2, Link2, Copy, Check, KeyRound, Trash2 } from "lucide-react";
import {
  fetchAdminSettings,
  updateSettings,
  fetchIntegrationToken,
  generateIntegrationToken,
  revokeIntegrationToken,
  type SiteSettings,
  type IntegrationTokenInfo,
} from "@/lib/api/admin";

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

  // Integration token state
  const [tokenInfo, setTokenInfo] = useState<IntegrationTokenInfo | null>(null);
  const [integrationToken, setIntegrationToken] = useState<string | null>(null);
  const [generatingToken, setGeneratingToken] = useState(false);
  const [tokenError, setTokenError] = useState("");
  const [copied, setCopied] = useState(false);

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

    fetchIntegrationToken()
      .then((info) => setTokenInfo(info))
      .catch(() => {/* silently ignore — token section will show empty state */});
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

  async function handleGenerateToken() {
    setGeneratingToken(true);
    setTokenError("");
    setIntegrationToken(null);
    try {
      const result = await generateIntegrationToken();
      setIntegrationToken(result.token);
      setTokenInfo({ id: result.id, created_at: result.created_at, token_prefix: result.token_prefix });
    } catch (err) {
      setTokenError(err instanceof Error ? err.message : "Gagal membuat token");
    } finally {
      setGeneratingToken(false);
    }
  }

  async function handleRevokeToken() {
    if (!confirm("Yakin ingin menghapus token integrasi? Semua sistem yang menggunakan token ini tidak akan bisa publish artikel.")) return;
    setTokenError("");
    try {
      await revokeIntegrationToken();
      setTokenInfo(null);
      setIntegrationToken(null);
    } catch (err) {
      setTokenError(err instanceof Error ? err.message : "Gagal menghapus token");
    }
  }

  function handleCopyToken() {
    if (!integrationToken) return;
    navigator.clipboard.writeText(integrationToken).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
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

            {/* Integration Token */}
            <div className="bg-white border border-[#242423]/8 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-1">
                <KeyRound size={14} className="text-[#242423]/40" />
                <p className="text-xs font-bold uppercase tracking-wider text-[#242423]/40">Integrasi API</p>
              </div>
              <p className="text-xs text-[#242423]/50 mb-4">Token untuk menghubungkan Kantorteman dengan CMS ini.</p>

              {tokenError && (
                <p className="text-xs text-red-600 mb-3">{tokenError}</p>
              )}

              {tokenInfo ? (
                <div className="space-y-3">
                  <div className="bg-[#fcfaf7] border border-[#242423]/8 rounded-lg px-3 py-2 text-xs text-[#242423]/60">
                    <span className="font-semibold text-[#242423]/70">Token aktif</span> sejak{" "}
                    {new Date(tokenInfo.created_at).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })},{" "}
                    prefix: <code className="font-mono">{tokenInfo.token_prefix}...</code>
                  </div>

                  {integrationToken && (
                    <div className="space-y-1.5">
                      <p className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                        Simpan token ini sekarang. Tidak bisa dilihat lagi.
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          readOnly
                          value={integrationToken}
                          className="flex-1 font-mono text-xs border border-[#242423]/12 rounded-lg px-3 py-2 bg-[#fcfaf7] text-[#242423] select-all"
                        />
                        <button
                          onClick={handleCopyToken}
                          className="flex items-center gap-1.5 border border-[#242423]/12 rounded-lg px-3 py-2 text-xs font-semibold text-[#242423]/60 hover:bg-[#242423]/5 transition"
                        >
                          {copied ? <Check size={13} className="text-green-600" /> : <Copy size={13} />}
                          {copied ? "Tersalin" : "Salin"}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={handleGenerateToken}
                      disabled={generatingToken}
                      className="flex items-center gap-1.5 border border-[#242423]/12 rounded-lg px-3 py-1.5 text-xs font-semibold text-[#242423]/60 hover:bg-[#242423]/5 disabled:opacity-50 transition"
                    >
                      {generatingToken ? <Loader2 size={12} className="animate-spin" /> : <KeyRound size={12} />}
                      Generate ulang
                    </button>
                    <button
                      onClick={handleRevokeToken}
                      className="flex items-center gap-1.5 border border-red-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
                    >
                      <Trash2 size={12} />
                      Revoke
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleGenerateToken}
                  disabled={generatingToken}
                  className="flex items-center gap-1.5 bg-[#242423] text-white font-bold px-4 py-1.5 rounded-lg text-sm hover:bg-[#242423]/85 disabled:opacity-60 transition"
                >
                  {generatingToken ? <Loader2 size={13} className="animate-spin" /> : <KeyRound size={13} />}
                  {generatingToken ? "Membuat token..." : "Generate Token"}
                </button>
              )}
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
