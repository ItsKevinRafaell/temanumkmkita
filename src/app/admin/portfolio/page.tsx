"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  adminListPortfolios, adminDeletePortfolio, logout,
  type AdminPortfolioItem,
} from "@/lib/api/admin";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { PenLine, Trash2, Plus, LogOut, FileText, Images } from "lucide-react";

const SERVICE_LABELS: Record<string, string> = {
  "web-development": "Web Development",
  "web-development-bulanan": "Web Dev Bulanan",
  "seo-google-maps": "SEO & Google Maps",
  "kelola-sosial-media": "Kelola Sosmed",
  "desain-logo": "Desain Logo",
};

const SERVICE_SLUGS = Object.keys(SERVICE_LABELS);

export default function AdminPortfolioPage() {
  const router = useRouter();
  const [items, setItems] = useState<AdminPortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [modal, setModal] = useState<{ id: string; title: string } | null>(null);
  const [slugFilter, setSlugFilter] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminListPortfolios(slugFilter || undefined);
      setItems(data);
    } catch {
      router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  }, [router, slugFilter]);

  useEffect(() => { load(); }, [load]);

  async function confirmDelete() {
    if (!modal) return;
    setDeleting(modal.id);
    setModal(null);
    try {
      await adminDeletePortfolio(modal.id);
      await load();
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
      <header className="bg-white border-b border-[#242423]/8 px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-7 h-7 bg-[#f5a700] rounded-lg flex items-center justify-center flex-shrink-0">
            <FileText size={13} className="text-white" />
          </div>
          <span className="hidden sm:inline font-extrabold text-[#242423] text-base">Teman UMKM Kita</span>
          <span className="hidden sm:inline text-[#242423]/20 text-sm">/ Admin</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs text-[#242423]/50 hover:text-[#242423] transition"
        >
          <LogOut size={13} /> Keluar
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Images size={16} className="text-[#f5a700]" />
              <h1 className="text-xl font-extrabold text-[#242423]">Portfolio</h1>
            </div>
            <p className="text-xs text-[#242423]/45">{items.length} item</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/posts"
              className="flex items-center gap-2 border border-[#242423]/12 text-[#242423]/55 font-semibold px-3 py-2.5 rounded-xl text-sm hover:border-[#242423]/25 hover:text-[#242423] transition"
            >
              Artikel
            </Link>
            <Link
              href="/admin/portfolio/new"
              className="flex items-center gap-2 bg-[#f5a700] text-white font-bold px-4 py-2.5 rounded-xl text-sm hover:bg-[#f5a700]/90 transition"
            >
              <Plus size={14} /> Tambah Portfolio
            </Link>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 mb-4">
          <select
            value={slugFilter}
            onChange={(e) => setSlugFilter(e.target.value)}
            className="border border-[#242423]/12 rounded-lg px-3 py-1.5 text-xs text-[#242423] bg-white focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30"
          >
            <option value="">Semua layanan</option>
            {SERVICE_SLUGS.map((s) => (
              <option key={s} value={s}>{SERVICE_LABELS[s]}</option>
            ))}
          </select>
          {slugFilter && (
            <button
              onClick={() => setSlugFilter("")}
              className="text-xs text-[#242423]/40 hover:text-[#242423] underline transition"
            >
              Reset
            </button>
          )}
        </div>

        {/* Table */}
        <div className="bg-white border border-[#242423]/8 rounded-2xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-20 text-center text-sm text-[#242423]/40">Memuat...</div>
          ) : items.length === 0 ? (
            <div className="py-20 text-center text-sm text-[#242423]/40">Belum ada portfolio.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#242423]/6 bg-[#242423]/2">
                  <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#242423]/40">Gambar</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#242423]/40">Judul</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#242423]/40 hidden sm:table-cell">Layanan</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#242423]/40 hidden md:table-cell">Kategori</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#242423]/40 hidden md:table-cell">Urutan</th>
                  <th className="px-4 py-3 w-20" />
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr
                    key={item.id}
                    className={`border-b border-[#242423]/5 last:border-0 hover:bg-[#242423]/1 transition ${
                      i % 2 !== 0 ? "bg-[#242423]/1" : ""
                    }`}
                  >
                    <td className="px-5 py-3">
                      <div className="w-12 h-9 rounded-lg overflow-hidden border border-[#242423]/8 bg-[#242423]/4 relative flex-shrink-0">
                        <Image src={item.image_url} alt={item.title} fill className="object-cover" sizes="48px" />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-[#242423] line-clamp-1">{item.title}</div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#f5a700]/10 text-[#f5a700]">
                        {SERVICE_LABELS[item.service_slug] ?? item.service_slug}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#242423]/50 hidden md:table-cell">
                      {item.category ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-[#242423]/50 hidden md:table-cell">
                      {item.sort_order}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <Link
                          href={`/admin/portfolio/${item.id}`}
                          className="flex items-center justify-center w-8 h-8 rounded-lg border border-[#242423]/10 text-[#242423]/50 hover:text-[#242423] hover:border-[#242423]/25 transition"
                        >
                          <PenLine size={13} />
                        </Link>
                        <button
                          onClick={() => setModal({ id: item.id, title: item.title })}
                          disabled={deleting === item.id}
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
      </main>

      <ConfirmModal
        open={modal !== null}
        title="Hapus Portfolio"
        message={modal ? `Item "${modal.title}" akan dihapus permanen.` : ""}
        confirmLabel="Hapus"
        onConfirm={confirmDelete}
        onCancel={() => setModal(null)}
      />
    </div>
  );
}
