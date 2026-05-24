"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { adminCreateArticle, adminUpdateArticle, uploadImage, type ArticlePayload } from "@/lib/api/admin";
import { type ContentBlock } from "@/lib/data/blog";
import Link from "next/link";
import {
  ChevronLeft, Save, Globe, GripVertical, Trash2,
  Heading1, Heading2, AlignLeft, List, ListOrdered,
  Quote, Zap, Image as ImageIcon, Minus, Plus, X,
  Loader2, Upload,
} from "lucide-react";

/* ── Types ────────────────────────────────────────────────────────────────── */

interface BlockItem {
  id: string;
  block: ContentBlock;
}

const CATEGORIES = ["Website", "SEO", "Sosial Media", "Branding", "Tips Bisnis"];

/* ── Slash commands ───────────────────────────────────────────────────────── */

interface SlashCommand {
  keywords: string[];
  label: string;
  desc: string;
  blockType: ContentBlock["type"];
  icon: React.ReactNode;
}

const SLASH_COMMANDS: SlashCommand[] = [
  { keywords: ["h2", "heading"], label: "Heading H2", desc: "/h2", blockType: "h2", icon: <Heading1 size={13} /> },
  { keywords: ["h3", "subheading", "subjudul"], label: "Heading H3", desc: "/h3", blockType: "h3", icon: <Heading2 size={13} /> },
  { keywords: ["p", "paragraf", "teks"], label: "Paragraf", desc: "/p", blockType: "p", icon: <AlignLeft size={13} /> },
  { keywords: ["gambar", "image", "foto"], label: "Gambar", desc: "/gambar", blockType: "image", icon: <ImageIcon size={13} /> },
  { keywords: ["quote", "kutipan", "blockquote"], label: "Kutipan", desc: "/quote", blockType: "blockquote", icon: <Quote size={13} /> },
  { keywords: ["ul", "list", "bullet"], label: "Bullet List", desc: "/ul", blockType: "ul", icon: <List size={13} /> },
  { keywords: ["ol", "numbered", "nomor"], label: "Numbered List", desc: "/ol", blockType: "ol", icon: <ListOrdered size={13} /> },
  { keywords: ["cta", "banner", "tombol"], label: "CTA Banner", desc: "/cta", blockType: "cta-inline", icon: <Zap size={13} /> },
  { keywords: ["divider", "garis", "hr", "pemisah"], label: "Garis Pemisah", desc: "/divider", blockType: "divider", icon: <Minus size={13} /> },
];

/* ── Helpers ──────────────────────────────────────────────────────────────── */

let _idCounter = 0;
function genId() { return `blk-${Date.now()}-${++_idCounter}`; }

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
}

function newBlockItem(type: ContentBlock["type"]): BlockItem {
  let block: ContentBlock;
  if (type === "h2" || type === "h3") block = { type, id: `h-${Date.now()}`, text: "" };
  else if (type === "p" || type === "blockquote") block = { type, text: "" };
  else if (type === "ul" || type === "ol") block = { type, items: [""] };
  else if (type === "image") block = { type, src: "", alt: "", caption: "" };
  else if (type === "divider") block = { type: "divider" };
  else block = { type: "cta-inline" };
  return { id: genId(), block };
}

function parseBlockItems(raw?: string): BlockItem[] {
  if (!raw) return [];
  try {
    const blocks = JSON.parse(raw) as ContentBlock[];
    return blocks.map((block) => ({ id: genId(), block }));
  } catch { return []; }
}

const blockLabels: Partial<Record<ContentBlock["type"], string>> = {
  h2: "Heading H2", h3: "Heading H3", p: "Paragraf",
  ul: "Bullet List", ol: "Numbered List", blockquote: "Kutipan",
  "cta-inline": "CTA Banner", image: "Gambar", divider: "Garis Pemisah",
};
const blockIcons: Partial<Record<ContentBlock["type"], React.ReactNode>> = {
  h2: <Heading1 size={11} />, h3: <Heading2 size={11} />, p: <AlignLeft size={11} />,
  ul: <List size={11} />, ol: <ListOrdered size={11} />, blockquote: <Quote size={11} />,
  "cta-inline": <Zap size={11} />, image: <ImageIcon size={11} />, divider: <Minus size={11} />,
};

/* ── Slash menu ───────────────────────────────────────────────────────────── */

