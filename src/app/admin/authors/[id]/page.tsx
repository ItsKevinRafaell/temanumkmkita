"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { Save, ChevronLeft, Loader2, Upload, X } from "lucide-react";
import { fetchAuthor, updateAuthor, uploadImage } from "@/lib/api/admin";

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export default function EditAuthorPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAuthor(id)
      .then((a) => {
        setName(a.name);
        setSlug(a.slug);
        setRole(a.role ?? "");
        setBio(a.bio ?? "");
        setPhotoUrl(a.photo_url ?? "");
        setLinkedinUrl(a.linkedin_url ?? "");
      })
      .catch(() => router.push("/admin/authors"))
      .finally(() => setLoading(false));
  }, [id, router]);

  async function handlePhoto(file: File) {
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setPhotoUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload gagal");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!name.trim() || !slug.trim()) {
      setError("Nama dan slug wajib diisi.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await updateAuthor(id, {
        name,
        slug,
        role: role || null,
        bio: bio || null,
        photo_url: photoUrl || null,
        linkedin_url: linkedinUrl || null,
      });
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
      <header className="border-[#242423]/8 sticky top-0 z-20 flex items-center justify-between border-b bg-white px-6 py-3.5 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/authors"
            className="flex items-center gap-1 text-xs text-[#242423]/50 transition hover:text-[#242423]"
          >
            <ChevronLeft size={13} /> Penulis
          </Link>
          <span className="text-[#242423]/20">/</span>
          <span className="text-sm font-bold text-[#242423]">Edit Penulis</span>
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

      <div className="mx-auto max-w-xl px-4 py-10">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-[#242423]/30" />
          </div>
        ) : (
          <div className="border-[#242423]/8 space-y-4 rounded-2xl border bg-white p-6">
            {/* Photo */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-[#242423]/55">Foto</label>
              {photoUrl ? (
                <div className="relative h-20 w-20">
                  <Image
                    src={photoUrl}
                    alt="foto"
                    width={80}
                    height={80}
                    className="h-20 w-20 rounded-full border border-[#242423]/10 object-cover"
                  />
                  <button
                    onClick={() => setPhotoUrl("")}
                    className="border-[#242423]/12 absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border bg-white transition hover:bg-red-50"
                  >
                    <X size={9} className="text-[#242423]/50" />
                  </button>
                </div>
              ) : (
                <label className="flex w-fit cursor-pointer items-center gap-2 rounded-xl border border-dashed border-[#242423]/15 px-4 py-3 text-xs text-[#242423]/40 transition hover:border-[#f5a700]/50 hover:text-[#f5a700]">
                  {uploading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Upload size={14} />
                  )}
                  {uploading ? "Mengupload..." : "Upload foto"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handlePhoto(f);
                      e.target.value = "";
                    }}
                  />
                </label>
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-[#242423]/55">Nama *</label>
              <input
                className="border-[#242423]/12 w-full rounded-lg border bg-white px-3 py-2 text-sm text-[#242423] focus:border-[#f5a700] focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-[#242423]/55">Slug *</label>
              <input
                className="border-[#242423]/12 w-full rounded-lg border bg-white px-3 py-2 font-mono text-sm text-[#242423] focus:border-[#f5a700] focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30"
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-[#242423]/55">
                Jabatan / Role
              </label>
              <input
                className="border-[#242423]/12 w-full rounded-lg border bg-white px-3 py-2 text-sm text-[#242423] focus:border-[#f5a700] focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-[#242423]/55">
                Bio singkat
              </label>
              <textarea
                className="border-[#242423]/12 w-full resize-none rounded-lg border bg-white px-3 py-2 text-sm text-[#242423] focus:border-[#f5a700] focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30"
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-[#242423]/55">
                LinkedIn URL
              </label>
              <input
                type="url"
                className="border-[#242423]/12 w-full rounded-lg border bg-white px-3 py-2 text-sm text-[#242423] focus:border-[#f5a700] focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
