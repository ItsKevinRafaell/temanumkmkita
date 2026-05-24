"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminCreateArticle, adminUpdateArticle, type ArticlePayload } from "@/lib/api/admin";
import {
  ChevronLeft, Plus, Trash2, MoveUp, MoveDown,
  Save, Globe, Heading1, Heading2, AlignLeft,
  List, ListOrdered, Quote, Zap,
} from "lucide-react";
import Link from "next/link";

export type ContentBlock =
  | { type: "h2"; id: string; text: string }
  | { type: "h3"; id: string; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "blockquote"; text: string }
  | { type: "cta-inline" };

const CATEGORIES = ["Website", "SEO", "Sosial Media", "Branding", "Tips Bisnis"];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function newBlock(type: ContentBlock["type"]): ContentBlock {
  if (type === "h2" || type === "h3") return { type, id: slugify("heading " + Date.now()), text: "" };
  if (type === "p" || type === "blockquote") return { type, text: "" };
  if (type === "ul" || type === "ol") return { type, items: [""] };
  return { type: "cta-inline" };
}

const blockIcons: Record<string, React.ReactNode> = {
  h2: <Heading1 size={12} />,
  h3: <Heading2 size={12} />,
  p: <AlignLeft size={12} />,
  ul: <List size={12} />,
  ol: <ListOrdered size={12} />,
  blockquote: <Quote size={12} />,
  "cta-inline": <Zap size={12} />,
};

const blockLabels: Record<string, string> = {
  h2: "Judul H2", h3: "Subjudul H3", p: "Paragraf",
  ul: "Bullet List", ol: "Numbered List", blockquote: "Kutipan", "cta-inline": "CTA Banner",
};

/* ── Block editors ────────────────────────────────────────────────────────── */

