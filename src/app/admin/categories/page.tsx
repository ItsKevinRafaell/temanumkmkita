"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  fetchCategories, createCategory, updateCategory, deleteCategory,
  type AdminCategory,
} from "@/lib/api/admin";
import { FileText, Plus, Pencil, Trash2, Check, X, ChevronLeft, Loader2 } from "lucide-react";

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
}

export default function CategoriesPage() {
  const router = useRouter();
  const [cats, setCats] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [saving, setSaving] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    try {
      setCats(await fetchCategories());
    } catch {
      router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleAdd() {
    if (!newName.trim() || !newSlug.trim()) { setError("Nama dan slug wajib diisi."); return; }
    setAdding(true);
    setError("");
    try {
      await createCategory({ name: newName.trim(), slug: newSlug.trim() });
      setNewName("");
      setNewSlug("");
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal menambah");
    } finally {
      setAdding(false);
    }
  }

  function startEdit(cat: AdminCategory) {
    setEditId(cat.id);
    setEditName(cat.name);
    setEditSlug(cat.slug);
    setError("");
  }

  async function handleSaveEdit() {
    if (!editId || !editName.trim() || !editSlug.trim()) { setError("Nama dan slug wajib diisi."); return; }
    setSaving(true);
    setError("");
    try {
      await updateCategory(editId, { name: editName.trim(), slug: editSlug.trim() });
      setEditId(null);
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(cat: AdminCategory) {
    if (!confirm(`Hapus kategori "${cat.name}"?`)) return;
    try {
      await deleteCategory(cat.id);
      await load();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal menghapus");
    }
  }

  return (
    <div className="min-h-screen bg-[#fcfaf7]">
      <header className="bg-white border-b border-[#242423]/8 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-[#f5a700] rounded-lg flex items-center justify-center">
            <FileText size={13} className="text-white" />
          </div>
          <span className="font-extrabold text-[#242423] text-base">Teman UMKM Kita</span>
          <span className="text-[#242423]/20 text-sm">/ Admin</span>
        </div>
        <Link
          href="/admin/posts"
          className="flex items-center gap-1.5 text-xs text-[#242423]/50 hover:text-[#242423] transition"
        >
          <ChevronLeft size={13} /> Artikel
        </Link>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-extrabold text-[#242423]">Kategori</h1>
          <p className="text-xs text-[#242423]/45 mt-0.5">{cats.length} kategori</p>
        </div>

        {/* Category list */}
        <div className="bg-white border border-[#242423]/8 rounded-2xl overflow-hidden shadow-sm mb-6">
          {loading ? (
            <div className="py-16 text-center text-sm text-[#242423]/40">Memuat...</div>
          ) : cats.length === 0 ? (
            <div className="py-16 text-center text-sm text-[#242423]/40">Belum ada kategori.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#242423]/6 bg-[#242423]/2">
                  <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#242423]/40">Nama</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#242423]/40">Slug</th>
                  <th className="px-4 py-3 w-24" />
                </tr>
              </thead>
              <tbody>
                {cats.map((cat) => (
                  <tr key={cat.id} className="border-b border-[#242423]/5 last:border-0 hover:bg-[#242423]/1 transition">
                    <td className="px-5 py-3">
                      {editId === cat.id ? (
                        <input
                          className="w-full border border-[#242423]/15 rounded-lg px-3 py-1.5 text-sm text-[#242423] bg-white focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30 focus:border-[#f5a700]"
                          value={editName}
                          onChange={(e) => {
                            setEditName(e.target.value);
                            setEditSlug(slugify(e.target.value));
                          }}
                          autoFocus
                        />
                      ) : (
                        <span className="font-semibold text-[#242423]">{cat.name}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editId === cat.id ? (
                        <input
                          className="w-full border border-[#242423]/15 rounded-lg px-3 py-1.5 text-xs text-[#242423] font-mono bg-white focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30 focus:border-[#f5a700]"
                          value={editSlug}
                          onChange={(e) => setEditSlug(slugify(e.target.value))}
                        />
                      ) : (
                        <code className="text-xs text-[#242423]/50 font-mono">{cat.slug}</code>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editId === cat.id ? (
                        <div className="flex items-center gap-1.5 justify-end">
                          <button
                            onClick={handleSaveEdit}
                            disabled={saving}
                            className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#f5a700] text-white hover:bg-[#f5a700]/90 disabled:opacity-50 transition"
                          >
                            {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                          </button>
                          <button
                            onClick={() => setEditId(null)}
                            className="flex items-center justify-center w-8 h-8 rounded-lg border border-[#242423]/12 text-[#242423]/50 hover:text-[#242423] transition"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 justify-end">
                          <button
                            onClick={() => startEdit(cat)}
                            className="flex items-center justify-center w-8 h-8 rounded-lg border border-[#242423]/10 text-[#242423]/50 hover:text-[#242423] hover:border-[#242423]/25 transition"
                          >
                            <Pencil size={12} />
                          </button>
                          <button
                            onClick={() => handleDelete(cat)}
                            className="flex items-center justify-center w-8 h-8 rounded-lg border border-[#242423]/10 text-[#242423]/50 hover:text-red-600 hover:border-red-200 transition"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Add category */}
        <div className="bg-white border border-[#242423]/8 rounded-2xl p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-[#242423]/35 mb-4">Tambah Kategori</p>
          {error && <p className="text-xs text-red-600 mb-3">{error}</p>}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-[#242423]/50 mb-1">Nama</label>
              <input
                className="w-full border border-[#242423]/15 rounded-xl px-3 py-2 text-sm text-[#242423] bg-white focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30 focus:border-[#f5a700]"
                placeholder="Nama kategori"
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value);
                  setNewSlug(slugify(e.target.value));
                }}
                onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-[#242423]/50 mb-1">Slug</label>
              <input
                className="w-full border border-[#242423]/15 rounded-xl px-3 py-2 text-sm text-[#242423] font-mono bg-white focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30 focus:border-[#f5a700]"
                placeholder="slug-kategori"
                value={newSlug}
                onChange={(e) => setNewSlug(slugify(e.target.value))}
                onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleAdd}
                disabled={adding}
                className="flex items-center gap-1.5 bg-[#f5a700] text-white font-bold px-4 py-2 rounded-xl text-sm hover:bg-[#f5a700]/90 disabled:opacity-60 transition"
              >
                {adding ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
                Tambah
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
