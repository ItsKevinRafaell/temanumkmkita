"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Save, ChevronLeft, Loader2, Link2, Copy, Check, KeyRound, Trash2 } from "lucide-react";
import {
  fetchAdminSettings,
  updateSettings,
  uploadImage,
  fetchIntegrationToken,
  generateIntegrationToken,
  revokeIntegrationToken,
  type SiteSettings,
  type IntegrationTokenInfo,
} from "@/lib/api/admin";

type EditableSettings = Omit<SiteSettings, "id" | "updated_at">;
type TextFieldKey = Exclude<keyof EditableSettings, "show_testimonials">;

const SOCIAL_FIELDS: {
  key: TextFieldKey;
  label: string;
  placeholder: string;
  icon?: React.ReactNode;
}[] = [
  {
    key: "instagram_url",
    label: "Instagram",
    placeholder: "https://instagram.com/temanumkmkita",
    icon: <Link2 size={14} />,
  },
  {
    key: "facebook_url",
    label: "Facebook",
    placeholder: "https://facebook.com/temanumkmkita",
    icon: <Link2 size={14} />,
  },
  {
    key: "linkedin_url",
    label: "LinkedIn",
    placeholder: "https://linkedin.com/company/temanumkmkita",
    icon: <Link2 size={14} />,
  },
  { key: "tiktok_url", label: "TikTok", placeholder: "https://tiktok.com/@temanumkmkita" },
  {
    key: "youtube_url",
    label: "YouTube",
    placeholder: "https://youtube.com/@temanumkmkita",
    icon: <Link2 size={14} />,
  },
  {
    key: "twitter_url",
    label: "X / Twitter",
    placeholder: "https://x.com/temanumkmkita",
    icon: <Link2 size={14} />,
  },
];

const BRAND_FIELDS: {
  key: TextFieldKey;
  label: string;
  placeholder: string;
  hint: string;
}[] = [
  {
    key: "logo_url",
    label: "Logo Utama",
    placeholder: "https://www.temanumkmkita.com/brand/logo-secondary.png",
    hint: "Dipakai di navbar dan schema SEO.",
  },
  {
    key: "logo_light_url",
    label: "Logo untuk Background Warna",
    placeholder: "https://www.temanumkmkita.com/brand/logo-secondary.png",
    hint: "Dipakai di footer atau section berwarna. Boleh sama dengan logo utama.",
  },
  {
    key: "favicon_url",
    label: "Favicon",
    placeholder: "https://www.temanumkmkita.com/brand/favicon.png",
    hint: "Ikon browser/tab. Idealnya square.",
  },
];

const CONTACT_FIELDS: {
  key: TextFieldKey;
  label: string;
  placeholder: string;
}[] = [
  { key: "phone", label: "Nomor WhatsApp / Telepon", placeholder: "+62 895-0192-5395" },
  { key: "address", label: "Alamat", placeholder: "Jl. ..., Kota, Provinsi, Indonesia" },
];

const PROOF_FIELDS: {
  key: TextFieldKey;
  label: string;
  placeholder: string;
}[] = [
  { key: "clients_active", label: "Klien Aktif", placeholder: "3" },
  { key: "projects_completed", label: "Total Proyek", placeholder: "10+" },
  { key: "founded_year", label: "Tahun Berdiri", placeholder: "2025" },
  {
    key: "primary_service_areas",
    label: "Area Layanan Utama",
    placeholder: "Kalimantan Timur & Jabodetabek",
  },
  { key: "response_time", label: "Response Time", placeholder: "Berusaha membalas dalam 24 jam" },
];

const TEXT_FIELDS = [...SOCIAL_FIELDS, ...BRAND_FIELDS, ...CONTACT_FIELDS, ...PROOF_FIELDS];

