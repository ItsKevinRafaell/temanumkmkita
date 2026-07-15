"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
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
import {
  adminCreateArticle,
  adminUpdateArticle,
  uploadImage,
  fetchCategories,
  fetchAuthors,
  type ArticlePayload,
  type AdminCategory,
  type Author,
} from "@/lib/api/admin";
import { generateCover } from "@/lib/api/imaginer";
import { type ContentBlock } from "@/lib/data/blog";
import Link from "next/link";
import {
  ChevronLeft,
  Save,
  Globe,
  GripVertical,
  Trash2,
  Heading1,
  Heading2,
  AlignLeft,
  List,
  ListOrdered,
  Quote,
  Zap,
  Image as ImageIcon,
  Minus,
  Plus,
  X,
  Loader2,
  Upload,
  Columns,
  Eye,
  HelpCircle,
  ListChecks,
  ChevronDown,
  ChevronRight,
  Settings,
  BarChart2,
  Sparkles,
} from "lucide-react";
import { checkSEO } from "@/lib/seo/checker";

/* ── Types ────────────────────────────────────────────────────────────────── */

interface BlockItem {
  id: string;
  block: ContentBlock;
}

/* ── Helpers ──────────────────────────────────────────────────────────────── */

let _idCounter = 0;
function genId() {
  return `blk-${Date.now()}-${++_idCounter}`;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function getBlockText(block: ContentBlock): string | null {
  if (
    block.type === "h2" ||
    block.type === "h3" ||
    block.type === "p" ||
    block.type === "blockquote"
  ) {
    return block.text;
  }
  return null;
}

function setBlockText(block: ContentBlock, text: string): ContentBlock {
  if (block.type === "h2" || block.type === "h3")
    return { ...block, text, id: slugify(text) || block.id };
  if (block.type === "p" || block.type === "blockquote") return { ...block, text };
  return block;
}

function newBlockFromType(type: ContentBlock["type"], params?: Record<string, unknown>): BlockItem {
  const id = genId();
  let block: ContentBlock;
  switch (type) {
    case "h2":
      block = { type, id: `h-${Date.now()}`, text: "" };
      break;
    case "h3":
      block = { type, id: `h-${Date.now()}`, text: "" };
      break;
    case "p":
      block = { type, text: "" };
      break;
    case "blockquote":
      block = { type, text: "" };
      break;
    case "ul":
      block = { type, items: [""] };
      break;
    case "ol":
      block = { type, items: [""] };
      break;
    case "image":
      block = { type, src: "", alt: "", caption: "" };
      break;
    case "divider":
      block = { type: "divider" };
      break;
    case "cta-inline":
      block = { type: "cta-inline" };
      break;
    case "columns": {
      const count = (params?.count as 2 | 3) ?? 2;
      block = { type: "columns", count, columns: Array.from({ length: count }, () => []) };
      break;
    }
    case "faq":
      block = { type: "faq", items: [{ question: "", answer: "" }] };
      break;
    case "howto":
      block = { type: "howto", steps: [{ name: "", text: "" }] };
      break;
    case "key-takeaway":
      block = { type: "key-takeaway", items: [""] };
      break;
    case "source":
      block = { type: "source", items: [{ label: "", url: "" }] };
      break;
    case "expert-quote":
      block = { type: "expert-quote", quote: "", author_name: "", author_title: "" };
      break;
    default:
      block = { type: "p", text: "" };
  }
  return { id, block };
}

function parseBlockItems(raw?: string): BlockItem[] {
  if (!raw) return [];
  try {
    const blocks = JSON.parse(raw) as ContentBlock[];
    return blocks.map((block) => ({ id: genId(), block }));
  } catch {
    return [];
  }
}

function detectSlash(value: string): string | null {
  const m = value.match(/\/([a-z0-9]*)$/);
  return m ? m[1] : null;
}

/* ── Slash commands ───────────────────────────────────────────────────────── */

interface SlashCommand {
  keywords: string[];
  label: string;
  desc: string;
  blockType: ContentBlock["type"];
  params?: Record<string, unknown>;
  icon: React.ReactNode;
}

const SLASH_COMMANDS: SlashCommand[] = [
  {
    keywords: ["h2", "heading", "judul"],
    label: "Heading H2",
    desc: "/h2",
    blockType: "h2",
    icon: <Heading1 size={13} />,
  },
  {
    keywords: ["h3", "subheading", "subjudul"],
    label: "Heading H3",
    desc: "/h3",
    blockType: "h3",
    icon: <Heading2 size={13} />,
  },
  {
    keywords: ["p", "paragraf", "teks"],
    label: "Paragraf",
    desc: "/p",
    blockType: "p",
    icon: <AlignLeft size={13} />,
  },
  {
    keywords: ["gambar", "image", "foto"],
    label: "Gambar",
    desc: "/gambar",
    blockType: "image",
    icon: <ImageIcon size={13} />,
  },
  {
    keywords: ["quote", "kutipan", "blockquote"],
    label: "Kutipan",
    desc: "/quote",
    blockType: "blockquote",
    icon: <Quote size={13} />,
  },
  {
    keywords: ["ul", "list", "bullet"],
    label: "Bullet List",
    desc: "/ul",
    blockType: "ul",
    icon: <List size={13} />,
  },
  {
    keywords: ["ol", "numbered", "nomor"],
    label: "Numbered List",
    desc: "/ol",
    blockType: "ol",
    icon: <ListOrdered size={13} />,
  },
  {
    keywords: ["cta", "banner", "tombol"],
    label: "CTA Banner",
    desc: "/cta",
    blockType: "cta-inline",
    icon: <Zap size={13} />,
  },
  {
    keywords: ["divider", "garis", "hr", "pemisah"],
    label: "Garis Pemisah",
    desc: "/divider",
    blockType: "divider",
    icon: <Minus size={13} />,
  },
  {
    keywords: ["2col", "dua", "kolom"],
    label: "2 Kolom",
    desc: "/2col",
    blockType: "columns",
    params: { count: 2 },
    icon: <Columns size={13} />,
  },
  {
    keywords: ["3col", "tiga", "three"],
    label: "3 Kolom",
    desc: "/3col",
    blockType: "columns",
    params: { count: 3 },
    icon: <Columns size={13} />,
  },
  {
    keywords: ["faq", "pertanyaan", "qanda"],
    label: "FAQ",
    desc: "/faq",
    blockType: "faq",
    icon: <HelpCircle size={13} />,
  },
  {
    keywords: ["howto", "cara", "langkah", "tutorial"],
    label: "How To",
    desc: "/howto",
    blockType: "howto",
    icon: <ListChecks size={13} />,
  },
  {
    keywords: ["takeaway", "pelajari", "ringkasan", "tldr"],
    label: "Key Takeaway",
    desc: "/takeaway",
    blockType: "key-takeaway",
    icon: <Zap size={13} />,
  },
  {
    keywords: ["source", "referensi", "sumber", "daftar"],
    label: "Referensi / Sumber",
    desc: "/source",
    blockType: "source",
    icon: <List size={13} />,
  },
  {
    keywords: ["expertquote", "expert", "ahli", "narasumber"],
    label: "Expert Quote",
    desc: "/expertquote",
    blockType: "expert-quote",
    icon: <Quote size={13} />,
  },
];

/* ── Slash menu ───────────────────────────────────────────────────────────── */

function SlashMenu({
  query,
  onSelect,
  onClose,
}: {
  query: string;
  onSelect: (cmd: SlashCommand) => void;
  onClose: () => void;
}) {
  const q = query.toLowerCase();
  const filtered = SLASH_COMMANDS.filter(
    (c) => q === "" || c.keywords.some((k) => k.startsWith(q))
  );
  const [active, setActive] = useState(0);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!filtered.length) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((a) => Math.min(a + 1, filtered.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
      }
      if (e.key === "Enter" && filtered[active]) {
        e.preventDefault();
        onSelect(filtered[active]);
      }
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    }
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [filtered, active, onSelect, onClose]);

  if (filtered.length === 0) return null;

  return (
    <div className="border-[#242423]/12 absolute left-0 top-full z-50 mt-1 min-w-[220px] rounded-xl border bg-white p-1 shadow-xl">
      {filtered.map((cmd, i) => (
        <button
          key={`${cmd.blockType}-${cmd.desc}`}
          onMouseDown={(e) => {
            e.preventDefault();
            onSelect(cmd);
          }}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
            i === active
              ? "bg-[#f5a700]/10 text-[#242423]"
              : "text-[#242423]/60 hover:bg-[#242423]/5"
          }`}
        >
          <span className="text-[#242423]/40">{cmd.icon}</span>
          <span className="font-medium">{cmd.label}</span>
          <span className="ml-auto font-mono text-xs text-[#242423]/30">{cmd.desc}</span>
        </button>
      ))}
    </div>
  );
}

/* ── Auto-resize helper ───────────────────────────────────────────────────── */

function autoResize(el: HTMLTextAreaElement) {
  el.style.height = "auto";
  el.style.height = `${el.scrollHeight}px`;
}

function makeTextareaRef(id: string, registerRef: NotionBlockCallbacks["registerRef"]) {
  return (el: HTMLTextAreaElement | null) => {
    if (el) autoResize(el);
    registerRef(id, el);
  };
}

/* ── Image block editor ───────────────────────────────────────────────────── */

function ImageBlockEditor({
  block,
  onChange,
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
          <Image
            src={block.src}
            alt={block.alt}
            width={800}
            height={450}
            className="border-[#242423]/8 max-h-72 w-full rounded-lg border object-cover"
          />
          <button
            onClick={() => onChange({ ...block, src: "" })}
            className="border-[#242423]/12 absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full border bg-white transition hover:border-red-200 hover:bg-red-50"
          >
            <X size={12} className="text-[#242423]/50" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-[#242423]/15 py-8 text-[#242423]/40 transition-colors hover:border-[#f5a700]/50 hover:text-[#f5a700]"
        >
          {uploading ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
          <span className="text-xs font-medium">
            {uploading ? "Mengupload..." : "Klik untuk upload gambar"}
          </span>
          <span className="text-xs opacity-60">jpeg, png, webp — maks 5MB</span>
        </button>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
      <input
        className="border-[#242423]/12 w-full rounded-lg border bg-white px-3 py-1.5 text-xs text-[#242423] focus:border-[#f5a700] focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30"
        placeholder="Alt text (SEO & aksesibilitas)..."
        value={block.alt}
        onChange={(e) => onChange({ ...block, alt: e.target.value })}
      />
      <input
        className="border-[#242423]/12 w-full rounded-lg border bg-white px-3 py-1.5 text-xs text-[#242423] focus:border-[#f5a700] focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30"
        placeholder="Caption (opsional)..."
        value={block.caption ?? ""}
        onChange={(e) => onChange({ ...block, caption: e.target.value })}
      />
    </div>
  );
}

/* ── FAQ block editor ─────────────────────────────────────────────────────── */

function FaqBlockEditor({
  block,
  onChange,
}: {
  block: Extract<ContentBlock, { type: "faq" }>;
  onChange: (b: ContentBlock) => void;
}) {
  function updateItem(i: number, key: "question" | "answer", val: string) {
    const items = block.items.map((item, j) => (j === i ? { ...item, [key]: val } : item));
    onChange({ ...block, items });
  }
  function addItem() {
    onChange({ ...block, items: [...block.items, { question: "", answer: "" }] });
  }
  function removeItem(i: number) {
    const items = block.items.filter((_, j) => j !== i);
    onChange({ ...block, items: items.length > 0 ? items : [{ question: "", answer: "" }] });
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-bold uppercase tracking-wider text-[#242423]/35">FAQ Block</p>
      {block.items.map((item, i) => (
        <div key={i} className="bg-[#242423]/1 space-y-2 rounded-xl border border-[#242423]/10 p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#242423]/40">Q{i + 1}</span>
            {block.items.length > 1 && (
              <button
                onClick={() => removeItem(i)}
                className="text-[#242423]/30 transition hover:text-red-500"
              >
                <X size={11} />
              </button>
            )}
          </div>
          <input
            className="w-full border-b border-[#242423]/10 bg-transparent pb-1 text-sm font-semibold text-[#242423] outline-none placeholder:text-[#242423]/25"
            placeholder="Pertanyaan..."
            value={item.question}
            onChange={(e) => updateItem(i, "question", e.target.value)}
          />
          <textarea
            className="w-full resize-none bg-transparent text-sm text-[#242423]/70 outline-none placeholder:text-[#242423]/25"
            placeholder="Jawaban..."
            rows={2}
            value={item.answer}
            onChange={(e) => {
              autoResize(e.currentTarget);
              updateItem(i, "answer", e.target.value);
            }}
          />
        </div>
      ))}
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          addItem();
        }}
        className="flex items-center gap-1.5 text-xs font-semibold text-[#f5a700] hover:underline"
      >
        <Plus size={11} /> Tambah pertanyaan
      </button>
    </div>
  );
}

/* ── HowTo block editor ───────────────────────────────────────────────────── */

function HowToBlockEditor({
  block,
  onChange,
}: {
  block: Extract<ContentBlock, { type: "howto" }>;
  onChange: (b: ContentBlock) => void;
}) {
  const [uploading, setUploading] = useState<number | null>(null);
  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);

  function updateStep(i: number, key: "name" | "text" | "image", val: string) {
    const steps = block.steps.map((s, j) => (j === i ? { ...s, [key]: val } : s));
    onChange({ ...block, steps });
  }
  function addStep() {
    onChange({ ...block, steps: [...block.steps, { name: "", text: "" }] });
  }
  function removeStep(i: number) {
    const steps = block.steps.filter((_, j) => j !== i);
    onChange({ ...block, steps: steps.length > 0 ? steps : [{ name: "", text: "" }] });
  }
  async function handleFile(i: number, file: File) {
    setUploading(i);
    try {
      const url = await uploadImage(file);
      updateStep(i, "image", url);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload gagal");
    } finally {
      setUploading(null);
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-bold uppercase tracking-wider text-[#242423]/35">How To Block</p>
      {block.steps.map((step, i) => (
        <div key={i} className="bg-[#242423]/1 space-y-2 rounded-xl border border-[#242423]/10 p-3">
          <div className="flex items-center justify-between">
            <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#f5a700] text-[10px] font-bold text-white">
              {i + 1}
            </span>
            {block.steps.length > 1 && (
              <button
                onClick={() => removeStep(i)}
                className="text-[#242423]/30 transition hover:text-red-500"
              >
                <X size={11} />
              </button>
            )}
          </div>
          <input
            className="w-full border-b border-[#242423]/10 bg-transparent pb-1 text-sm font-semibold text-[#242423] outline-none placeholder:text-[#242423]/25"
            placeholder="Nama langkah..."
            value={step.name}
            onChange={(e) => updateStep(i, "name", e.target.value)}
          />
          <textarea
            className="w-full resize-none bg-transparent text-sm text-[#242423]/70 outline-none placeholder:text-[#242423]/25"
            placeholder="Penjelasan langkah..."
            rows={2}
            value={step.text}
            onChange={(e) => {
              autoResize(e.currentTarget);
              updateStep(i, "text", e.target.value);
            }}
          />
          {step.image ? (
            <div className="relative">
              <Image
                src={step.image}
                alt={step.name}
                width={600}
                height={128}
                className="border-[#242423]/8 max-h-32 w-full rounded-lg border object-cover"
              />
              <button
                onClick={() => updateStep(i, "image", "")}
                className="border-[#242423]/12 absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full border bg-white transition hover:bg-red-50"
              >
                <X size={10} className="text-[#242423]/50" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileRefs.current[i]?.click()}
              disabled={uploading === i}
              className="border-[#242423]/12 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed py-2 text-xs text-[#242423]/35 transition hover:border-[#f5a700]/40 hover:text-[#f5a700]"
            >
              {uploading === i ? (
                <Loader2 size={11} className="animate-spin" />
              ) : (
                <Upload size={11} />
              )}
              {uploading === i ? "Uploading..." : "Gambar opsional"}
            </button>
          )}
          <input
            ref={(el) => {
              fileRefs.current[i] = el;
            }}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(i, f);
              e.target.value = "";
            }}
          />
        </div>
      ))}
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          addStep();
        }}
        className="flex items-center gap-1.5 text-xs font-semibold text-[#f5a700] hover:underline"
      >
        <Plus size={11} /> Tambah langkah
      </button>
    </div>
  );
}

/* ── NotionBlock ──────────────────────────────────────────────────────────── */

interface NotionBlockCallbacks {
  onUpdate: (id: string, block: ContentBlock) => void;
  onDelete: (id: string) => void;
  onInsertAfter: (afterId: string, item: BlockItem) => void;
  onMergeWithPrev: (id: string, textToAppend: string) => void;
  onFocusPrev: (id: string) => void;
  onFocusNext: (id: string) => void;
  registerRef: (id: string, el: HTMLTextAreaElement | HTMLInputElement | null) => void;
  level: number;
}

function NotionBlock({ item, callbacks }: { item: BlockItem; callbacks: NotionBlockCallbacks }) {
  const {
    onUpdate,
    onDelete,
    onInsertAfter,
    onMergeWithPrev,
    onFocusPrev,
    onFocusNext,
    registerRef,
    level,
  } = callbacks;
  const [slashQuery, setSlashQuery] = useState<string | null>(null);

  const textValue = getBlockText(item.block) ?? "";

  const handleSlashSelect = useCallback(
    (cmd: SlashCommand) => {
      setSlashQuery(null);
      // Remove /query from current block text
      const currentText = getBlockText(item.block) ?? "";
      const cleanText = currentText.replace(/\/[a-z0-9]*$/, "");
      onUpdate(item.id, setBlockText(item.block, cleanText));
      // Insert new block below
      const newBlock = newBlockFromType(cmd.blockType, cmd.params);
      onInsertAfter(item.id, newBlock);
    },
    [item, onUpdate, onInsertAfter]
  );

  const handleSlashClose = useCallback(() => {
    setSlashQuery(null);
    // Remove /query from text
    const currentText = getBlockText(item.block) ?? "";
    const cleanText = currentText.replace(/\/[a-z0-9]*$/, "");
    onUpdate(item.id, setBlockText(item.block, cleanText));
  }, [item, onUpdate]);

  function handleTextareaKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    const el = e.currentTarget;
    const value = el.value;
    const selStart = el.selectionStart ?? value.length;
    const selEnd = el.selectionEnd ?? value.length;

    if (e.key === "Enter" && !e.shiftKey) {
      if (slashQuery !== null) return; // slash menu will handle Enter
      e.preventDefault();
      const before = value.slice(0, selStart);
      const after = value.slice(selEnd);
      onUpdate(item.id, setBlockText(item.block, before));
      const newItem = newBlockFromType("p");
      if (after) (newItem.block as { text: string }).text = after;
      onInsertAfter(item.id, newItem);
    } else if (e.key === "Backspace" && selStart === 0 && selEnd === 0) {
      e.preventDefault();
      if (value === "") {
        onDelete(item.id);
      } else {
        onMergeWithPrev(item.id, value);
      }
    } else if (e.key === "ArrowUp" && selStart === 0) {
      e.preventDefault();
      onFocusPrev(item.id);
    } else if (e.key === "ArrowDown" && selStart === value.length) {
      e.preventDefault();
      onFocusNext(item.id);
    }
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    const el = e.currentTarget;
    const value = el.value;
    const selStart = el.selectionStart ?? value.length;
    const selEnd = el.selectionEnd ?? value.length;

    if (e.key === "Enter" && !e.shiftKey) {
      if (slashQuery !== null) return;
      e.preventDefault();
      const before = value.slice(0, selStart);
      const after = value.slice(selEnd);
      onUpdate(item.id, setBlockText(item.block, before));
      const newItem = newBlockFromType("p");
      if (after) (newItem.block as { text: string }).text = after;
      onInsertAfter(item.id, newItem);
    } else if (e.key === "Backspace" && selStart === 0 && selEnd === 0) {
      e.preventDefault();
      if (value === "") {
        onDelete(item.id);
      } else {
        onMergeWithPrev(item.id, value);
      }
    } else if (e.key === "ArrowUp" && selStart === 0) {
      e.preventDefault();
      onFocusPrev(item.id);
    } else if (e.key === "ArrowDown" && selStart === value.length) {
      e.preventDefault();
      onFocusNext(item.id);
    }
  }

  function handleTextChange(value: string) {
    const slash = detectSlash(value);
    if (slash !== null) {
      // Auto-execute on exact keyword match — no Enter needed
      const exactCmd = SLASH_COMMANDS.find((c) =>
        c.keywords.some((k) => k === slash.toLowerCase())
      );
      if (exactCmd) {
        setSlashQuery(null);
        const cleanText = value.replace(/\/[a-z0-9]*$/, "");
        onUpdate(item.id, setBlockText(item.block, cleanText));
        onInsertAfter(item.id, newBlockFromType(exactCmd.blockType, exactCmd.params));
        return;
      }
      setSlashQuery(slash);
    } else {
      if (slashQuery !== null) setSlashQuery(null);
      onUpdate(item.id, setBlockText(item.block, value));
    }
  }

  const displayValue =
    slashQuery !== null
      ? (getBlockText(item.block) ?? "").replace(/\/[a-z0-9]*$/, "") + "/" + slashQuery
      : textValue;

  /* Render by block type */

  if (item.block.type === "h2") {
    return (
      <div className="relative">
        <input
          ref={(el) => registerRef(item.id, el)}
          className="w-full bg-transparent py-0.5 text-2xl font-bold text-[#242423] outline-none placeholder:text-[#242423]/20"
          placeholder="Heading H2..."
          value={displayValue}
          onChange={(e) => handleTextChange(e.target.value)}
          onKeyDown={handleInputKeyDown}
        />
        {item.block.text && (
          <p className="mt-0.5 text-xs text-[#242423]/25">
            ID: <code className="font-mono">{item.block.id}</code>
          </p>
        )}
        {slashQuery !== null && (
          <SlashMenu query={slashQuery} onSelect={handleSlashSelect} onClose={handleSlashClose} />
        )}
      </div>
    );
  }

  if (item.block.type === "h3") {
    return (
      <div className="relative">
        <input
          ref={(el) => registerRef(item.id, el)}
          className="w-full bg-transparent py-0.5 text-lg font-bold text-[#242423] outline-none placeholder:text-[#242423]/20"
          placeholder="Heading H3..."
          value={displayValue}
          onChange={(e) => handleTextChange(e.target.value)}
          onKeyDown={handleInputKeyDown}
        />
        {item.block.text && (
          <p className="mt-0.5 text-xs text-[#242423]/25">
            ID: <code className="font-mono">{item.block.id}</code>
          </p>
        )}
        {slashQuery !== null && (
          <SlashMenu query={slashQuery} onSelect={handleSlashSelect} onClose={handleSlashClose} />
        )}
      </div>
    );
  }

  if (item.block.type === "p") {
    return (
      <div className="relative">
        <textarea
          ref={makeTextareaRef(item.id, registerRef)}
          className="w-full resize-none bg-transparent text-sm leading-relaxed text-[#242423] outline-none placeholder:text-[#242423]/25"
          placeholder={'Ketik teks... atau ketik "/" untuk insert blok baru'}
          rows={1}
          value={displayValue}
          onChange={(e) => {
            autoResize(e.currentTarget);
            handleTextChange(e.target.value);
          }}
          onKeyDown={handleTextareaKeyDown}
        />
        {slashQuery !== null && (
          <SlashMenu query={slashQuery} onSelect={handleSlashSelect} onClose={handleSlashClose} />
        )}
      </div>
    );
  }

  if (item.block.type === "blockquote") {
    return (
      <div className="relative border-l-4 border-[#f5a700]/50 pl-3">
        <textarea
          ref={makeTextareaRef(item.id, registerRef)}
          className="w-full resize-none bg-transparent text-sm italic leading-relaxed text-[#242423]/70 outline-none placeholder:text-[#242423]/25"
          placeholder="Teks kutipan..."
          rows={1}
          value={displayValue}
          onChange={(e) => {
            autoResize(e.currentTarget);
            handleTextChange(e.target.value);
          }}
          onKeyDown={handleTextareaKeyDown}
        />
        {slashQuery !== null && (
          <SlashMenu query={slashQuery} onSelect={handleSlashSelect} onClose={handleSlashClose} />
        )}
      </div>
    );
  }

  if (item.block.type === "ul" || item.block.type === "ol") {
    const listBlock = item.block;
    return (
      <div className="space-y-1">
        {listBlock.items.map((itm, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="mt-0.5 w-5 flex-shrink-0 text-right text-xs text-[#242423]/40">
              {listBlock.type === "ul" ? "•" : `${i + 1}.`}
            </span>
            <input
              className="flex-1 bg-transparent text-sm text-[#242423] outline-none placeholder:text-[#242423]/25"
              placeholder="Item..."
              value={itm}
              onChange={(e) => {
                const items = [...listBlock.items];
                items[i] = e.target.value;
                onUpdate(item.id, { ...listBlock, items });
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const items = [...listBlock.items];
                  items.splice(i + 1, 0, "");
                  onUpdate(item.id, { ...listBlock, items });
                  // focus next item — needs a timeout
                  setTimeout(() => {
                    const inputs = document.querySelectorAll<HTMLInputElement>(
                      `[data-list-item="${item.id}"]`
                    );
                    inputs[i + 1]?.focus();
                  }, 0);
                }
                if (e.key === "Backspace" && itm === "") {
                  e.preventDefault();
                  if (listBlock.items.length === 1) {
                    onDelete(item.id);
                  } else {
                    const items = listBlock.items.filter((_, j) => j !== i);
                    onUpdate(item.id, { ...listBlock, items });
                  }
                }
              }}
              data-list-item={item.id}
            />
          </div>
        ))}
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            onUpdate(item.id, { ...listBlock, items: [...listBlock.items, ""] });
          }}
          className="ml-7 flex items-center gap-1 text-xs font-semibold text-[#f5a700] hover:underline"
        >
          <Plus size={10} /> Tambah item
        </button>
      </div>
    );
  }

  if (item.block.type === "image") {
    return <ImageBlockEditor block={item.block} onChange={(b) => onUpdate(item.id, b)} />;
  }

  if (item.block.type === "cta-inline") {
    return (
      <div className="bg-[#f5a700]/8 rounded-lg border border-[#f5a700]/25 px-4 py-3 text-xs font-medium text-[#242423]/55">
        CTA Banner — otomatis tampil saat artikel dibuka.
      </div>
    );
  }

  if (item.block.type === "divider") {
    return (
      <div className="flex items-center gap-3 py-2">
        <div className="h-px flex-1 bg-[#242423]/15" />
        <span className="text-xs text-[#242423]/30">divider</span>
        <div className="h-px flex-1 bg-[#242423]/15" />
      </div>
    );
  }

  if (item.block.type === "columns") {
    const colBlock = item.block;
    return (
      <ColumnsBlockEditor block={colBlock} onChange={(b) => onUpdate(item.id, b)} level={level} />
    );
  }

  if (item.block.type === "faq") {
    return <FaqBlockEditor block={item.block} onChange={(b) => onUpdate(item.id, b)} />;
  }

  if (item.block.type === "howto") {
    return <HowToBlockEditor block={item.block} onChange={(b) => onUpdate(item.id, b)} />;
  }

  if (item.block.type === "key-takeaway") {
    const ktBlock = item.block;
    return (
      <div className="bg-[#f5a700]/8 space-y-2 rounded-xl border border-[#f5a700]/30 p-3">
        <p className="text-xs font-bold uppercase tracking-wider text-[#f5a700]">
          Yang akan kamu pelajari
        </p>
        {ktBlock.items.map((itm, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#f5a700]" />
            <input
              className="flex-1 bg-transparent text-sm text-[#242423] outline-none placeholder:text-[#242423]/25"
              placeholder="Poin pembelajaran..."
              value={itm}
              onChange={(e) => {
                const items = [...ktBlock.items];
                items[i] = e.target.value;
                onUpdate(item.id, { ...ktBlock, items });
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const items = [...ktBlock.items];
                  items.splice(i + 1, 0, "");
                  onUpdate(item.id, { ...ktBlock, items });
                }
                if (e.key === "Backspace" && itm === "") {
                  e.preventDefault();
                  if (ktBlock.items.length === 1) {
                    onDelete(item.id);
                  } else {
                    onUpdate(item.id, {
                      ...ktBlock,
                      items: ktBlock.items.filter((_, j) => j !== i),
                    });
                  }
                }
              }}
            />
            {ktBlock.items.length > 1 && (
              <button
                onClick={() =>
                  onUpdate(item.id, { ...ktBlock, items: ktBlock.items.filter((_, j) => j !== i) })
                }
                className="flex-shrink-0 text-[#242423]/25 transition hover:text-red-500"
              >
                <X size={11} />
              </button>
            )}
          </div>
        ))}
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            onUpdate(item.id, { ...ktBlock, items: [...ktBlock.items, ""] });
          }}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#f5a700] hover:underline"
        >
          <Plus size={11} /> Tambah poin
        </button>
      </div>
    );
  }

  if (item.block.type === "source") {
    const srcBlock = item.block;
    return (
      <div className="space-y-2 rounded-xl border border-[#242423]/10 p-3">
        <p className="text-xs font-bold uppercase tracking-wider text-[#242423]/35">
          Referensi / Sumber
        </p>
        {srcBlock.items.map((src, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 font-mono text-xs text-[#242423]/35">
              [{i + 1}]
            </span>
            <div className="flex-1 space-y-1">
              <input
                className="w-full border-b border-[#242423]/10 bg-transparent pb-0.5 text-xs text-[#242423] outline-none placeholder:text-[#242423]/25"
                placeholder="Judul / nama sumber..."
                value={src.label}
                onChange={(e) => {
                  const items = srcBlock.items.map((s, j) =>
                    j === i ? { ...s, label: e.target.value } : s
                  );
                  onUpdate(item.id, { ...srcBlock, items });
                }}
              />
              <input
                className="w-full bg-transparent font-mono text-xs text-[#242423]/60 outline-none placeholder:text-[#242423]/20"
                placeholder="https://..."
                value={src.url}
                onChange={(e) => {
                  const items = srcBlock.items.map((s, j) =>
                    j === i ? { ...s, url: e.target.value } : s
                  );
                  onUpdate(item.id, { ...srcBlock, items });
                }}
              />
            </div>
            {srcBlock.items.length > 1 && (
              <button
                onClick={() =>
                  onUpdate(item.id, {
                    ...srcBlock,
                    items: srcBlock.items.filter((_, j) => j !== i),
                  })
                }
                className="mt-1 flex-shrink-0 text-[#242423]/25 transition hover:text-red-500"
              >
                <X size={11} />
              </button>
            )}
          </div>
        ))}
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            onUpdate(item.id, { ...srcBlock, items: [...srcBlock.items, { label: "", url: "" }] });
          }}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#242423]/40 hover:text-[#242423] hover:underline"
        >
          <Plus size={11} /> Tambah sumber
        </button>
      </div>
    );
  }

  if (item.block.type === "expert-quote") {
    const eqBlock = item.block;
    return (
      <div className="space-y-2 border-l-4 border-[#242423]/20 py-1 pl-4">
        <p className="text-xs font-bold uppercase tracking-wider text-[#242423]/35">Expert Quote</p>
        <textarea
          className="w-full resize-none bg-transparent text-sm italic leading-relaxed text-[#242423]/75 outline-none placeholder:text-[#242423]/20"
          placeholder="Kutipan dari ahli / narasumber..."
          rows={2}
          value={eqBlock.quote}
          onChange={(e) => {
            autoResize(e.currentTarget);
            onUpdate(item.id, { ...eqBlock, quote: e.target.value });
          }}
        />
        <div className="flex gap-2">
          <input
            className="flex-1 border-b border-[#242423]/10 bg-transparent pb-0.5 text-xs font-semibold text-[#242423] outline-none placeholder:text-[#242423]/25"
            placeholder="Nama narasumber"
            value={eqBlock.author_name}
            onChange={(e) => onUpdate(item.id, { ...eqBlock, author_name: e.target.value })}
          />
          <input
            className="flex-1 border-b border-[#242423]/10 bg-transparent pb-0.5 text-xs text-[#242423]/55 outline-none placeholder:text-[#242423]/20"
            placeholder="Jabatan"
            value={eqBlock.author_title}
            onChange={(e) => onUpdate(item.id, { ...eqBlock, author_title: e.target.value })}
          />
          <input
            className="flex-1 border-b border-[#242423]/10 bg-transparent pb-0.5 text-xs text-[#242423]/40 outline-none placeholder:text-[#242423]/20"
            placeholder="Perusahaan (opsional)"
            value={eqBlock.author_company ?? ""}
            onChange={(e) =>
              onUpdate(item.id, { ...eqBlock, author_company: e.target.value || undefined })
            }
          />
        </div>
      </div>
    );
  }
}

/* ── Columns block editor ─────────────────────────────────────────────────── */

function ColumnsBlockEditor({
  block,
  onChange,
  level,
}: {
  block: Extract<ContentBlock, { type: "columns" }>;
  onChange: (b: ContentBlock) => void;
  level: number;
}) {
  const [colItems, setColItems] = useState<BlockItem[][]>(() =>
    block.columns.map((col) => col.map((b) => ({ id: genId(), block: b })))
  );

  function updateCol(colIdx: number, newItems: BlockItem[]) {
    const next = colItems.map((col, i) => (i === colIdx ? newItems : col));
    setColItems(next);
    onChange({ ...block, columns: next.map((col) => col.map((item) => item.block)) });
  }

  const gridClass = block.count === 3 ? "grid-cols-3" : "grid-cols-2";

  return (
    <div className={`grid ${gridClass} gap-3`}>
      {colItems.map((col, ci) => (
        <div
          key={ci}
          className="bg-[#242423]/1 min-h-[80px] rounded-xl border border-[#242423]/10 p-3"
        >
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#242423]/25">
            Kolom {ci + 1}
          </p>
          <NotionEditor
            blocks={col}
            onBlocksChange={(newItems) => updateCol(ci, newItems)}
            level={level + 1}
            placeholder="Ketik di sini..."
          />
        </div>
      ))}
    </div>
  );
}

/* ── Sortable block wrapper ───────────────────────────────────────────────── */

function SortableNotionBlock({
  item,
  callbacks,
}: {
  item: BlockItem;
  callbacks: NotionBlockCallbacks;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const isNonText =
    item.block.type === "image" ||
    item.block.type === "columns" ||
    item.block.type === "cta-inline" ||
    item.block.type === "divider" ||
    item.block.type === "ul" ||
    item.block.type === "ol" ||
    item.block.type === "faq" ||
    item.block.type === "howto" ||
    item.block.type === "key-takeaway" ||
    item.block.type === "source" ||
    item.block.type === "expert-quote";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="hover:bg-[#242423]/3 group relative flex items-start gap-1 rounded-lg px-1 py-0.5 transition-colors"
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        tabIndex={-1}
        className="mt-1 flex-shrink-0 cursor-grab touch-none rounded p-1 text-[#242423]/30 opacity-0 transition hover:text-[#242423]/60 active:cursor-grabbing group-hover:opacity-100"
      >
        <GripVertical size={13} />
      </button>

      {/* Block content */}
      <div className={`min-w-0 flex-1 ${isNonText ? "py-1" : ""}`}>
        <NotionBlock item={item} callbacks={callbacks} />
      </div>

      {/* Delete */}
      <button
        tabIndex={-1}
        onMouseDown={(e) => {
          e.preventDefault();
          callbacks.onDelete(item.id);
        }}
        className="mt-1 flex-shrink-0 rounded p-1 text-[#242423]/25 opacity-0 transition hover:text-red-500 group-hover:opacity-100"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}

/* ── NotionEditor ─────────────────────────────────────────────────────────── */

function NotionEditor({
  blocks,
  onBlocksChange,
  level = 0,
  placeholder = 'Ketik teks... atau ketik "/" untuk insert blok',
}: {
  blocks: BlockItem[];
  onBlocksChange: (blocks: BlockItem[]) => void;
  level?: number;
  placeholder?: string;
}) {
  const blockRefs = useRef<Map<string, HTMLTextAreaElement | HTMLInputElement>>(new Map());

  function focusBlock(id: string, pos?: number) {
    setTimeout(() => {
      const el = blockRefs.current.get(id);
      if (!el) return;
      el.focus();
      if (pos !== undefined && "setSelectionRange" in el) {
        (el as HTMLTextAreaElement).setSelectionRange(pos, pos);
      }
    }, 0);
  }

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIdx = blocks.findIndex((b) => b.id === active.id);
      const newIdx = blocks.findIndex((b) => b.id === over.id);
      onBlocksChange(arrayMove(blocks, oldIdx, newIdx));
    }
  }

  const insertAfter = useCallback(
    (afterId: string, newItem: BlockItem) => {
      onBlocksChange(
        (() => {
          const idx = blocks.findIndex((b) => b.id === afterId);
          const next = [...blocks];
          next.splice(idx + 1, 0, newItem);
          return next;
        })()
      );
      focusBlock(newItem.id);
    },
    [blocks, onBlocksChange]
  );

  const deleteBlock = useCallback(
    (id: string) => {
      const idx = blocks.findIndex((b) => b.id === id);
      const prevId = idx > 0 ? blocks[idx - 1].id : null;
      const prevText = idx > 0 ? getBlockText(blocks[idx - 1].block) : null;
      onBlocksChange(blocks.filter((b) => b.id !== id));
      if (prevId) focusBlock(prevId, prevText?.length);
    },
    [blocks, onBlocksChange]
  );

  const mergeWithPrev = useCallback(
    (id: string, textToAppend: string) => {
      const idx = blocks.findIndex((b) => b.id === id);
      if (idx <= 0) return;
      const prev = blocks[idx - 1];
      const prevText = getBlockText(prev.block);
      if (prevText === null) return;
      const mergePos = prevText.length;
      onBlocksChange(
        blocks
          .map((b) =>
            b.id === prev.id
              ? { ...b, block: setBlockText(prev.block, prevText + textToAppend) }
              : b
          )
          .filter((b) => b.id !== id)
      );
      focusBlock(prev.id, mergePos);
    },
    [blocks, onBlocksChange]
  );

  const updateBlock = useCallback(
    (id: string, block: ContentBlock) => {
      onBlocksChange(blocks.map((b) => (b.id === id ? { ...b, block } : b)));
    },
    [blocks, onBlocksChange]
  );

  const focusPrev = useCallback(
    (id: string) => {
      const i = blocks.findIndex((b) => b.id === id);
      if (i > 0) {
        const prev = blocks[i - 1];
        focusBlock(prev.id, getBlockText(prev.block)?.length);
      }
    },
    [blocks]
  );

  const focusNext = useCallback(
    (id: string) => {
      const i = blocks.findIndex((b) => b.id === id);
      if (i < blocks.length - 1) focusBlock(blocks[i + 1].id, 0);
    },
    [blocks]
  );

  const registerRef = useCallback(
    (id: string, el: HTMLTextAreaElement | HTMLInputElement | null) => {
      if (el) blockRefs.current.set(id, el);
      else blockRefs.current.delete(id);
    },
    []
  );

  const callbacks: NotionBlockCallbacks = {
    onUpdate: updateBlock,
    onDelete: deleteBlock,
    onInsertAfter: insertAfter,
    onMergeWithPrev: mergeWithPrev,
    onFocusPrev: focusPrev,
    onFocusNext: focusNext,
    registerRef,
    level,
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
        <div>
          {blocks.length === 0 && (
            <div
              className="cursor-text px-7 py-2"
              onClick={() => {
                const newItem = newBlockFromType("p");
                onBlocksChange([newItem]);
                focusBlock(newItem.id);
              }}
            >
              <p className="select-none text-sm text-[#242423]/25">{placeholder}</p>
            </div>
          )}
          {blocks.map((item) => (
            <SortableNotionBlock key={item.id} item={item} callbacks={callbacks} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

/* ── SEO Score Ring ───────────────────────────────────────────────────────── */

function ScoreRing({ score, grade }: { score: number; grade: string }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 85 ? "#16a34a" : score >= 50 ? "#f5a700" : "#ef4444";

  return (
    <div className="flex items-center gap-3">
      <svg width="52" height="52" viewBox="0 0 52 52">
        <circle cx="26" cy="26" r={r} fill="none" stroke="#e5e7eb" strokeWidth="6" />
        <circle
          cx="26"
          cy="26"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 26 26)"
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
        <text x="26" y="30" textAnchor="middle" fontSize="11" fontWeight="700" fill="#242423">
          {score}
        </text>
      </svg>
      <div>
        <div className="text-lg font-extrabold" style={{ color }}>
          {grade}
        </div>
        <div className="text-[10px] font-medium text-[#242423]/40">SEO Score</div>
      </div>
    </div>
  );
}

/* ── Featured image upload ────────────────────────────────────────────────── */

function FeaturedImageUpload({
  value,
  onChange,
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
      <label className="mb-1.5 block text-xs font-semibold text-[#242423]/55">
        Thumbnail / Featured Image
      </label>
      {value ? (
        <div className="relative overflow-hidden rounded-xl border border-[#242423]/10">
          <Image
            src={value}
            alt="Featured"
            width={800}
            height={112}
            className="h-28 w-full object-cover"
          />
          <button
            onClick={() => onChange("")}
            className="border-[#242423]/12 absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full border bg-white transition hover:bg-red-50"
          >
            <X size={10} className="text-[#242423]/50" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="border-[#242423]/12 flex w-full flex-col items-center gap-1.5 rounded-xl border-2 border-dashed py-4 text-[#242423]/35 transition-colors hover:border-[#f5a700]/40 hover:text-[#f5a700]"
        >
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          <span className="text-xs font-medium">
            {uploading ? "Mengupload..." : "Upload thumbnail"}
          </span>
        </button>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
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
    cover_image?: string | null;
    seo_title?: string;
    meta_description?: string;
    focus_keyword?: string;
    author_id?: string;
  };
}

export default function PostEditor({ initial = {} }: PostEditorProps) {
  const router = useRouter();

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
  const [seoTitle, setSeoTitle] = useState(initial.seo_title ?? "");
  const [metaDescription, setMetaDescription] = useState(initial.meta_description ?? "");
  const [focusKeyword, setFocusKeyword] = useState(initial.focus_keyword ?? "");
  const [seoOpen, setSeoOpen] = useState(false);
  const [showSeo, setShowSeo] = useState(true);
  const [showSettings, setShowSettings] = useState(true);
  const [blockItems, setBlockItems] = useState<BlockItem[]>(() => {
    const parsed = parseBlockItems(initial.content);
    return parsed.length > 0 ? parsed : [newBlockFromType("p")];
  });
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [authorId, setAuthorId] = useState<string>(initial.author_id ?? "");
  const [saving, setSaving] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const isEdit = Boolean(initial.id);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => {});
    fetchAuthors()
      .then(setAuthors)
      .catch(() => {});
  }, []);

  const seoResult = useMemo(
    () =>
      checkSEO({
        title,
        seoTitle,
        metaDescription,
        focusKeyword,
        slug,
        excerpt,
        coverImage,
        blocks: blockItems.map((i) => i.block),
        hasAuthor: Boolean(authorId),
      }),
    [
      title,
      seoTitle,
      metaDescription,
      focusKeyword,
      slug,
      excerpt,
      coverImage,
      blockItems,
      authorId,
    ]
  );

  /* ── Quick-add handler ──────────────────────────────────────────────────── */

  function addBlock(type: ContentBlock["type"], params?: Record<string, unknown>) {
    setBlockItems((prev) => [...prev, newBlockFromType(type, params)]);
  }

  /* ── Save ─────────────────────────────────────────────────────────────── */

  async function handleGenerateCover() {
    if (!initial.id) return;
    setGenerating(true);
    try {
      const result = await generateCover(initial.id);
      setCoverImage(result.cover_image_url);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal generate cover image");
    } finally {
      setGenerating(false);
    }
  }

  async function handleSave(overrideStatus?: "draft" | "published") {
    if (!title.trim() || !slug.trim()) {
      setError("Judul dan slug wajib diisi.");
      return;
    }
    const finalStatus = overrideStatus ?? status;
    if (overrideStatus === "draft") setSavingDraft(true);
    else setSaving(true);
    setError("");
    try {
      const payload: ArticlePayload = {
        title,
        slug,
        excerpt: excerpt || undefined,
        content: JSON.stringify(blockItems.map((i) => i.block)),
        category: category || undefined,
        status: finalStatus,
        featured,
        read_time: readTime,
        published_at: publishedAt ? new Date(publishedAt).toISOString() : undefined,
        cover_image: coverImage || null,
        seo_title: seoTitle || undefined,
        meta_description: metaDescription || undefined,
        focus_keyword: focusKeyword || undefined,
        author_id: authorId || null,
      };
      if (isEdit && initial.id) {
        await adminUpdateArticle(initial.id, payload);
      } else {
        const created = await adminCreateArticle(payload);
        router.push(`/admin/posts/${created.id}`);
        return;
      }
      setError("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setSaving(false);
      setSavingDraft(false);
    }
  }

  /* ── Render ─────────────────────────────────────────────────────────────── */

  return (
    <div className="min-h-screen bg-[#fcfaf7]">
      {/* Top bar */}
      <header className="border-[#242423]/8 sticky top-0 z-20 flex items-center justify-between border-b bg-white px-4 py-3.5 shadow-sm sm:px-6">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/posts"
            className="flex items-center gap-1 text-xs text-[#242423]/50 transition hover:text-[#242423]"
          >
            <ChevronLeft size={13} /> Kembali
          </Link>
          <span className="hidden text-[#242423]/20 sm:inline">/</span>
          <span className="hidden text-sm font-bold text-[#242423] sm:inline">
            {isEdit ? "Edit Artikel" : "Artikel Baru"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {error && (
            <span className="hidden max-w-xs truncate text-xs text-red-600 sm:block">{error}</span>
          )}
          {isEdit && initial.id && (
            <Link
              href={`/preview/${initial.id}`}
              target="_blank"
              className="border-[#242423]/12 flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold text-[#242423]/55 transition hover:border-[#242423]/25 hover:text-[#242423]"
            >
              <Eye size={12} /> <span className="hidden sm:inline">Preview</span>
            </Link>
          )}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "draft" | "published")}
            className="border-[#242423]/12 rounded-lg border bg-white px-3 py-1.5 text-xs text-[#242423] focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30"
          >
            <option value="draft">Draft</option>
            <option value="published">Tayang</option>
          </select>
          <button
            onClick={() => handleSave()}
            disabled={saving || savingDraft}
            className="flex items-center gap-1.5 rounded-lg bg-[#f5a700] px-4 py-1.5 text-sm font-bold text-white transition hover:bg-[#f5a700]/90 disabled:opacity-60"
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col items-start gap-5 px-4 py-8 sm:px-6 lg:flex-row">
        {/* ── Left: SEO sidebar ───────────────────────────────────────── */}
        <div
          className={`order-3 w-full transition-all duration-200 lg:sticky lg:top-20 lg:order-1 lg:max-h-[calc(100vh-6rem)] lg:flex-shrink-0 ${showSeo ? "lg:w-48" : "lg:w-8"}`}
        >
          {showSeo ? (
            <div className="overflow-y-auto pb-4 lg:max-h-[calc(100vh-6rem)]">
              <div className="border-[#242423]/8 space-y-3 rounded-2xl border bg-white p-4">
                {/* Panel header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <BarChart2 size={11} className="text-[#f5a700]" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#242423]/40">
                      SEO
                    </span>
                  </div>
                  <button
                    onClick={() => setShowSeo(false)}
                    title="Sembunyikan SEO panel"
                    className="hidden rounded p-0.5 text-[#242423]/25 transition hover:bg-[#242423]/5 hover:text-[#242423]/60 lg:block"
                  >
                    <ChevronLeft size={13} />
                  </button>
                </div>

                <ScoreRing score={seoResult.totalScore} grade={seoResult.grade} />

                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#242423]/50">
                    Focus Keyword
                  </label>
                  <input
                    className="border-[#242423]/12 w-full rounded-lg border bg-white px-3 py-2 text-xs text-[#242423] focus:border-[#f5a700] focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30"
                    placeholder="kata kunci..."
                    value={focusKeyword}
                    onChange={(e) => setFocusKeyword(e.target.value)}
                  />
                </div>

                {/* Rules */}
                {(() => {
                  const failing = seoResult.rules.filter((r) => r.status !== "pass");
                  const passCount = seoResult.rules.length - failing.length;
                  return (
                    <div className="space-y-1">
                      {failing.map((rule) => {
                        const dot = rule.status === "improve" ? "bg-amber-400" : "bg-red-400";
                        return (
                          <div
                            key={rule.id}
                            className="flex items-center gap-2"
                            title={rule.description}
                          >
                            <span className={`h-2 w-2 flex-shrink-0 rounded-full ${dot}`} />
                            <span className="flex-1 truncate text-xs leading-snug text-[#242423]/60">
                              {rule.label}
                            </span>
                            <span className="flex-shrink-0 font-mono text-[10px] text-[#242423]/30">
                              {rule.score}/{rule.maxScore}
                            </span>
                          </div>
                        );
                      })}
                      {passCount > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 flex-shrink-0 rounded-full bg-green-500" />
                          <span className="text-[10px] text-[#242423]/35">
                            {passCount} lainnya ok
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })()}

                <button
                  onClick={() => setSeoOpen((v) => !v)}
                  className="flex w-full items-center gap-1.5 text-xs font-semibold text-[#242423]/45 transition hover:text-[#242423]"
                >
                  <ChevronDown
                    size={12}
                    className={`transition-transform ${seoOpen ? "rotate-180" : ""}`}
                  />
                  Advanced SEO
                </button>

                {seoOpen && (
                  <div className="space-y-3 pt-1">
                    <div>
                      <div className="mb-1 flex items-center justify-between">
                        <label className="text-xs font-semibold text-[#242423]/50">SEO Title</label>
                        <span
                          className={`font-mono text-[10px] ${seoTitle.length > 60 ? "text-red-500" : "text-[#242423]/30"}`}
                        >
                          {seoTitle.length}/60
                        </span>
                      </div>
                      <input
                        className="border-[#242423]/12 w-full rounded-lg border bg-white px-3 py-2 text-xs text-[#242423] focus:border-[#f5a700] focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30"
                        placeholder={title || "SEO title..."}
                        value={seoTitle}
                        onChange={(e) => setSeoTitle(e.target.value)}
                      />
                    </div>
                    <div>
                      <div className="mb-1 flex items-center justify-between">
                        <label className="text-xs font-semibold text-[#242423]/50">Meta Desc</label>
                        <span
                          className={`font-mono text-[10px] ${
                            metaDescription.length >= 120 && metaDescription.length <= 160
                              ? "text-green-600"
                              : metaDescription.length > 180
                                ? "text-red-500"
                                : "text-[#242423]/30"
                          }`}
                        >
                          {metaDescription.length}/160
                        </span>
                      </div>
                      <textarea
                        className="border-[#242423]/12 w-full resize-none rounded-lg border bg-white px-3 py-2 text-xs text-[#242423] focus:border-[#f5a700] focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30"
                        placeholder={excerpt || "Meta description..."}
                        rows={3}
                        value={metaDescription}
                        onChange={(e) => setMetaDescription(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowSeo(true)}
              title="Tampilkan SEO panel"
              className="border-[#242423]/8 hover:bg-[#f5a700]/4 group hidden h-36 w-full flex-col items-center justify-center gap-2 rounded-xl border bg-white transition hover:border-[#f5a700]/40 lg:flex"
            >
              <BarChart2
                size={13}
                className="text-[#242423]/30 transition group-hover:text-[#f5a700]"
              />
              <span
                className="text-[10px] font-bold text-[#242423]/30 transition group-hover:text-[#f5a700]"
                style={{ writingMode: "vertical-rl", letterSpacing: "0.05em" }}
              >
                SEO
              </span>
              <ChevronRight
                size={11}
                className="text-[#242423]/20 transition group-hover:text-[#f5a700]"
              />
            </button>
          )}
        </div>

        {/* ── Center: Main editor ──────────────────────────────────────── */}
        <div className="order-1 min-w-0 flex-1 space-y-0 lg:order-2">
          {/* Title */}
          <div className="mb-2">
            <input
              className="w-full bg-transparent py-1 text-3xl font-extrabold text-[#242423] outline-none placeholder:text-[#242423]/20"
              placeholder="Judul artikel..."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!isEdit) setSlug(slugify(e.target.value));
              }}
            />
          </div>

          {/* Excerpt */}
          <div className="mb-4">
            <textarea
              className="w-full resize-none bg-transparent text-base leading-relaxed text-[#242423]/60 outline-none placeholder:text-[#242423]/25"
              placeholder="Deskripsi singkat artikel (excerpt)..."
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
            />
          </div>

          {/* Divider */}
          <div className="border-[#242423]/8 mb-4 border-t" />

          {/* Notion editor */}
          <div className="min-h-[300px]">
            <NotionEditor blocks={blockItems} onBlocksChange={setBlockItems} level={0} />
          </div>

          {/* Quick add bar */}
          <div className="border-[#242423]/8 mt-4 border-t pt-4">
            <p className="mb-2 px-7 text-xs font-medium text-[#242423]/30">Tambah blok:</p>
            <div className="flex flex-wrap gap-1.5 px-7">
              {SLASH_COMMANDS.map((cmd) => (
                <button
                  key={cmd.desc}
                  onClick={() => addBlock(cmd.blockType, cmd.params)}
                  className="flex items-center gap-1.5 rounded-lg border border-[#242423]/10 px-2.5 py-1.5 text-xs font-medium text-[#242423]/45 transition hover:border-[#f5a700]/50 hover:bg-[#f5a700]/5 hover:text-[#f5a700]"
                >
                  <span className="text-[#242423]/30">{cmd.icon}</span>
                  {cmd.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: Settings sidebar ──────────────────────────────────── */}
        <div
          className={`order-2 w-full transition-all duration-200 lg:sticky lg:top-20 lg:order-3 lg:max-h-[calc(100vh-6rem)] lg:flex-shrink-0 ${showSettings ? "lg:w-52" : "lg:w-8"}`}
        >
          {showSettings ? (
            <div className="max-h-[calc(100vh-6rem)] space-y-4 overflow-y-auto pb-4 pr-0.5">
              {/* Panel header */}
              <div className="border-[#242423]/8 rounded-2xl border bg-white px-4 pb-2 pt-4">
                <div className="mb-3 flex items-center justify-between">
                  <button
                    onClick={() => setShowSettings(false)}
                    title="Sembunyikan Settings panel"
                    className="hidden rounded p-0.5 text-[#242423]/25 transition hover:bg-[#242423]/5 hover:text-[#242423]/60 lg:block"
                  >
                    <ChevronRight size={13} />
                  </button>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#242423]/40">
                      Pengaturan
                    </span>
                    <Settings size={11} className="text-[#242423]/35" />
                  </div>
                </div>
                <FeaturedImageUpload value={coverImage} onChange={setCoverImage} />
                {isEdit && (
                  <button
                    onClick={handleGenerateCover}
                    disabled={generating}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-[#f5a700]/30 bg-[#f5a700]/5 px-3 py-2 text-xs font-semibold text-[#9b6a00] transition hover:bg-[#f5a700]/15 disabled:pointer-events-none disabled:opacity-50"
                  >
                    {generating ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles size={13} />
                        Generate Cover Image
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Settings fields */}
              <div className="border-[#242423]/8 space-y-3 rounded-2xl border bg-white p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#242423]/35">
                  Artikel
                </p>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#242423]/50">
                    Slug URL
                  </label>
                  <input
                    className="border-[#242423]/12 w-full rounded-lg border bg-white px-3 py-2 font-mono text-xs text-[#242423] focus:border-[#f5a700] focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30"
                    value={slug}
                    onChange={(e) => setSlug(slugify(e.target.value))}
                    placeholder="url-artikel"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#242423]/50">
                    Kategori
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="border-[#242423]/12 w-full rounded-lg border bg-white px-3 py-2 text-xs text-[#242423] focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30"
                  >
                    <option value="">Pilih kategori</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#242423]/50">
                    Penulis
                  </label>
                  <select
                    value={authorId}
                    onChange={(e) => setAuthorId(e.target.value)}
                    className="border-[#242423]/12 w-full rounded-lg border bg-white px-3 py-2 text-xs text-[#242423] focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30"
                  >
                    <option value="">Tanpa penulis</option>
                    {authors.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#242423]/50">
                    Estimasi Baca (menit)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={readTime}
                    onChange={(e) => setReadTime(Number(e.target.value))}
                    className="border-[#242423]/12 w-full rounded-lg border bg-white px-3 py-2 text-xs text-[#242423] focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#242423]/50">
                    Tanggal Rencana/Tayang
                  </label>
                  <input
                    type="date"
                    value={publishedAt}
                    onChange={(e) => setPublishedAt(e.target.value)}
                    className="border-[#242423]/12 w-full rounded-lg border bg-white px-3 py-2 text-xs text-[#242423] focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30"
                  />
                </div>

                <label className="flex cursor-pointer items-center gap-2">
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
                  className="border-[#242423]/12 flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-semibold text-[#242423]/50 transition hover:border-[#f5a700] hover:text-[#f5a700]"
                >
                  <Globe size={12} /> Lihat di website
                </Link>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowSettings(true)}
              title="Tampilkan Settings panel"
              className="border-[#242423]/8 hover:bg-[#242423]/3 group hidden h-36 w-full flex-col items-center justify-center gap-2 rounded-xl border bg-white transition hover:border-[#242423]/25 lg:flex"
            >
              <ChevronLeft
                size={11}
                className="text-[#242423]/20 transition group-hover:text-[#242423]/50"
              />
              <span
                className="text-[10px] font-bold text-[#242423]/30 transition group-hover:text-[#242423]/55"
                style={{ writingMode: "vertical-rl", letterSpacing: "0.05em" }}
              >
                Pengaturan
              </span>
              <Settings
                size={13}
                className="text-[#242423]/30 transition group-hover:text-[#242423]/50"
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
