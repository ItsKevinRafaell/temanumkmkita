"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminListArticles, adminDeleteArticle, logout, type AdminArticle } from "@/lib/api/admin";
import ConfirmModal from "@/components/ui/ConfirmModal";
import {
  PenLine, Trash2, Plus, LogOut, FileText,
  CheckCircle, Clock, ChevronLeft, ChevronRight,
} from "lucide-react";

const categoryColors: Record<string, string> = {
  Website: "bg-blue-50 text-blue-700",
  SEO: "bg-green-50 text-green-700",
  "Sosial Media": "bg-pink-50 text-pink-700",
  Branding: "bg-purple-50 text-purple-700",
  "Tips Bisnis": "bg-amber-50 text-amber-700",
};

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export default function AdminPostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<AdminArticle[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [modal, setModal] = useState<{ id: string; title: string } | null>(null);

  const load = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const data = await adminListArticles(p, 15);
      setPosts(data.items);
      setTotal(data.total);
      setPages(data.pages);
    } catch {
      router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { load(page); }, [page, load]);

  async function handleDelete(id: string, title: string) {
    setModal({ id, title });
  }

  async function confirmDelete() {
    if (!modal) return;
    setDeleting(modal.id);
    setModal(null);
    try {
      await adminDeleteArticle(modal.id);
      await load(page);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal menghapus");
    } finally {
      setDeleting(null);
    }
  }

  function handleLogout() {
    logout();
    document.cookie = "admin_token=; path=/; max-age=0";
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#fcfaf7]">
      {/* ── Top bar ─────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-[#242423]/8 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-[#f5a700] rounded-lg flex items-center justify-center">
            <FileText size={13} className="text-white" />
          </div>
          <span className="font-extrabold text-[#242423] text-base">Teman UMKM Kita</span>
          <span className="text-[#242423]/20 text-sm">/ Admin</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs text-[#242423]/50 hover:text-[#242423] transition"
        >
          <LogOut size={13} /> Keluar
        </button>
      </header>

      {/* ── Content ─────────────────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-extrabold text-[#242423]">Artikel</h1>
            <p className="text-xs text-[#242423]/45 mt-0.5">{total} total artikel</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/categories"
              className="flex items-center gap-2 border border-[#242423]/12 text-[#242423]/55 font-semibold px-3 py-2.5 rounded-xl text-sm hover:border-[#242423]/25 hover:text-[#242423] transition"
            >
              Kategori
            </Link>
            <Link
              href="/admin/posts/new"
              className="flex items-center gap-2 bg-[#f5a700] text-white font-bold px-4 py-2.5 rounded-xl text-sm hover:bg-[#f5a700]/90 transition"
            >
              <Plus size={14} /> Artikel Baru
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-[#242423]/8 rounded-2xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-20 text-center text-sm text-[#242423]/40">Memuat...</div>
          ) : posts.length === 0 ? (
            <div className="py-20 text-center text-sm text-[#242423]/40">Belum ada artikel.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#242423]/6 bg-[#242423]/2">
                  <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#242423]/40">Judul</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#242423]/40 hidden sm:table-cell">Kategori</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#242423]/40 hidden md:table-cell">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#242423]/40 hidden lg:table-cell">Tanggal</th>
                  <th className="px-4 py-3 w-20" />
                </tr>
              </thead>
              <tbody>
                {posts.map((post, i) => (
                  <tr
                    key={post.id}
                    className={`border-b border-[#242423]/5 last:border-0 hover:bg-[#242423]/1 transition ${
                      i % 2 !== 0 ? "bg-[#242423]/1" : ""
                    }`}
                  >
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-[#242423] leading-snug line-clamp-1">{post.title}</div>
                      <div className="text-xs text-[#242423]/40 mt-0.5">{post.slug}</div>
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      {post.category ? (
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${categoryColors[post.category] ?? "bg-gray-50 text-gray-600"}`}>
                          {post.category}
                        </span>
                      ) : (
                        <span className="text-[#242423]/25">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      {post.status === "published" ? (
                        <span className="flex items-center gap-1 text-xs text-green-700 font-semibold">
                          <CheckCircle size={11} /> Tayang
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-[#242423]/45 font-semibold">
                          <Clock size={11} /> Draft
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-[#242423]/45 hidden lg:table-cell">
                      {formatDate(post.published_at ?? post.created_at)}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2 justify-end">
                        <Link
                          href={`/admin/posts/${post.id}`}
                          className="flex items-center justify-center w-8 h-8 rounded-lg border border-[#242423]/10 text-[#242423]/50 hover:text-[#242423] hover:border-[#242423]/25 transition"
                        >
                          <PenLine size={13} />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id, post.title)}
                          disabled={deleting === post.id}
                          className="flex items-center justify-center w-8 h-8 rounded-lg border border-[#242423]/10 text-[#242423]/50 hover:text-red-600 hover:border-red-200 disabled:opacity-40 transition"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between mt-5">
            <p className="text-xs text-[#242423]/40">Halaman {page} dari {pages}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
                className="flex items-center gap-1 px-3 py-1.5 border border-[#242423]/12 text-xs text-[#242423]/60 rounded-lg hover:border-[#f5a700] hover:text-[#f5a700] disabled:opacity-30 disabled:pointer-events-none transition"
              >
                <ChevronLeft size={12} /> Sebelumnya
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page === pages}
                className="flex items-center gap-1 px-3 py-1.5 border border-[#242423]/12 text-xs text-[#242423]/60 rounded-lg hover:border-[#f5a700] hover:text-[#f5a700] disabled:opacity-30 disabled:pointer-events-none transition"
              >
                Berikutnya <ChevronRight size={12} />
              </button>
            </div>
          </div>
        )}
      </main>

      <ConfirmModal
        open={modal !== null}
        title="Hapus Artikel"
        message={modal ? `Artikel "${modal.title}" akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.` : ""}
        confirmLabel="Hapus"
        onConfirm={confirmDelete}
        onCancel={() => setModal(null)}
      />
    </div>
  );
}