function SlashMenu({
  query, onSelect, onClose,
}: {
  query: string;
  onSelect: (type: ContentBlock["type"]) => void;
  onClose: () => void;
}) {
  const q = query.toLowerCase();
  const filtered = SLASH_COMMANDS.filter((c) =>
    q === "" || c.keywords.some((k) => k.startsWith(q))
  );
  const [active, setActive] = useState(0);

  useEffect(() => { setActive(0); }, [query]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, filtered.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
      if (e.key === "Enter" && filtered[active]) { e.preventDefault(); onSelect(filtered[active].blockType); }
      if (e.key === "Escape") { e.preventDefault(); onClose(); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [filtered, active, onSelect, onClose]);

  if (filtered.length === 0) return null;

  return (
    <div className="absolute left-0 top-full mt-1 z-50 bg-white border border-[#242423]/12 rounded-xl shadow-xl p-1 min-w-[220px]">
      {filtered.map((cmd, i) => (
        <button
          key={cmd.blockType + cmd.keywords[0]}
          onMouseDown={(e) => { e.preventDefault(); onSelect(cmd.blockType); }}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
            i === active ? "bg-[#f5a700]/10 text-[#242423]" : "text-[#242423]/60 hover:bg-[#242423]/5"
          }`}
        >
          <span className="text-[#242423]/40">{cmd.icon}</span>
          <span className="font-medium">{cmd.label}</span>
          <span className="ml-auto text-xs text-[#242423]/30 font-mono">{cmd.desc}</span>
        </button>
      ))}
    </div>
  );
}

/* ── Image block editor ───────────────────────────────────────────────────── */

function ImageBlockEditor({
  block, onChange,
}: {
  block: Extract<ContentBlock, { type: "image" }>;
  onChange: (b: ContentBlock) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange({ ...block, src: url });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload gagal");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      {block.src ? (
        <div className="relative">
          <img src={block.src} alt={block.alt} className="w-full rounded-lg object-cover max-h-64 border border-[#242423]/8" />
          <button
            onClick={() => onChange({ ...block, src: "" })}
            className="absolute top-2 right-2 w-7 h-7 bg-white border border-[#242423]/12 rounded-full flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition"
          >
            <X size={12} className="text-[#242423]/50" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="w-full border-2 border-dashed border-[#242423]/15 rounded-xl py-8 flex flex-col items-center gap-2 text-[#242423]/40 hover:border-[#f5a700]/50 hover:text-[#f5a700] transition-colors"
        >
          {uploading ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
          <span className="text-xs font-medium">{uploading ? "Mengupload..." : "Klik untuk upload gambar"}</span>
          <span className="text-xs opacity-60">jpeg, png, webp — maks 5MB</span>
        </button>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />
      <input
        className="w-full border border-[#242423]/12 rounded-lg px-3 py-1.5 text-xs text-[#242423] bg-white focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30 focus:border-[#f5a700]"
        placeholder="Alt text (deskripsi gambar untuk SEO & aksesibilitas)..."
        value={block.alt}
        onChange={(e) => onChange({ ...block, alt: e.target.value })}
      />
      <input
        className="w-full border border-[#242423]/12 rounded-lg px-3 py-1.5 text-xs text-[#242423] bg-white focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30 focus:border-[#f5a700]"
        placeholder="Caption (opsional)..."
        value={block.caption ?? ""}
        onChange={(e) => onChange({ ...block, caption: e.target.value })}
      />
    </div>
  );
}

/* ── Block editor ─────────────────────────────────────────────────────────── */

function BlockEditor({
  block, onChange, onTransform,
}: {
  block: ContentBlock;
  onChange: (b: ContentBlock) => void;
  onTransform: (type: ContentBlock["type"]) => void;
}) {
  const [slashQuery, setSlashQuery] = useState<string | null>(null);

  function handleTextChange(value: string) {
    if (value.startsWith("/")) {
      setSlashQuery(value.slice(1));
    } else {
      setSlashQuery(null);
      if (block.type === "p" || block.type === "blockquote") onChange({ ...block, text: value });
    }
  }

  function handleHeadingChange(value: string) {
    if (value.startsWith("/")) {
      setSlashQuery(value.slice(1));
    } else {
      setSlashQuery(null);
      if (block.type === "h2" || block.type === "h3") {
        onChange({ ...block, text: value, id: slugify(value) || block.id });
      }
    }
  }

  function handleSlashSelect(type: ContentBlock["type"]) {
    setSlashQuery(null);
    onTransform(type);
  }

  if (block.type === "h2" || block.type === "h3") {
    return (
      <div className="relative space-y-1">
        <input
          className="w-full border border-[#242423]/12 rounded-lg px-3 py-2 text-sm font-bold text-[#242423] bg-white focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30 focus:border-[#f5a700]"
          placeholder={`${block.type === "h2" ? "Judul H2" : "Subjudul H3"}... (ketik / untuk ubah tipe)`}
          value={slashQuery !== null ? "/" + slashQuery : block.text}
          onChange={(e) => handleHeadingChange(e.target.value)}
        />
        {block.text && <p className="text-xs text-[#242423]/30">ID: <code className="bg-[#242423]/5 px-1 rounded">{block.id}</code></p>}
        {slashQuery !== null && (
          <SlashMenu query={slashQuery} onSelect={handleSlashSelect} onClose={() => setSlashQuery(null)} />
        )}
      </div>
    );
  }

  if (block.type === "p" || block.type === "blockquote") {
    return (
      <div className="relative">
        <textarea
          className="w-full border border-[#242423]/12 rounded-lg px-3 py-2 text-sm text-[#242423] bg-white focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30 focus:border-[#f5a700] resize-none"
          placeholder={`${block.type === "blockquote" ? "Teks kutipan" : "Isi paragraf"}... (ketik / untuk ubah tipe)`}
          rows={3}
          value={slashQuery !== null ? "/" + slashQuery : block.text}
          onChange={(e) => handleTextChange(e.target.value)}
        />
        {slashQuery !== null && (
          <SlashMenu query={slashQuery} onSelect={handleSlashSelect} onClose={() => setSlashQuery(null)} />
        )}
      </div>
    );
  }

  if (block.type === "ul" || block.type === "ol") {
    return (
      <div className="space-y-1.5">
        {block.items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-xs text-[#242423]/30 w-5 text-right flex-shrink-0">{block.type === "ul" ? "•" : `${i + 1}.`}</span>
            <input
              className="flex-1 border border-[#242423]/12 rounded-lg px-3 py-1.5 text-sm text-[#242423] bg-white focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30 focus:border-[#f5a700]"
              value={item}
              placeholder="Item..."
              onChange={(e) => {
                const items = [...block.items];
                items[i] = e.target.value;
                onChange({ ...block, items });
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const items = [...block.items];
                  items.splice(i + 1, 0, "");
                  onChange({ ...block, items });
                }
                if (e.key === "Backspace" && item === "" && block.items.length > 1) {
                  e.preventDefault();
                  const items = block.items.filter((_, j) => j !== i);
                  onChange({ ...block, items });
                }
              }}
            />
            <button
              onClick={() => {
                const items = block.items.filter((_, j) => j !== i);
                onChange({ ...block, items: items.length ? items : [""] });
              }}
              className="w-7 h-7 flex items-center justify-center text-[#242423]/25 hover:text-red-400 transition"
            >
              <X size={11} />
            </button>
          </div>
        ))}
        <button
          onClick={() => onChange({ ...block, items: [...block.items, ""] })}
          className="flex items-center gap-1 text-xs text-[#f5a700] font-semibold hover:underline mt-1"
        >
          <Plus size={10} /> Tambah item
        </button>
      </div>
    );
  }

  if (block.type === "image") {
    return <ImageBlockEditor block={block} onChange={onChange} />;
  }

  if (block.type === "cta-inline") {
    return (
      <div className="bg-[#f5a700]/8 border border-[#f5a700]/25 rounded-lg px-4 py-3 text-xs text-[#242423]/55 font-medium">
        CTA Banner — otomatis tampil saat artikel dibuka.
      </div>
    );
  }

  if (block.type === "divider") {
    return (
      <div className="flex items-center gap-3 py-1">
        <div className="flex-1 h-px bg-[#242423]/12" />
        <span className="text-xs text-[#242423]/30">Garis pemisah</span>
        <div className="flex-1 h-px bg-[#242423]/12" />
      </div>
    );
  }

  return null;
}

/* ── Sortable block item ──────────────────────────────────────────────────── */

function SortableBlockItem({
  item, onUpdate, onRemove, onTransform,
}: {
  item: BlockItem;
  onUpdate: (id: string, block: ContentBlock) => void;
  onRemove: (id: string) => void;
  onTransform: (id: string, type: ContentBlock["type"]) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="group border border-[#242423]/8 rounded-xl bg-[#fcfaf7] overflow-visible">
      <div className="flex items-start gap-0">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="flex-shrink-0 mt-3 ml-2 p-1.5 text-[#242423]/20 hover:text-[#242423]/50 cursor-grab active:cursor-grabbing transition touch-none"
        >
          <GripVertical size={14} />
        </button>

        {/* Block content */}
        <div className="flex-1 min-w-0 p-3">
          {/* Block type label + delete */}
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-[#242423]/40">
              {blockIcons[item.block.type]}
              {blockLabels[item.block.type]}
            </span>
            <button
              onClick={() => onRemove(item.id)}
              className="w-6 h-6 flex items-center justify-center text-[#242423]/25 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
            >
              <Trash2 size={11} />
            </button>
          </div>
          <BlockEditor
            block={item.block}
            onChange={(b) => onUpdate(item.id, b)}
            onTransform={(type) => onTransform(item.id, type)}
          />
        </div>
      </div>
    </div>
  );
}

/* ── Quick-add bar ────────────────────────────────────────────────────────── */

function QuickAddBar({ onAdd }: { onAdd: (type: ContentBlock["type"]) => void }) {
  return (
    <div className="pt-3 border-t border-[#242423]/6">
      <p className="text-xs text-[#242423]/35 font-medium mb-2">Tambah blok:</p>
      <div className="flex flex-wrap gap-1.5">
        {SLASH_COMMANDS.map((cmd) => (
          <button
            key={cmd.keywords[0]}
            onClick={() => onAdd(cmd.blockType)}
            className="flex items-center gap-1.5 text-xs font-medium border border-[#242423]/10 text-[#242423]/50 px-2.5 py-1.5 rounded-lg hover:border-[#f5a700]/50 hover:text-[#f5a700] hover:bg-[#f5a700]/5 transition"
          >
            <span className="text-[#242423]/35">{cmd.icon}</span>
            {cmd.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Featured image upload ────────────────────────────────────────────────── */

function FeaturedImageUpload({
  value, onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload gagal");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="block text-xs font-semibold text-[#242423]/55 mb-1.5">Thumbnail / Featured Image</label>
      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-[#242423]/10">
          <img src={value} alt="Featured" className="w-full h-28 object-cover" />
          <button
            onClick={() => onChange("")}
            className="absolute top-1.5 right-1.5 w-6 h-6 bg-white border border-[#242423]/12 rounded-full flex items-center justify-center hover:bg-red-50 transition"
          >
            <X size={10} className="text-[#242423]/50" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="w-full border-2 border-dashed border-[#242423]/12 rounded-xl py-4 flex flex-col items-center gap-1.5 text-[#242423]/35 hover:border-[#f5a700]/40 hover:text-[#f5a700] transition-colors"
        >
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          <span className="text-xs font-medium">{uploading ? "Mengupload..." : "Upload thumbnail"}</span>
        </button>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />
    </div>
  );
}

/* ── Main editor ──────────────────────────────────────────────────────────── */

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
    cover_image?: string;
  };
}

export default function PostEditor({ initial = {} }: PostEditorProps) {
  const router = useRouter();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

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
  const [coverImage, setCoverImage] = useState(initial.cover_image ?? "");
  const [blockItems, setBlockItems] = useState<BlockItem[]>(() => parseBlockItems(initial.content));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEdit = Boolean(initial.id);

  /* ── Block operations ─────────────────────────────────────────────────── */

  const updateBlock = useCallback((id: string, block: ContentBlock) => {
    setBlockItems((prev) => prev.map((item) => item.id === id ? { ...item, block } : item));
  }, []);

  const removeBlock = useCallback((id: string) => {
    setBlockItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const transformBlock = useCallback((id: string, type: ContentBlock["type"]) => {
    setBlockItems((prev) => prev.map((item) => {
      if (item.id !== id) return item;
      return newBlockItem(type);
    }));
  }, []);

  const addBlock = useCallback((type: ContentBlock["type"]) => {
    setBlockItems((prev) => [...prev, newBlockItem(type)]);
  }, []);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setBlockItems((prev) => {
        const oldIdx = prev.findIndex((i) => i.id === active.id);
        const newIdx = prev.findIndex((i) => i.id === over.id);
        return arrayMove(prev, oldIdx, newIdx);
      });
    }
  }

  /* ── Save ─────────────────────────────────────────────────────────────── */

  async function handleSave() {
    if (!title.trim() || !slug.trim()) {
      setError("Judul dan slug wajib diisi.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload: ArticlePayload & { cover_image?: string } = {
        title,
        slug,
        excerpt: excerpt || undefined,
        content: JSON.stringify(blockItems.map((i) => i.block)),
        category: category || undefined,
        status,
        featured,
        read_time: readTime,
        published_at: status === "published" ? new Date(publishedAt).toISOString() : undefined,
        cover_image: coverImage || undefined,
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

  /* ── Render ───────────────────────────────────────────────────────────── */

  return (
    <div className="min-h-screen bg-[#fcfaf7]">
      {/* Top bar */}
      <header className="bg-white border-b border-[#242423]/8 px-6 py-3.5 flex items-center justify-between sticky top-0 z-20 shadow-sm">
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
          {error && <span className="text-xs text-red-600 max-w-xs truncate">{error}</span>}
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
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex gap-6 items-start">

        {/* ── Main editor ─────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 space-y-5">

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-[#242423]/50 mb-1.5">Judul Artikel</label>
            <input
              className="w-full border border-[#242423]/15 rounded-xl px-4 py-3 text-xl font-bold text-[#242423] bg-white focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30 focus:border-[#f5a700] transition placeholder:font-normal placeholder:text-[#242423]/25"
              placeholder="Tulis judul artikel..."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!isEdit) setSlug(slugify(e.target.value));
              }}
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-xs font-semibold text-[#242423]/50 mb-1.5">Excerpt</label>
            <textarea
              className="w-full border border-[#242423]/15 rounded-xl px-4 py-2.5 text-sm text-[#242423] bg-white focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30 focus:border-[#f5a700] resize-none transition placeholder:text-[#242423]/25"
              placeholder="Deskripsi singkat artikel (tampil di listing blog dan SEO)..."
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
            />
          </div>

          {/* Blocks */}
          <div className="bg-white border border-[#242423]/8 rounded-2xl p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-[#242423]/35 mb-4">
              Konten Artikel
              <span className="ml-2 text-[#242423]/25 font-normal normal-case tracking-normal">
                — ketik <code className="bg-[#242423]/5 px-1 rounded">/</code> untuk ubah tipe blok
              </span>
            </p>

            {blockItems.length === 0 && (
              <p className="text-sm text-[#242423]/30 text-center py-8">
                Belum ada konten. Tambahkan blok atau ketik <code className="bg-[#242423]/5 px-1.5 rounded">/h2</code> untuk mulai.
              </p>
            )}

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={blockItems.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {blockItems.map((item) => (
                    <SortableBlockItem
                      key={item.id}
                      item={item}
                      onUpdate={updateBlock}
                      onRemove={removeBlock}
                      onTransform={transformBlock}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            <QuickAddBar onAdd={addBlock} />
          </div>
        </div>

        {/* ── Sidebar ─────────────────────────────────────────────────── */}
        <div className="w-64 flex-shrink-0 space-y-4 sticky top-20">

          {/* Featured image */}
          <div className="bg-white border border-[#242423]/8 rounded-2xl p-4">
            <FeaturedImageUpload value={coverImage} onChange={setCoverImage} />
          </div>

          {/* Settings */}
          <div className="bg-white border border-[#242423]/8 rounded-2xl p-4 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[#242423]/35">Pengaturan</p>

            <div>
              <label className="block text-xs font-semibold text-[#242423]/50 mb-1">Slug URL</label>
              <input
                className="w-full border border-[#242423]/12 rounded-lg px-3 py-2 text-xs text-[#242423] font-mono bg-white focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30 focus:border-[#f5a700]"
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                placeholder="url-artikel"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#242423]/50 mb-1">Kategori</label>
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
              <label className="block text-xs font-semibold text-[#242423]/50 mb-1">Estimasi Baca (menit)</label>
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
              <label className="block text-xs font-semibold text-[#242423]/50 mb-1">Tanggal Tayang</label>
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
              <span className="text-xs font-semibold text-[#242423]/55">Featured artikel</span>
            </label>
          </div>

          {isEdit && (
            <Link
              href={`/blog/${initial.slug}`}
              target="_blank"
              className="flex items-center justify-center gap-2 w-full border border-[#242423]/12 text-[#242423]/50 text-xs font-semibold py-2.5 rounded-xl hover:border-[#f5a700] hover:text-[#f5a700] transition"
            >
              <Globe size={12} /> Lihat di website
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