function BlockEditor({
  block, onChange,
}: {
  block: ContentBlock;
  onChange: (b: ContentBlock) => void;
}) {
  if (block.type === "h2" || block.type === "h3") {
    return (
      <div className="space-y-1.5">
        <input
          className="w-full border border-[#242423]/12 rounded-lg px-3 py-2 text-sm font-bold text-[#242423] focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30 focus:border-[#f5a700]"
          placeholder="Teks judul..."
          value={block.text}
          onChange={(e) => {
            const text = e.target.value;
            onChange({ ...block, text, id: slugify(text) || block.id });
          }}
        />
        <p className="text-xs text-[#242423]/35">ID: <code className="bg-[#242423]/5 px-1 rounded">{block.id}</code></p>
      </div>
    );
  }

  if (block.type === "p" || block.type === "blockquote") {
    return (
      <textarea
        className="w-full border border-[#242423]/12 rounded-lg px-3 py-2 text-sm text-[#242423] focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30 focus:border-[#f5a700] resize-none"
        placeholder={block.type === "blockquote" ? "Teks kutipan..." : "Isi paragraf..."}
        rows={3}
        value={block.text}
        onChange={(e) => onChange({ ...block, text: e.target.value })}
      />
    );
  }

  if (block.type === "ul" || block.type === "ol") {
    return (
      <div className="space-y-1.5">
        {block.items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-xs text-[#242423]/30 w-5 text-right flex-shrink-0">{i + 1}.</span>
            <input
              className="flex-1 border border-[#242423]/12 rounded-lg px-3 py-1.5 text-sm text-[#242423] focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30 focus:border-[#f5a700]"
              value={item}
              placeholder="Item..."
              onChange={(e) => {
                const items = [...block.items];
                items[i] = e.target.value;
                onChange({ ...block, items });
              }}
            />
            <button
              onClick={() => {
                const items = block.items.filter((_, j) => j !== i);
                onChange({ ...block, items: items.length ? items : [""] });
              }}
              className="w-7 h-7 flex items-center justify-center text-[#242423]/30 hover:text-red-500 transition"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
        <button
          onClick={() => onChange({ ...block, items: [...block.items, ""] })}
          className="text-xs text-[#f5a700] font-semibold hover:underline"
        >
          + Tambah item
        </button>
      </div>
    );
  }

  // cta-inline — no editable content
  return (
    <div className="bg-[#f5a700]/10 border border-[#f5a700]/30 rounded-lg px-4 py-2.5 text-xs text-[#242423]/60 font-medium">
      CTA Banner — otomatis muncul saat artikel ditampilkan.
    </div>
  );
}

/* ── Main editor component (used by both new and edit pages) ─────────────── */

interface PostEditorProps {
  initial?: {
    id?: string;
    title?: string;
    slug?: string;
    excerpt?: string;
    category?: string;
    status?: "draft" | "published";
    featured?: boolean;
    read_time?: number;
    published_at?: string;
    content?: string;
  };
}

export default function PostEditor({ initial = {} }: PostEditorProps) {
  const router = useRouter();

  const parseBlocks = (raw?: string): ContentBlock[] => {
    if (!raw) return [];
    try { return JSON.parse(raw) as ContentBlock[]; } catch { return []; }
  };

  const [title, setTitle] = useState(initial.title ?? "");
  const [slug, setSlug] = useState(initial.slug ?? "");
  const [excerpt, setExcerpt] = useState(initial.excerpt ?? "");
  const [category, setCategory] = useState(initial.category ?? "");
  const [status, setStatus] = useState<"draft" | "published">(initial.status ?? "draft");
  const [featured, setFeatured] = useState(initial.featured ?? false);
  const [readTime, setReadTime] = useState(initial.read_time ?? 5);
  const [publishedAt, setPublishedAt] = useState(
    initial.published_at ? initial.published_at.slice(0, 10) : new Date().toISOString().slice(0, 10)
  );
  const [blocks, setBlocks] = useState<ContentBlock[]>(parseBlocks(initial.content));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEdit = Boolean(initial.id);

  function updateBlock(i: number, b: ContentBlock) {
    setBlocks((prev) => prev.map((old, j) => (j === i ? b : old)));
  }

  function removeBlock(i: number) {
    setBlocks((prev) => prev.filter((_, j) => j !== i));
  }

  function moveBlock(i: number, dir: "up" | "down") {
    setBlocks((prev) => {
      const arr = [...prev];
      const j = dir === "up" ? i - 1 : i + 1;
      if (j < 0 || j >= arr.length) return arr;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return arr;
    });
  }

  function addBlock(type: ContentBlock["type"]) {
    setBlocks((prev) => [...prev, newBlock(type)]);
  }

  async function handleSave() {
    if (!title.trim() || !slug.trim()) {
      setError("Judul dan slug wajib diisi.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload: ArticlePayload = {
        title,
        slug,
        excerpt: excerpt || undefined,
        content: JSON.stringify(blocks),
        category: category || undefined,
        status,
        featured,
        read_time: readTime,
        published_at: status === "published" ? new Date(publishedAt).toISOString() : undefined,
      };
      if (isEdit && initial.id) {
        await adminUpdateArticle(initial.id, payload);
      } else {
        await adminCreateArticle(payload);
      }
      router.push("/admin/posts");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fcfaf7]">
      {/* Top bar */}
      <header className="bg-white border-b border-[#242423]/8 px-6 py-3.5 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/posts"
            className="flex items-center gap-1 text-xs text-[#242423]/50 hover:text-[#242423] transition"
          >
            <ChevronLeft size={13} /> Kembali
          </Link>
          <span className="text-[#242423]/20">/</span>
          <span className="text-sm font-bold text-[#242423]">{isEdit ? "Edit Artikel" : "Artikel Baru"}</span>
        </div>
        <div className="flex items-center gap-2">
          {error && <span className="text-xs text-red-600">{error}</span>}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "draft" | "published")}
            className="border border-[#242423]/12 rounded-lg px-3 py-1.5 text-xs text-[#242423] bg-white focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30"
          >
            <option value="draft">Draft</option>
            <option value="published">Tayang</option>
          </select>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 bg-[#f5a700] text-white font-bold px-4 py-1.5 rounded-lg text-sm hover:bg-[#f5a700]/90 disabled:opacity-60 transition"
          >
            <Save size={13} /> {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8 flex gap-6 items-start">

        {/* ── Main editor ───────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 space-y-5">

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-[#242423]/55 mb-1.5">Judul Artikel</label>
            <input
              className="w-full border border-[#242423]/15 rounded-xl px-4 py-3 text-lg font-bold text-[#242423] bg-white focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30 focus:border-[#f5a700] transition"
              placeholder="Judul artikel..."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!isEdit) setSlug(slugify(e.target.value));
              }}
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-xs font-semibold text-[#242423]/55 mb-1.5">Excerpt</label>
            <textarea
              className="w-full border border-[#242423]/15 rounded-xl px-4 py-2.5 text-sm text-[#242423] bg-white focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30 focus:border-[#f5a700] resize-none transition"
              placeholder="Deskripsi singkat artikel (tampil di listing dan meta SEO)..."
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
            />
          </div>

          {/* Content blocks */}
          <div className="bg-white border border-[#242423]/8 rounded-2xl p-5 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[#242423]/40 mb-4">Konten Artikel</p>

            {blocks.length === 0 && (
              <p className="text-sm text-[#242423]/35 text-center py-6">
                Belum ada blok konten. Tambahkan blok di bawah.
              </p>
            )}

            {blocks.map((block, i) => (
              <div
                key={i}
                className="border border-[#242423]/8 rounded-xl p-4 bg-[#fcfaf7] group"
              >
                <div className="flex items-center justify-between mb-2.5">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-[#242423]/50">
                    {blockIcons[block.type]}
                    {blockLabels[block.type]}
                  </span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button onClick={() => moveBlock(i, "up")} disabled={i === 0}
                      className="w-6 h-6 flex items-center justify-center text-[#242423]/35 hover:text-[#242423] disabled:opacity-20 transition">
                      <MoveUp size={11} />
                    </button>
                    <button onClick={() => moveBlock(i, "down")} disabled={i === blocks.length - 1}
                      className="w-6 h-6 flex items-center justify-center text-[#242423]/35 hover:text-[#242423] disabled:opacity-20 transition">
                      <MoveDown size={11} />
                    </button>
                    <button onClick={() => removeBlock(i)}
                      className="w-6 h-6 flex items-center justify-center text-[#242423]/35 hover:text-red-500 transition">
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
                <BlockEditor block={block} onChange={(b) => updateBlock(i, b)} />
              </div>
            ))}

            {/* Add block buttons */}
            <div className="pt-2 border-t border-[#242423]/6">
              <p className="text-xs text-[#242423]/40 font-medium mb-2.5">Tambah blok:</p>
              <div className="flex flex-wrap gap-2">
                {(["h2", "h3", "p", "ul", "ol", "blockquote", "cta-inline"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => addBlock(type)}
                    className="flex items-center gap-1.5 text-xs font-semibold border border-[#242423]/12 text-[#242423]/60 px-2.5 py-1.5 rounded-lg hover:border-[#f5a700] hover:text-[#f5a700] transition"
                  >
                    <Plus size={10} />
                    {blockLabels[type]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Sidebar ───────────────────────────────────────────────── */}
        <div className="w-64 flex-shrink-0 space-y-4 sticky top-20">

          {/* Slug */}
          <div className="bg-white border border-[#242423]/8 rounded-2xl p-4 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[#242423]/40">Pengaturan</p>

            <div>
              <label className="block text-xs font-semibold text-[#242423]/55 mb-1">Slug URL</label>
              <input
                className="w-full border border-[#242423]/12 rounded-lg px-3 py-2 text-xs text-[#242423] font-mono bg-white focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30 focus:border-[#f5a700]"
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                placeholder="url-artikel"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#242423]/55 mb-1">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-[#242423]/12 rounded-lg px-3 py-2 text-xs text-[#242423] bg-white focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30"
              >
                <option value="">Pilih kategori</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#242423]/55 mb-1">Estimasi Baca (menit)</label>
              <input
                type="number"
                min={1}
                max={60}
                value={readTime}
                onChange={(e) => setReadTime(Number(e.target.value))}
                className="w-full border border-[#242423]/12 rounded-lg px-3 py-2 text-xs text-[#242423] bg-white focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#242423]/55 mb-1">Tanggal Tayang</label>
              <input
                type="date"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="w-full border border-[#242423]/12 rounded-lg px-3 py-2 text-xs text-[#242423] bg-white focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="rounded accent-[#f5a700]"
              />
              <span className="text-xs font-semibold text-[#242423]/60">Featured artikel</span>
            </label>
          </div>

          {/* Preview link */}
          {isEdit && (
            <Link
              href={`/blog/${initial.slug}`}
              target="_blank"
              className="flex items-center justify-center gap-2 w-full border border-[#242423]/12 text-[#242423]/55 text-xs font-semibold py-2.5 rounded-xl hover:border-[#f5a700] hover:text-[#f5a700] transition"
            >
              <Globe size={12} /> Lihat di website
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
