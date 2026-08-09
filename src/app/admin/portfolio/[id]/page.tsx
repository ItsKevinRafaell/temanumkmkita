"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { Save, ChevronLeft, Loader2, Upload, X } from "lucide-react";
import { adminGetPortfolio, adminUpdatePortfolio, uploadImage } from "@/lib/api/admin";

const SERVICE_SLUGS = [
  { value: "web-development", label: "Web Development" },
  { value: "web-development-bulanan", label: "Web Development Bulanan" },
  { value: "seo-google-maps", label: "SEO & Google Maps" },
  { value: "kelola-sosial-media", label: "Kelola Sosial Media" },
  { value: "maintenance", label: "Maintenance Website" },
  { value: "desain-logo", label: "Desain Logo" },
];

const inputClass =
  "w-full border border-[#242423]/12 rounded-lg px-3 py-2 text-sm text-[#242423] bg-white focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30 focus:border-[#f5a700]";

const KNOWN_SLUGS = SERVICE_SLUGS.map((s) => s.value);

export default function EditPortfolioPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [serviceSlug, setServiceSlug] = useState("web-development");
  const [customSlug, setCustomSlug] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    adminGetPortfolio(id)
      .then((item) => {
        const known = KNOWN_SLUGS.includes(item.service_slug);
        if (known) {
          setServiceSlug(item.service_slug);
        } else {
          setUseCustom(true);
          setCustomSlug(item.service_slug);
        }
        setTitle(item.title);
        setCategory(item.category ?? "");
        setImageUrl(item.image_url);
        setLinkUrl(item.link_url ?? "");
        setSortOrder(item.sort_order);
      })
      .catch(() => router.push("/admin/portfolio"))
      .finally(() => setLoading(false));
  }, [id, router]);

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload gagal");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    const slug = useCustom ? customSlug.trim() : serviceSlug;
    if (!title.trim()) {
      setError("Judul wajib diisi.");
      return;
    }
    if (!slug) {
      setError("Layanan wajib dipilih.");
      return;
    }
    if (!imageUrl) {
      setError("Gambar wajib diupload.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await adminUpdatePortfolio(id, {
        service_slug: slug,
        title: title.trim(),
        category: category.trim() || null,
        image_url: imageUrl,
        link_url: linkUrl.trim() || null,
        sort_order: sortOrder,
      });
      router.push("/admin/portfolio");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fcfaf7]">
        <Loader2 size={24} className="animate-spin text-[#f5a700]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfaf7]">
      <header className="border-[#242423]/8 sticky top-0 z-20 flex items-center justify-between border-b bg-white px-6 py-3.5 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/portfolio"
            className="flex items-center gap-1 text-xs text-[#242423]/50 transition hover:text-[#242423]"
          >
            <ChevronLeft size={13} /> Portfolio
          </Link>
          <span className="text-[#242423]/20">/</span>
          <span className="text-sm font-bold text-[#242423]">Edit Portfolio</span>
        </div>
        <div className="flex items-center gap-2">
          {error && <span className="text-xs text-red-600">{error}</span>}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-lg bg-[#f5a700] px-4 py-1.5 text-sm font-bold text-white transition hover:bg-[#f5a700]/90 disabled:opacity-60"
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-xl space-y-5 px-4 py-10">
        <div className="border-[#242423]/8 space-y-4 rounded-2xl border bg-white p-6">
          {/* Image */}
          <div>
            <label className="mb-2 block text-xs font-semibold text-[#242423]/55">Gambar *</label>
            {imageUrl ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-[#242423]/10">
                <Image src={imageUrl} alt="preview" fill className="object-cover" />
                <button
                  onClick={() => setImageUrl("")}
                  className="border-[#242423]/12 absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full border bg-white transition hover:bg-red-50"
                >
                  <X size={10} className="text-[#242423]/50" />
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#242423]/15 px-4 py-8 text-xs text-[#242423]/40 transition hover:border-[#f5a700]/50 hover:text-[#f5a700]">
                {uploading ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
                {uploading ? "Mengupload..." : "Klik untuk upload gambar"}
                <span className="text-[#242423]/25">JPG, PNG, WebP · Maks 5MB</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleUpload(f);
                    e.target.value = "";
                  }}
                />
              </label>
            )}
          </div>

          {/* Layanan */}
          <div>
            <label className="mb-2 block text-xs font-semibold text-[#242423]/55">Layanan *</label>
            {!useCustom ? (
              <div className="flex gap-2">
                <select
                  value={serviceSlug}
                  onChange={(e) => setServiceSlug(e.target.value)}
                  className={inputClass}
                >
                  {SERVICE_SLUGS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setUseCustom(true)}
                  className="flex-shrink-0 whitespace-nowrap text-xs text-[#242423]/40 underline transition hover:text-[#242423]"
                >
                  Custom
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  value={customSlug}
                  onChange={(e) => setCustomSlug(e.target.value)}
                  placeholder="custom-service-slug"
                  className={`${inputClass} font-mono`}
                />
                <button
                  type="button"
                  onClick={() => setUseCustom(false)}
                  className="flex-shrink-0 whitespace-nowrap text-xs text-[#242423]/40 underline transition hover:text-[#242423]"
                >
                  Pilih list
                </button>
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-[#242423]/55">
              Judul / Nama Klien *
            </label>
            <input
              className={inputClass}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Toko Batik Nusantara"
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-[#242423]/55">
              Kategori Bisnis
            </label>
            <input
              className={inputClass}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Fashion & Retail"
            />
          </div>

          {/* Link URL */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-[#242423]/55">
              Link Halaman / Website
            </label>
            <input
              className={inputClass}
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="/porto/karya-bangun-nusantara atau https://..."
            />
            <p className="mt-1 text-xs text-[#242423]/35">
              Opsional. Kalau diisi, thumbnail bisa diklik menuju halaman porto/website ini.
            </p>
          </div>

          {/* Sort order */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-[#242423]/55">
              Urutan Tampil
            </label>
            <input
              type="number"
              className={inputClass}
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              min={0}
            />
            <p className="mt-1 text-xs text-[#242423]/35">
              Angka kecil tampil duluan (0 = paling depan)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