export default function SettingsPage() {
  const [form, setForm] = useState<Partial<EditableSettings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [uploadingAsset, setUploadingAsset] = useState<TextFieldKey | null>(null);

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
          logo_url: s.logo_url ?? "https://www.temanumkmkita.com/brand/logo-secondary.png",
          logo_light_url:
            s.logo_light_url ?? "https://www.temanumkmkita.com/brand/logo-secondary.png",
          favicon_url: s.favicon_url ?? "https://www.temanumkmkita.com/brand/favicon.png",
          phone: s.phone ?? "",
          address: s.address ?? "",
          clients_active: s.clients_active ?? "3",
          projects_completed: s.projects_completed ?? "10+",
          founded_year: s.founded_year ?? "2025",
          primary_service_areas: s.primary_service_areas ?? "Kalimantan Timur & Jabodetabek",
          response_time: s.response_time ?? "Berusaha membalas dalam 24 jam",
          show_testimonials: Boolean(s.show_testimonials),
        });
      })
      .catch(() => setError("Gagal memuat pengaturan"))
      .finally(() => setLoading(false));

    fetchIntegrationToken()
      .then((info) => setTokenInfo(info))
      .catch(() => {
        /* silently ignore — token section will show empty state */
      });
  }, []);

  async function handleSave() {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const payload: Partial<EditableSettings> = {};
      for (const { key } of TEXT_FIELDS) {
        const val = (form as Record<string, string | null | undefined>)[key as string];
        (payload as Record<string, string | null>)[key as string] = val?.trim() || null;
      }
      payload.show_testimonials = Boolean(form.show_testimonials);
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
      setTokenInfo({
        id: result.id,
        created_at: result.created_at,
        token_prefix: result.token_prefix,
      });
    } catch (err) {
      setTokenError(err instanceof Error ? err.message : "Gagal membuat token");
    } finally {
      setGeneratingToken(false);
    }
  }

  async function handleRevokeToken() {
    if (
      !confirm(
        "Yakin ingin menghapus token integrasi? Semua sistem yang menggunakan token ini tidak akan bisa publish artikel."
      )
    )
      return;
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

  async function handleAssetUpload(key: TextFieldKey, file: File | null) {
    if (!file) return;
    setUploadingAsset(key);
    setError("");
    try {
      const url = await uploadImage(file);
      setForm((prev) => ({ ...prev, [key]: url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal upload aset");
    } finally {
      setUploadingAsset(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#fcfaf7]">
      <header className="border-[#242423]/8 sticky top-0 z-20 flex items-center justify-between border-b bg-white px-6 py-3.5 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="flex items-center gap-1 text-xs text-[#242423]/50 transition hover:text-[#242423]"
          >
            <ChevronLeft size={13} /> Dashboard
          </Link>
          <span className="text-[#242423]/20">/</span>
          <span className="text-sm font-bold text-[#242423]">Pengaturan Website</span>
        </div>
        <div className="flex items-center gap-2">
          {error && <span className="text-xs text-red-600">{error}</span>}
          {saved && <span className="text-xs font-semibold text-green-600">Tersimpan</span>}
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="flex items-center gap-1.5 rounded-lg bg-[#f5a700] px-4 py-1.5 text-sm font-bold text-white transition hover:bg-[#f5a700]/90 disabled:opacity-60"
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-10">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-[#242423]/30" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Social Media */}
            <div className="border-[#242423]/8 rounded-2xl border bg-white p-6">
              <p className="mb-4 text-xs font-bold uppercase tracking-wider text-[#242423]/40">
                Sosial Media
              </p>
              <div className="space-y-3">
                {SOCIAL_FIELDS.map(({ key, label, placeholder, icon }) => (
                  <div key={key}>
                    <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-[#242423]/55">
                      {icon && <span className="text-[#242423]/35">{icon}</span>}
                      {label}
                    </label>
                    <input
                      type="url"
                      className="border-[#242423]/12 w-full rounded-lg border bg-white px-3 py-2 text-sm text-[#242423] focus:border-[#f5a700] focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30"
                      placeholder={placeholder}
                      value={(form as Record<string, string>)[key as string] ?? ""}
                      onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Brand Assets */}
            <div className="border-[#242423]/8 rounded-2xl border bg-white p-6">
              <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[#242423]/40">
                Brand Assets
              </p>
              <p className="mb-4 text-xs text-[#242423]/45">
                Logo ditampilkan dengan object-fit/contain supaya tidak gepeng. Kalau terlihat
                terlalu kecil, upload versi crop.
              </p>
              <div className="space-y-4">
                {BRAND_FIELDS.map(({ key, label, placeholder, hint }) => {
                  const value = (form as Record<string, string>)[key as string] ?? "";
                  return (
                    <div key={key}>
                      <label className="mb-1 block text-xs font-semibold text-[#242423]/55">
                        {label}
                      </label>
                      <div className="flex flex-col gap-3 sm:flex-row">
                        <div className="flex-1 space-y-2">
                          <input
                            type="url"
                            className="border-[#242423]/12 w-full rounded-lg border bg-white px-3 py-2 text-sm text-[#242423] focus:border-[#f5a700] focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30"
                            placeholder={placeholder}
                            value={value}
                            onChange={(e) =>
                              setForm((prev) => ({ ...prev, [key]: e.target.value }))
                            }
                          />
                          <p className="text-xs text-[#242423]/40">{hint}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          {value && (
                            <div className="border-[#242423]/8 flex h-14 w-24 items-center justify-center rounded-lg border bg-[#fcfaf7] p-2">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={value}
                                alt=""
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>
                          )}
                          <label className="border-[#242423]/12 relative inline-flex cursor-pointer items-center justify-center rounded-lg border px-3 py-2 text-xs font-semibold text-[#242423]/60 transition hover:border-[#f5a700] hover:text-[#f5a700]">
                            {uploadingAsset === key ? "Upload..." : "Upload"}
                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/webp,image/gif"
                              className="absolute inset-0 cursor-pointer opacity-0"
                              disabled={uploadingAsset === key}
                              onChange={(e) => handleAssetUpload(key, e.target.files?.[0] ?? null)}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Contact */}
            <div className="border-[#242423]/8 rounded-2xl border bg-white p-6">
              <p className="mb-4 text-xs font-bold uppercase tracking-wider text-[#242423]/40">
                Kontak & Alamat
              </p>
              <div className="space-y-3">
                {CONTACT_FIELDS.map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="mb-1 block text-xs font-semibold text-[#242423]/55">
                      {label}
                    </label>
                    <input
                      type="text"
                      className="border-[#242423]/12 w-full rounded-lg border bg-white px-3 py-2 text-sm text-[#242423] focus:border-[#f5a700] focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30"
                      placeholder={placeholder}
                      value={(form as Record<string, string>)[key as string] ?? ""}
                      onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Proof & positioning */}
            <div className="border-[#242423]/8 rounded-2xl border bg-white p-6">
              <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[#242423]/40">
                Proof & Positioning
              </p>
              <p className="mb-4 text-xs text-[#242423]/45">
                Data ini dipakai di homepage, CTA, dan schema SEO. Isi hanya dengan angka yang bisa
                dipertanggungjawabkan.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {PROOF_FIELDS.map(({ key, label, placeholder }) => (
                  <div
                    key={key}
                    className={
                      key === "primary_service_areas" || key === "response_time"
                        ? "sm:col-span-2"
                        : ""
                    }
                  >
                    <label className="mb-1 block text-xs font-semibold text-[#242423]/55">
                      {label}
                    </label>
                    <input
                      type="text"
                      className="border-[#242423]/12 w-full rounded-lg border bg-white px-3 py-2 text-sm text-[#242423] focus:border-[#f5a700] focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30"
                      placeholder={placeholder}
                      value={(form as Record<string, string>)[key as string] ?? ""}
                      onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                    />
                  </div>
                ))}
              </div>
              <label className="border-[#242423]/8 mt-4 flex items-start gap-3 rounded-lg border bg-[#fcfaf7] px-3 py-3">
                <input
                  type="checkbox"
                  checked={Boolean(form.show_testimonials)}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, show_testimonials: e.target.checked }))
                  }
                  className="mt-0.5 h-4 w-4 accent-[#f5a700]"
                />
                <span>
                  <span className="block text-sm font-semibold text-[#242423]">
                    Tampilkan testimoni publik
                  </span>
                  <span className="mt-0.5 block text-xs text-[#242423]/50">
                    Aktifkan setelah testimoni sudah dikonfirmasi dan boleh dipublikasikan.
                  </span>
                </span>
              </label>
            </div>

            {/* Integration Token */}
            <div className="border-[#242423]/8 rounded-2xl border bg-white p-6">
              <div className="mb-1 flex items-center gap-2">
                <KeyRound size={14} className="text-[#242423]/40" />
                <p className="text-xs font-bold uppercase tracking-wider text-[#242423]/40">
                  Integrasi API
                </p>
              </div>
              <p className="mb-4 text-xs text-[#242423]/50">
                Token untuk menghubungkan Kantorteman dengan CMS ini.
              </p>

              {tokenError && <p className="mb-3 text-xs text-red-600">{tokenError}</p>}

              {tokenInfo ? (
                <div className="space-y-3">
                  <div className="border-[#242423]/8 rounded-lg border bg-[#fcfaf7] px-3 py-2 text-xs text-[#242423]/60">
                    <span className="font-semibold text-[#242423]/70">Token aktif</span> sejak{" "}
                    {new Date(tokenInfo.created_at).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                    , prefix: <code className="font-mono">{tokenInfo.token_prefix}...</code>
                  </div>

                  {integrationToken && (
                    <div className="space-y-1.5">
                      <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
                        Simpan token ini sekarang. Tidak bisa dilihat lagi.
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          readOnly
                          value={integrationToken}
                          className="border-[#242423]/12 flex-1 select-all rounded-lg border bg-[#fcfaf7] px-3 py-2 font-mono text-xs text-[#242423]"
                        />
                        <button
                          onClick={handleCopyToken}
                          className="border-[#242423]/12 flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold text-[#242423]/60 transition hover:bg-[#242423]/5"
                        >
                          {copied ? (
                            <Check size={13} className="text-green-600" />
                          ) : (
                            <Copy size={13} />
                          )}
                          {copied ? "Tersalin" : "Salin"}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={handleGenerateToken}
                      disabled={generatingToken}
                      className="border-[#242423]/12 flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold text-[#242423]/60 transition hover:bg-[#242423]/5 disabled:opacity-50"
                    >
                      {generatingToken ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <KeyRound size={12} />
                      )}
                      Generate ulang
                    </button>
                    <button
                      onClick={handleRevokeToken}
                      className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
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
                  className="flex items-center gap-1.5 rounded-lg bg-[#242423] px-4 py-1.5 text-sm font-bold text-white transition hover:bg-[#242423]/85 disabled:opacity-60"
                >
                  {generatingToken ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <KeyRound size={13} />
                  )}
                  {generatingToken ? "Membuat token..." : "Generate Token"}
                </button>
              )}
            </div>

            <p className="text-center text-xs text-[#242423]/40">
              Data ini dipakai untuk Organization schema (Google SEO) dan footer website.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
