"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  adminListPortfolios,
  adminDeletePortfolio,
  logout,
  type AdminPortfolioItem,
} from "@/lib/api/admin";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { PenLine, Trash2, Plus, LogOut, FileText, Images } from "lucide-react";

const SERVICE_LABELS: Record<string, string> = {
  "web-development": "Web Development",
  "web-development-bulanan": "Web Dev Bulanan",
  "seo-google-maps": "SEO & Google Maps",
  "kelola-sosial-media": "Kelola Sosmed",
  maintenance: "Maintenance Website",
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

  useEffect(() => {
    load();
  }, [load]);

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
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs text-[#242423]/50 transition hover:text-[#242423]"
        >
          <LogOut size={13} /> Keluar
        </button>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Images size={16} className="text-[#f5a700]" />
              <h1 className="text-xl font-extrabold text-[#242423]">Portfolio</h1>
            </div>
            <p className="text-xs text-[#242423]/45">{items.length} item</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/posts"
              className="border-[#242423]/12 flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold text-[#242423]/55 transition hover:border-[#242423]/25 hover:text-[#242423]"
            >
              Artikel
            </Link>
            <Link
              href="/admin/portfolio/new"
              className="flex items-center gap-2 rounded-xl bg-[#f5a700] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#f5a700]/90"
            >
              <Plus size={14} /> Tambah Portfolio
            </Link>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-4 flex items-center gap-2">
          <select
            value={slugFilter}
            onChange={(e) => setSlugFilter(e.target.value)}
            className="border-[#242423]/12 rounded-lg border bg-white px-3 py-1.5 text-xs text-[#242423] focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30"
          >
            <option value="">Semua layanan</option>
            {SERVICE_SLUGS.map((s) => (
              <option key={s} value={s}>
                {SERVICE_LABELS[s]}
              </option>
            ))}
          </select>
          {slugFilter && (
            <button
              onClick={() => setSlugFilter("")}
              className="text-xs text-[#242423]/40 underline transition hover:text-[#242423]"
            >
              Reset
            </button>
          )}
        </div>

        {/* Table */}
        <div className="border-[#242423]/8 overflow-hidden rounded-2xl border bg-white shadow-sm">
          {loading ? (
            <div className="py-20 text-center text-sm text-[#242423]/40">Memuat...</div>
          ) : items.length === 0 ? (
            <div className="py-20 text-center text-sm text-[#242423]/40">Belum ada portfolio.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-[#242423]/6 bg-[#242423]/2 border-b">
                  <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#242423]/40">
                    Gambar
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#242423]/40">
                    Judul
                  </th>
                  <th className="hidden px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#242423]/40 sm:table-cell">
                    Layanan
                  </th>
                  <th className="hidden px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#242423]/40 md:table-cell">
                    Kategori
                  </th>
                  <th className="hidden px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#242423]/40 md:table-cell">
                    Urutan
                  </th>
                  <th className="w-20 px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-[#242423]/1 border-b border-[#242423]/5 transition last:border-0 ${
                      i % 2 !== 0 ? "bg-[#242423]/1" : ""
                    }`}
                  >
                    <td className="px-5 py-3">
                      <div className="border-[#242423]/8 bg-[#242423]/4 relative h-9 w-12 flex-shrink-0 overflow-hidden rounded-lg border">
                        <Image
                          src={item.image_url}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="line-clamp-1 font-semibold text-[#242423]">{item.title}</div>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <span className="rounded-full bg-[#f5a700]/10 px-2 py-0.5 text-xs font-semibold text-[#f5a700]">
                        {SERVICE_LABELS[item.service_slug] ?? item.service_slug}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 text-xs text-[#242423]/50 md:table-cell">
                      {item.category ?? "—"}
                    </td>
                    <td className="hidden px-4 py-3 text-xs text-[#242423]/50 md:table-cell">
                      {item.sort_order}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/portfolio/${item.id}`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#242423]/10 text-[#242423]/50 transition hover:border-[#242423]/25 hover:text-[#242423]"
                        >
                          <PenLine size={13} />
                        </Link>
                        <button
                          onClick={() => setModal({ id: item.id, title: item.title })}
                          disabled={deleting === item.id}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#242423]/10 text-[#242423]/50 transition hover:border-red-200 hover:text-red-600 disabled:opacity-40"
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
