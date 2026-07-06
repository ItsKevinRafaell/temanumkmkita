"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminListArticles, adminDeleteArticle, logout, adminBulkPublish, type AdminArticle } from "@/lib/api/admin";
import ConfirmModal from "@/components/ui/ConfirmModal";
import BulkGenerateModal from "@/components/ui/BulkGenerateModal";
import {
  PenLine, Trash2, Plus, LogOut, FileText,
  CheckCircle, Clock, ChevronLeft, ChevronRight,
  ArrowUpDown, Star, Map as MapIcon, Settings, Users, Images, Menu, CalendarDays,
  Sparkles, Send, CheckSquare, Square,
} from "lucide-react";

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

const MONTHS = [
  { value: "01", label: "Jan" },
  { value: "02", label: "Feb" },
  { value: "03", label: "Mar" },
  { value: "04", label: "Apr" },
  { value: "05", label: "Mei" },
  { value: "06", label: "Jun" },
  { value: "07", label: "Jul" },
  { value: "08", label: "Agu" },
  { value: "09", label: "Sep" },
  { value: "10", label: "Okt" },
  { value: "11", label: "Nov" },
  { value: "12", label: "Des" },
];

const YEAR_OPTIONS = Array.from(new Set([
  new Date().getFullYear() - 1,
  new Date().getFullYear(),
  new Date().getFullYear() + 1,
  new Date().getFullYear() + 2,
  2026,
  2027,
])).sort((a, b) => a - b);

function articleDate(post: AdminArticle) {
  return post.published_at ?? post.created_at;
}

