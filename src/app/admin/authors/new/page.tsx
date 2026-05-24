"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Save, ChevronLeft, Loader2, Upload, X } from "lucide-react";
import { createAuthor, uploadImage } from "@/lib/api/admin";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
}

export default function NewAuthorPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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
    if (!name.trim() || !slug.trim()) { setError("Nama dan slug wajib diisi."); return; }
    setSaving(true);
    setError("");
    try {
      await createAuthor({
        name, slug, role: role || null, bio: bio || null,
        photo_url: photoUrl || null, linkedin_url: linkedinUrl || null,
      });
      router.push("/admin/authors");
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
          <Link href="/admin/authors" className="flex items-center gap-1 text-xs text-[#242423]/50 hover:text-[#242423] transition">
            <ChevronLeft size={13} /> Penulis
          </Link>
          <span className="text-[#242423]/20">/</span>
          <span className="text-sm font-bold text-[#242423]">Penulis Baru</span>
        </div>
        <div className="flex items-center gap-2">
          {error && <span className="text-xs text-red-600">{error}</span>}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 bg-[#f5a700] text-white font-bold px-4 py-1.5 rounded-lg text-sm hover:bg-[#f5a700]/90 disabled:opacity-60 transition"
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-4 py-10 space-y-5">
        <div className="bg-white border border-[#242423]/8 rounded-2xl p-6 space-y-4">
          {/* Photo */}
          <div>
            <label className="block text-xs font-semibold text-[#242423]/55 mb-2">Foto</label>
            {photoUrl ? (
              <div className="relative w-20 h-20">
                <img src={photoUrl} alt="foto" className="w-20 h-20 rounded-full object-cover border border-[#242423]/10" />
                <button onClick={() => setPhotoUrl("")} className="absolute -top-1 -right-1 w-5 h-5 bg-white border border-[#242423]/12 rounded-full flex items-center justify-center hover:bg-red-50 transition">
                  <X size={9} className="text-[#242423]/50" />
                </button>
              </div>
            ) : (
              <label className="flex items-center gap-2 cursor-pointer w-fit border border-dashed border-[#242423]/15 rounded-xl px-4 py-3 text-xs text-[#242423]/40 hover:border-[#f5a700]/50 hover:text-[#f5a700] transition">
                {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                {uploading ? "Mengupload..." : "Upload foto"}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePhoto(f); e.target.value = ""; }} />
              </label>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-[#242423]/55 mb-1">Nama *</label>
            <input className="w-full border border-[#242423]/12 rounded-lg px-3 py-2 text-sm text-[#242423] bg-white focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30 focus:border-[#f5a700]"
              value={name} onChange={(e) => { setName(e.target.value); setSlug(slugify(e.target.value)); }} placeholder="Nama penulis" />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-xs font-semibold text-[#242423]/55 mb-1">Slug *</label>
            <input className="w-full border border-[#242423]/12 rounded-lg px-3 py-2 text-sm text-[#242423] font-mono bg-white focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30 focus:border-[#f5a700]"
              value={slug} onChange={(e) => setSlug(slugify(e.target.value))} placeholder="nama-penulis" />
          </div>

          {/* Role */}
          <div>
            <label className="block text-xs font-semibold text-[#242423]/55 mb-1">Jabatan / Role</label>
            <input className="w-full border border-[#242423]/12 rounded-lg px-3 py-2 text-sm text-[#242423] bg-white focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30 focus:border-[#f5a700]"
              value={role} onChange={(e) => setRole(e.target.value)} placeholder="Digital Marketing Specialist" />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold text-[#242423]/55 mb-1">Bio singkat</label>
            <textarea className="w-full border border-[#242423]/12 rounded-lg px-3 py-2 text-sm text-[#242423] bg-white focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30 focus:border-[#f5a700] resize-none"
              rows={3} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Deskripsi singkat tentang penulis..." />
          </div>

          {/* LinkedIn */}
          <div>
            <label className="block text-xs font-semibold text-[#242423]/55 mb-1">LinkedIn URL</label>
            <input type="url" className="w-full border border-[#242423]/12 rounded-lg px-3 py-2 text-sm text-[#242423] bg-white focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30 focus:border-[#f5a700]"
              value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/in/..." />
          </div>
        </div>
      </div>
    </div>
  );
}
