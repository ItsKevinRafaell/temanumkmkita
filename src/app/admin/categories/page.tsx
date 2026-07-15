"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  type AdminCategory,
} from "@/lib/api/admin";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { FileText, Plus, Pencil, Trash2, Check, X, ChevronLeft, Loader2 } from "lucide-react";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
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
  const [deleteTarget, setDeleteTarget] = useState<AdminCategory | null>(null);

  async function load() {
    try {
      setCats(await fetchCategories());
    } catch {
      router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  async function handleAdd() {
    if (!newName.trim() || !newSlug.trim()) {
      setError("Nama dan slug wajib diisi.");
      return;
    }
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
    if (!editId || !editName.trim() || !editSlug.trim()) {
      setError("Nama dan slug wajib diisi.");
      return;
    }
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
    setDeleteTarget(cat);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleteTarget(null);
    try {
      await deleteCategory(deleteTarget.id);
      await load();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal menghapus");
    }
  }

  return (
    <div className="min-h-screen bg-[#fcfaf7]">
      <header className="border-[#242423]/8 flex items-center justify-between border-b bg-white px-4 py-4 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[#f5a700]">
            <FileText size={13} className="text-white" />
          </div>
          <span className="hidden text-base font-extrabold text-[#242423] sm:inline">
            Teman UMKM Kita
          </span>
          <span className="hidden text-sm text-[#242423]/20 sm:inline">/ Admin</span>
        </div>
        <Link
          href="/admin/posts"
          className="flex items-center gap-1.5 text-xs text-[#242423]/50 transition hover:text-[#242423]"
        >
          <ChevronLeft size={13} /> Artikel
        </Link>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-extrabold text-[#242423]">Kategori</h1>
          <p className="mt-0.5 text-xs text-[#242423]/45">{cats.length} kategori</p>
        </div>

        {/* Category list */}
        <div className="border-[#242423]/8 mb-6 overflow-hidden rounded-2xl border bg-white shadow-sm">
          {loading ? (
            <div className="py-16 text-center text-sm text-[#242423]/40">Memuat...</div>
          ) : cats.length === 0 ? (
            <div className="py-16 text-center text-sm text-[#242423]/40">Belum ada kategori.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-[#242423]/6 bg-[#242423]/2 border-b">
                  <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#242423]/40">
                    Nama
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#242423]/40">
                    Slug
                  </th>
                  <th className="w-24 px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {cats.map((cat) => (
                  <tr
                    key={cat.id}
                    className="hover:bg-[#242423]/1 border-b border-[#242423]/5 transition last:border-0"
                  >
                    <td className="px-5 py-3">
                      {editId === cat.id ? (
                        <input
                          className="w-full rounded-lg border border-[#242423]/15 bg-white px-3 py-1.5 text-sm text-[#242423] focus:border-[#f5a700] focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30"
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
                          className="w-full rounded-lg border border-[#242423]/15 bg-white px-3 py-1.5 font-mono text-xs text-[#242423] focus:border-[#f5a700] focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30"
                          value={editSlug}
                          onChange={(e) => setEditSlug(slugify(e.target.value))}
                        />
                      ) : (
                        <code className="font-mono text-xs text-[#242423]/50">{cat.slug}</code>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editId === cat.id ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={handleSaveEdit}
                            disabled={saving}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f5a700] text-white transition hover:bg-[#f5a700]/90 disabled:opacity-50"
                          >
                            {saving ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <Check size={12} />
                            )}
                          </button>
                          <button
                            onClick={() => setEditId(null)}
                            className="border-[#242423]/12 flex h-8 w-8 items-center justify-center rounded-lg border text-[#242423]/50 transition hover:text-[#242423]"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => startEdit(cat)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#242423]/10 text-[#242423]/50 transition hover:border-[#242423]/25 hover:text-[#242423]"
                          >
                            <Pencil size={12} />
                          </button>
                          <button
                            onClick={() => handleDelete(cat)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#242423]/10 text-[#242423]/50 transition hover:border-red-200 hover:text-red-600"
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
        <div className="border-[#242423]/8 rounded-2xl border bg-white p-5">
          <p className="mb-4 text-xs font-bold uppercase tracking-wider text-[#242423]/35">
            Tambah Kategori
          </p>
          {error && <p className="mb-3 text-xs text-red-600">{error}</p>}
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-semibold text-[#242423]/50">Nama</label>
              <input
                className="w-full rounded-xl border border-[#242423]/15 bg-white px-3 py-2 text-sm text-[#242423] focus:border-[#f5a700] focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30"
                placeholder="Nama kategori"
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value);
                  setNewSlug(slugify(e.target.value));
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAdd();
                }}
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs font-semibold text-[#242423]/50">Slug</label>
              <input
                className="w-full rounded-xl border border-[#242423]/15 bg-white px-3 py-2 font-mono text-sm text-[#242423] focus:border-[#f5a700] focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30"
                placeholder="slug-kategori"
                value={newSlug}
                onChange={(e) => setNewSlug(slugify(e.target.value))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAdd();
                }}
              />
            </div>
            <div className="flex sm:items-end">
              <button
                onClick={handleAdd}
                disabled={adding}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#f5a700] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#f5a700]/90 disabled:opacity-60 sm:w-auto"
              >
                {adding ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
                Tambah
              </button>
            </div>
          </div>
        </div>
      </main>

      <ConfirmModal
        open={deleteTarget !== null}
        title="Hapus Kategori"
        message={deleteTarget ? `Kategori "${deleteTarget.name}" akan dihapus permanen.` : ""}
        confirmLabel="Hapus"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