function formatMonth(iso: string | null) {
  if (!iso) return "Tanpa bulan";
  return new Date(iso).toLocaleDateString("id-ID", { month: "short", year: "numeric" });
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
  const [navOpen, setNavOpen] = useState(false);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkEligible, setBulkEligible] = useState<{ id: string; title: string; slug: string; cover_image?: string | null }[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [publishing, setPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<{ published: string[]; skipped: string[]; ping_triggered: boolean } | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<"" | "draft" | "published">("");
  const [yearFilter, setYearFilter] = useState(String(new Date().getFullYear()));
  const [monthFilter, setMonthFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sort, setSort] = useState<"desc" | "asc">("desc");

  const load = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const selectedMonth = yearFilter && monthFilter ? `${yearFilter}-${monthFilter}` : undefined;
      const data = await adminListArticles(p, 15, {
        status: statusFilter || undefined,
        year: yearFilter || undefined,
        month: selectedMonth,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
        sort,
      });
      setPosts(data.items);
      setTotal(data.total);
      setPages(data.pages);
    } catch {
      router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  }, [router, statusFilter, yearFilter, monthFilter, dateFrom, dateTo, sort]);

  useEffect(() => { setPage(1); }, [statusFilter, yearFilter, monthFilter, dateFrom, dateTo, sort]);
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

  async function openBulkModal() {
    try {
      const data = await adminListArticles(1, 500, {
        status: "draft",
        year: undefined,
        month: undefined,
        date_from: undefined,
        date_to: undefined,
        sort: "asc",
      });
      const eligible = data.items
        .filter((a) => !a.cover_image || a.cover_image === "")
        .map((a) => ({
          id: a.id,
          title: a.title,
          slug: a.slug,
          published_at: a.published_at,
          cover_image: a.cover_image,
        }));
      if (eligible.length === 0) {
        alert("Tidak ada artikel draft yang belum punya cover image.");
        return;
      }
      setBulkEligible(eligible);
      setBulkModalOpen(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal memuat daftar artikel");
    }
  }

  async function refreshAfterBulk() {
    await load(page);
  }

  function toggleSelectAll() {
    const eligible = posts.filter((p) => p.status === "draft");
    const allSelected = eligible.every((p) => selectedIds.has(p.id));
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(eligible.map((p) => p.id)));
    }
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleBulkPublish() {
    if (selectedIds.size === 0) return;
    if (!confirm(`Publish ${selectedIds.size} artikel sekaligus? Google + Bing + IndexNow akan langsung dinotif.`)) return;
    setPublishing(true);
    setPublishResult(null);
    try {
      const result = await adminBulkPublish(Array.from(selectedIds));
      setPublishResult(result);
      setSelectedIds(new Set());
      await load(page);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal publish");
    } finally {
      setPublishing(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fcfaf7]">
      {/* ── Top bar ─────────────────────────────────────────────────── */}
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

      {/* Mobile nav dropdown */}
      {navOpen && (
        <div className="sm:hidden bg-white border-b border-[#242423]/8 px-4 py-2 flex flex-col gap-0.5">
          <Link href="/admin/categories" onClick={() => setNavOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-[#242423]/60 hover:bg-[#242423]/5 hover:text-[#242423] transition">Kategori</Link>
          <Link href="/admin/authors" onClick={() => setNavOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-[#242423]/60 hover:bg-[#242423]/5 hover:text-[#242423] transition"><Users size={14} /> Penulis</Link>
          <Link href="/admin/portfolio" onClick={() => setNavOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-[#242423]/60 hover:bg-[#242423]/5 hover:text-[#242423] transition"><Images size={14} /> Portfolio</Link>
          <Link href="/admin/content-map" onClick={() => setNavOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-[#242423]/60 hover:bg-[#242423]/5 hover:text-[#242423] transition"><MapIcon size={14} /> Content Map</Link>
          <Link href="/admin/settings" onClick={() => setNavOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-[#242423]/60 hover:bg-[#242423]/5 hover:text-[#242423] transition"><Settings size={14} /> Pengaturan</Link>
        </div>
      )}

      {/* ── Content ─────────────────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-extrabold text-[#242423]">Artikel</h1>
            <p className="text-xs text-[#242423]/45 mt-0.5">{total} total artikel</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/admin/categories"
                className="flex items-center gap-1.5 border border-[#242423]/12 text-[#242423]/55 font-semibold px-3 py-2 rounded-lg text-xs hover:border-[#242423]/25 hover:text-[#242423] transition"
              >
                Kategori
              </Link>
              <Link
                href="/admin/authors"
                className="flex items-center gap-1.5 border border-[#242423]/12 text-[#242423]/55 font-semibold px-3 py-2 rounded-lg text-xs hover:border-[#242423]/25 hover:text-[#242423] transition"
              >
                <Users size={12} /> Penulis
              </Link>
              <Link
                href="/admin/portfolio"
                className="flex items-center gap-1.5 border border-[#242423]/12 text-[#242423]/55 font-semibold px-3 py-2 rounded-lg text-xs hover:border-[#242423]/25 hover:text-[#242423] transition"
              >
                <Images size={12} /> Portfolio
              </Link>
              <Link
                href="/admin/content-map"
                className="flex items-center gap-1.5 border border-[#242423]/12 text-[#242423]/55 font-semibold px-3 py-2 rounded-lg text-xs hover:border-[#242423]/25 hover:text-[#242423] transition"
              >
                <MapIcon size={12} /> Content Map
              </Link>
              <Link
                href="/admin/settings"
                className="flex items-center gap-1.5 border border-[#242423]/12 text-[#242423]/55 font-semibold px-3 py-2 rounded-lg text-xs hover:border-[#242423]/25 hover:text-[#242423] transition"
              >
                <Settings size={12} /> Pengaturan
              </Link>
            </div>
            {selectedIds.size > 0 && (
              <button
                onClick={handleBulkPublish}
                disabled={publishing}
                className="flex items-center gap-2 bg-green-600 text-white font-bold px-3 py-2 rounded-lg text-xs hover:bg-green-700 disabled:opacity-50 transition"
              >
                <Send size={12} />
                <span>Publish ({selectedIds.size})</span>
              </button>
            )}
            <button
              onClick={openBulkModal}
              className="flex items-center gap-2 border border-[#f5a700]/30 bg-[#f5a700]/5 text-[#9b6a00] font-semibold px-3 py-2 rounded-lg text-xs hover:bg-[#f5a700]/15 transition"
            >
              <Sparkles size={12} />
              <span className="hidden sm:inline">Generate Covers</span>
            </button>
            <Link
              href="/admin/posts/new"
              className="flex items-center gap-2 bg-[#f5a700] text-white font-bold px-3 py-2 rounded-lg text-xs hover:bg-[#f5a700]/90 transition"
            >
              <Plus size={12} /> <span className="hidden sm:inline">Artikel Baru</span>
            </Link>
            <button
              onClick={() => setNavOpen((v) => !v)}
              className="sm:hidden flex items-center justify-center w-9 h-9 border border-[#242423]/12 rounded-xl text-[#242423]/50 hover:text-[#242423] transition"
            >
              <Menu size={15} />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-4 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="border border-[#242423]/12 rounded-lg px-3 py-1.5 text-xs text-[#242423] bg-white focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30"
          >
            <option value="">Semua status</option>
            <option value="published">Tayang</option>
            <option value="draft">Draft</option>
          </select>

          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="border border-[#242423]/12 rounded-lg px-3 py-1.5 text-xs text-[#242423] bg-white focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30"
          >
            <option value="">Semua tahun</option>
            {YEAR_OPTIONS.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          <div className="flex items-center gap-1 text-xs text-[#242423]/45">
            <CalendarDays size={12} />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="border border-[#242423]/12 rounded-lg px-2.5 py-1.5 text-xs text-[#242423] bg-white focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30"
              aria-label="Dari tanggal"
            />
            <span>sd</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="border border-[#242423]/12 rounded-lg px-2.5 py-1.5 text-xs text-[#242423] bg-white focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30"
              aria-label="Sampai tanggal"
            />
          </div>

          {/* Sort toggle */}
          <button
            onClick={() => setSort((s) => s === "desc" ? "asc" : "desc")}
            className="flex items-center gap-1.5 border border-[#242423]/12 rounded-lg px-3 py-1.5 text-xs text-[#242423]/55 hover:text-[#242423] hover:border-[#242423]/25 transition"
          >
            <ArrowUpDown size={12} />
            {sort === "desc" ? "Terbaru dulu" : "Terlama dulu"}
          </button>

          {/* Reset */}
          {(statusFilter || yearFilter !== String(new Date().getFullYear()) || monthFilter || dateFrom || dateTo || sort !== "desc") && (
            <button
              onClick={() => {
                setStatusFilter("");
                setYearFilter(String(new Date().getFullYear()));
                setMonthFilter("");
                setDateFrom("");
                setDateTo("");
                setSort("desc");
              }}
              className="text-xs text-[#242423]/40 hover:text-[#242423] underline transition"
            >
              Reset
            </button>
          )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => setMonthFilter("")}
              className={`shrink-0 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                !monthFilter
                  ? "border-[#f5a700] bg-[#f5a700] text-white"
                  : "border-[#242423]/10 bg-white text-[#242423]/50 hover:text-[#242423]"
              }`}
            >
              Semua bulan
            </button>
            {MONTHS.map((month) => (
              <button
                key={month.value}
                onClick={() => setMonthFilter(month.value)}
                disabled={!yearFilter}
                className={`shrink-0 rounded-lg border px-3 py-1.5 text-xs font-semibold transition disabled:opacity-35 disabled:pointer-events-none ${
                  monthFilter === month.value
                    ? "border-[#f5a700] bg-[#f5a700] text-white"
                    : "border-[#242423]/10 bg-white text-[#242423]/50 hover:text-[#242423]"
                }`}
              >
                {month.label}
              </button>
            ))}
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
                  <th className="px-3 py-3 w-8">
                    <button
                      onClick={toggleSelectAll}
                      className="flex items-center justify-center text-[#242423]/40 hover:text-[#242423]"
                      title="Pilih/batal semua draft"
                    >
                      {posts.filter((p) => p.status === "draft").length > 0 &&
                      posts.filter((p) => p.status === "draft").every((p) => selectedIds.has(p.id)) ? (
                        <CheckSquare size={14} />
                      ) : (
                        <Square size={14} />
                      )}
                    </button>
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#242423]/40">Judul</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#242423]/40 hidden sm:table-cell">Kategori</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#242423]/40 hidden lg:table-cell">Batch</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#242423]/40">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#242423]/40 hidden md:table-cell">Tanggal</th>
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
                    <td className="px-3 py-3.5">
                      {post.status === "draft" && (
                        <button
                          onClick={() => toggleSelect(post.id)}
                          className="flex items-center justify-center text-[#242423]/30 hover:text-[#f5a700]"
                        >
                          {selectedIds.has(post.id) ? (
                            <CheckSquare size={14} className="text-[#f5a700]" />
                          ) : (
                            <Square size={14} />
                          )}
                        </button>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-start gap-1.5">
                        {post.featured && (
                          <Star size={10} className="text-[#f5a700] fill-[#f5a700] mt-1 flex-shrink-0" />
                        )}
                        <div className="min-w-0">
                          <div className="font-semibold text-[#242423] leading-snug line-clamp-1">{post.title}</div>
                          <div className="text-xs text-[#242423]/40 mt-0.5">{post.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      {post.category ? (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#242423]/6 text-[#242423]/60">
                          {post.category}
                        </span>
                      ) : (
                        <span className="text-[#242423]/25">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-[#f5a700]/10 text-[#9b6a00]">
                        <CalendarDays size={10} />
                        {formatMonth(articleDate(post))}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
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
                    <td className="px-4 py-3.5 text-xs text-[#242423]/45 hidden md:table-cell">
                      <span className="block">{formatDate(articleDate(post))}</span>
                      <span className="text-[10px] text-[#242423]/30">
                        {post.status === "draft" && post.published_at ? "Rencana" : post.status === "published" ? "Tayang" : "Dibuat"}
                      </span>
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

        {/* Publish result */}
        {publishResult && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-xs text-green-900">
            <p className="font-semibold">
              Publish selesai: {publishResult.published.length} tayang baru
              {publishResult.skipped.length > 0 && `, ${publishResult.skipped.length} dilewati`}
              {publishResult.ping_triggered && " · Google + Bing + IndexNow sudah dinotif"}
            </p>
          </div>
        )}

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

      <BulkGenerateModal
        open={bulkModalOpen}
        articles={bulkEligible}
        onClose={() => setBulkModalOpen(false)}
        onComplete={refreshAfterBulk}
      />
    </div>
  );
}
