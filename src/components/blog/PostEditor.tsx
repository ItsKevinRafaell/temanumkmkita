"use client";

import {
  useState, useRef, useEffect, useCallback,
} from "react";
import { useRouter } from "next/navigation";
import {
  DndContext, DragEndEvent, PointerSensor, useSensor, useSensors, closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext, verticalListSortingStrategy, useSortable, arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  adminCreateArticle, adminUpdateArticle, uploadImage, fetchCategories,
  type ArticlePayload, type AdminCategory,
} from "@/lib/api/admin";
import { type ContentBlock } from "@/lib/data/blog";
import Link from "next/link";
import {
  ChevronLeft, Save, Globe, GripVertical, Trash2,
  Heading1, Heading2, AlignLeft, List, ListOrdered,
  Quote, Zap, Image as ImageIcon, Minus, Plus, X,
  Loader2, Upload, Columns, Eye,
} from "lucide-react";

/* ── Types ────────────────────────────────────────────────────────────────── */

interface BlockItem {
  id: string;
  block: ContentBlock;
}

/* ── Helpers ──────────────────────────────────────────────────────────────── */

let _idCounter = 0;
function genId() { return `blk-${Date.now()}-${++_idCounter}`; }

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
}

function getBlockText(block: ContentBlock): string | null {
  if (block.type === "h2" || block.type === "h3" || block.type === "p" || block.type === "blockquote") {
    return block.text;
  }
  return null;
}

function setBlockText(block: ContentBlock, text: string): ContentBlock {
  if (block.type === "h2" || block.type === "h3") return { ...block, text, id: slugify(text) || block.id };
  if (block.type === "p" || block.type === "blockquote") return { ...block, text };
  return block;
}

function newBlockFromType(type: ContentBlock["type"], params?: Record<string, unknown>): BlockItem {
  const id = genId();
  let block: ContentBlock;
  switch (type) {
    case "h2": block = { type, id: `h-${Date.now()}`, text: "" }; break;
    case "h3": block = { type, id: `h-${Date.now()}`, text: "" }; break;
    case "p": block = { type, text: "" }; break;
    case "blockquote": block = { type, text: "" }; break;
    case "ul": block = { type, items: [""] }; break;
    case "ol": block = { type, items: [""] }; break;
    case "image": block = { type, src: "", alt: "", caption: "" }; break;
    case "divider": block = { type: "divider" }; break;
    case "cta-inline": block = { type: "cta-inline" }; break;
    case "columns": {
      const count = (params?.count as 2 | 3) ?? 2;
      block = { type: "columns", count, columns: Array.from({ length: count }, () => []) };
      break;
    }
    default: block = { type: "p", text: "" };
  }
  return { id, block };
}

function parseBlockItems(raw?: string): BlockItem[] {
  if (!raw) return [];
  try {
    const blocks = JSON.parse(raw) as ContentBlock[];
    return blocks.map((block) => ({ id: genId(), block }));
  } catch { return []; }
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
  { keywords: ["h2", "heading", "judul"], label: "Heading H2", desc: "/h2", blockType: "h2", icon: <Heading1 size={13} /> },
  { keywords: ["h3", "subheading", "subjudul"], label: "Heading H3", desc: "/h3", blockType: "h3", icon: <Heading2 size={13} /> },
  { keywords: ["p", "paragraf", "teks"], label: "Paragraf", desc: "/p", blockType: "p", icon: <AlignLeft size={13} /> },
  { keywords: ["gambar", "image", "foto"], label: "Gambar", desc: "/gambar", blockType: "image", icon: <ImageIcon size={13} /> },
  { keywords: ["quote", "kutipan", "blockquote"], label: "Kutipan", desc: "/quote", blockType: "blockquote", icon: <Quote size={13} /> },
  { keywords: ["ul", "list", "bullet"], label: "Bullet List", desc: "/ul", blockType: "ul", icon: <List size={13} /> },
  { keywords: ["ol", "numbered", "nomor"], label: "Numbered List", desc: "/ol", blockType: "ol", icon: <ListOrdered size={13} /> },
  { keywords: ["cta", "banner", "tombol"], label: "CTA Banner", desc: "/cta", blockType: "cta-inline", icon: <Zap size={13} /> },
  { keywords: ["divider", "garis", "hr", "pemisah"], label: "Garis Pemisah", desc: "/divider", blockType: "divider", icon: <Minus size={13} /> },
  { keywords: ["2col", "dua", "kolom"], label: "2 Kolom", desc: "/2col", blockType: "columns", params: { count: 2 }, icon: <Columns size={13} /> },
  { keywords: ["3col", "tiga", "three"], label: "3 Kolom", desc: "/3col", blockType: "columns", params: { count: 3 }, icon: <Columns size={13} /> },
];

/* ── Slash menu ───────────────────────────────────────────────────────────── */

function SlashMenu({
  query, onSelect, onClose,
}: {
  query: string;
  onSelect: (cmd: SlashCommand) => void;
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
      if (!filtered.length) return;
      if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, filtered.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
      if (e.key === "Enter" && filtered[active]) { e.preventDefault(); onSelect(filtered[active]); }
      if (e.key === "Escape") { e.preventDefault(); onClose(); }
    }
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [filtered, active, onSelect, onClose]);

  if (filtered.length === 0) return null;

  return (
    <div className="absolute left-0 top-full mt-1 z-50 bg-white border border-[#242423]/12 rounded-xl shadow-xl p-1 min-w-[220px]">
      {filtered.map((cmd, i) => (
        <button
          key={`${cmd.blockType}-${cmd.desc}`}
          onMouseDown={(e) => { e.preventDefault(); onSelect(cmd); }}
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
          <img src={block.src} alt={block.alt} className="w-full rounded-lg object-cover max-h-72 border border-[#242423]/8" />
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
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
      />
      <input
        className="w-full border border-[#242423]/12 rounded-lg px-3 py-1.5 text-xs text-[#242423] bg-white focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30 focus:border-[#f5a700]"
        placeholder="Alt text (SEO & aksesibilitas)..."
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

function NotionBlock({
  item, callbacks,
}: {
  item: BlockItem;
  callbacks: NotionBlockCallbacks;
}) {
  const { onUpdate, onDelete, onInsertAfter, onMergeWithPrev, onFocusPrev, onFocusNext, registerRef, level } = callbacks;
  const [slashQuery, setSlashQuery] = useState<string | null>(null);

  const textValue = getBlockText(item.block) ?? "";

  const handleSlashSelect = useCallback((cmd: SlashCommand) => {
    setSlashQuery(null);
    // Remove /query from current block text
    const currentText = getBlockText(item.block) ?? "";
    const cleanText = currentText.replace(/\/[a-z0-9]*$/, "");
    onUpdate(item.id, setBlockText(item.block, cleanText));
    // Insert new block below
    const newBlock = newBlockFromType(cmd.blockType, cmd.params);
    onInsertAfter(item.id, newBlock);
  }, [item, onUpdate, onInsertAfter]);

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
      setSlashQuery(slash);
    } else {
      if (slashQuery !== null) setSlashQuery(null);
      onUpdate(item.id, setBlockText(item.block, value));
    }
  }

  const displayValue = slashQuery !== null
    ? (getBlockText(item.block) ?? "").replace(/\/[a-z0-9]*$/, "") + "/" + slashQuery
    : textValue;

  /* Render by block type */

  if (item.block.type === "h2") {
    return (
      <div className="relative">
        <input
          ref={(el) => registerRef(item.id, el)}
          className="w-full outline-none text-2xl font-bold text-[#242423] placeholder:text-[#242423]/20 bg-transparent py-0.5"
          placeholder="Heading H2..."
          value={displayValue}
          onChange={(e) => handleTextChange(e.target.value)}
          onKeyDown={handleInputKeyDown}
        />
        {item.block.text && (
          <p className="text-xs text-[#242423]/25 mt-0.5">ID: <code className="font-mono">{item.block.id}</code></p>
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
          className="w-full outline-none text-lg font-bold text-[#242423] placeholder:text-[#242423]/20 bg-transparent py-0.5"
          placeholder="Heading H3..."
          value={displayValue}
          onChange={(e) => handleTextChange(e.target.value)}
          onKeyDown={handleInputKeyDown}
        />
        {item.block.text && (
          <p className="text-xs text-[#242423]/25 mt-0.5">ID: <code className="font-mono">{item.block.id}</code></p>
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
          className="w-full outline-none text-sm text-[#242423] placeholder:text-[#242423]/25 bg-transparent resize-none leading-relaxed"
          placeholder={'Ketik teks... atau ketik "/" untuk insert blok baru'}
          rows={1}
          value={displayValue}
          onChange={(e) => { autoResize(e.currentTarget); handleTextChange(e.target.value); }}
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
          className="w-full outline-none text-sm text-[#242423]/70 italic placeholder:text-[#242423]/25 bg-transparent resize-none leading-relaxed"
          placeholder="Teks kutipan..."
          rows={1}
          value={displayValue}
          onChange={(e) => { autoResize(e.currentTarget); handleTextChange(e.target.value); }}
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
            <span className="text-xs text-[#242423]/40 w-5 text-right flex-shrink-0 mt-0.5">
              {listBlock.type === "ul" ? "•" : `${i + 1}.`}
            </span>
            <input
              className="flex-1 outline-none text-sm text-[#242423] placeholder:text-[#242423]/25 bg-transparent"
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
                    const inputs = document.querySelectorAll<HTMLInputElement>(`[data-list-item="${item.id}"]`);
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
          className="ml-7 text-xs text-[#f5a700] font-semibold hover:underline flex items-center gap-1"
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
      <div className="bg-[#f5a700]/8 border border-[#f5a700]/25 rounded-lg px-4 py-3 text-xs text-[#242423]/55 font-medium">
        CTA Banner — otomatis tampil saat artikel dibuka.
      </div>
    );
  }

  if (item.block.type === "divider") {
    return (
      <div className="flex items-center gap-3 py-2">
        <div className="flex-1 h-px bg-[#242423]/15" />
        <span className="text-xs text-[#242423]/30">divider</span>
        <div className="flex-1 h-px bg-[#242423]/15" />
      </div>
    );
  }

  if (item.block.type === "columns") {
    const colBlock = item.block;
    return (
      <ColumnsBlockEditor
        block={colBlock}
        onChange={(b) => onUpdate(item.id, b)}
        level={level}
      />
    );
  }

  return null;
}

/* ── Columns block editor ─────────────────────────────────────────────────── */

function ColumnsBlockEditor({
  block, onChange, level,
}: {
  block: Extract<ContentBlock, { type: "columns" }>;
  onChange: (b: ContentBlock) => void;
  level: number;
}) {
  const [colItems, setColItems] = useState<BlockItem[][]>(() =>
    block.columns.map((col) => col.map((b) => ({ id: genId(), block: b })))
  );

  function updateCol(colIdx: number, newItems: BlockItem[]) {
    const next = colItems.map((col, i) => i === colIdx ? newItems : col);
    setColItems(next);
    onChange({ ...block, columns: next.map((col) => col.map((item) => item.block)) });
  }

  const gridClass = block.count === 3 ? "grid-cols-3" : "grid-cols-2";

  return (
    <div className={`grid ${gridClass} gap-3`}>
      {colItems.map((col, ci) => (
        <div key={ci} className="border border-[#242423]/10 rounded-xl p-3 bg-[#242423]/1 min-h-[80px]">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#242423]/25 mb-2">
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
  item, callbacks,
}: {
  item: BlockItem;
  callbacks: NotionBlockCallbacks;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const isNonText = item.block.type === "image" || item.block.type === "columns" ||
    item.block.type === "cta-inline" || item.block.type === "divider" ||
    item.block.type === "ul" || item.block.type === "ol";

  return (
    <div ref={setNodeRef} style={style} className="group relative flex items-start gap-1 px-1 py-0.5 rounded-lg hover:bg-[#242423]/3 transition-colors">
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        tabIndex={-1}
        className="flex-shrink-0 mt-1 p-1 opacity-0 group-hover:opacity-100 text-[#242423]/30 hover:text-[#242423]/60 cursor-grab active:cursor-grabbing transition touch-none rounded"
      >
        <GripVertical size={13} />
      </button>

      {/* Block content */}
      <div className={`flex-1 min-w-0 ${isNonText ? "py-1" : ""}`}>
        <NotionBlock item={item} callbacks={callbacks} />
      </div>

      {/* Delete */}
      <button
        tabIndex={-1}
        onMouseDown={(e) => { e.preventDefault(); callbacks.onDelete(item.id); }}
        className="flex-shrink-0 mt-1 p-1 opacity-0 group-hover:opacity-100 text-[#242423]/25 hover:text-red-500 transition rounded"
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

  const insertAfter = useCallback((afterId: string, newItem: BlockItem) => {
    onBlocksChange((() => {
      const idx = blocks.findIndex((b) => b.id === afterId);
      const next = [...blocks];
      next.splice(idx + 1, 0, newItem);
      return next;
    })());
    focusBlock(newItem.id);
  }, [blocks, onBlocksChange]);

  const deleteBlock = useCallback((id: string) => {
    const idx = blocks.findIndex((b) => b.id === id);
    const prevId = idx > 0 ? blocks[idx - 1].id : null;
    const prevText = idx > 0 ? getBlockText(blocks[idx - 1].block) : null;
    onBlocksChange(blocks.filter((b) => b.id !== id));
    if (prevId) focusBlock(prevId, prevText?.length);
  }, [blocks, onBlocksChange]);

  const mergeWithPrev = useCallback((id: string, textToAppend: string) => {
    const idx = blocks.findIndex((b) => b.id === id);
    if (idx <= 0) return;
    const prev = blocks[idx - 1];
    const prevText = getBlockText(prev.block);
    if (prevText === null) return;
    const mergePos = prevText.length;
    onBlocksChange(
      blocks
        .map((b) => b.id === prev.id ? { ...b, block: setBlockText(prev.block, prevText + textToAppend) } : b)
        .filter((b) => b.id !== id)
    );
    focusBlock(prev.id, mergePos);
  }, [blocks, onBlocksChange]);

  const updateBlock = useCallback((id: string, block: ContentBlock) => {
    onBlocksChange(blocks.map((b) => b.id === id ? { ...b, block } : b));
  }, [blocks, onBlocksChange]);

  const focusPrev = useCallback((id: string) => {
    const i = blocks.findIndex((b) => b.id === id);
    if (i > 0) {
      const prev = blocks[i - 1];
      focusBlock(prev.id, getBlockText(prev.block)?.length);
    }
  }, [blocks]);

  const focusNext = useCallback((id: string) => {
    const i = blocks.findIndex((b) => b.id === id);
    if (i < blocks.length - 1) focusBlock(blocks[i + 1].id, 0);
  }, [blocks]);

  const registerRef = useCallback((id: string, el: HTMLTextAreaElement | HTMLInputElement | null) => {
    if (el) blockRefs.current.set(id, el);
    else blockRefs.current.delete(id);
  }, []);

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
            <p className="text-sm text-[#242423]/25 py-2 px-7">{placeholder}</p>
          )}
          {blocks.map((item) => (
            <SortableNotionBlock key={item.id} item={item} callbacks={callbacks} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
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
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
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
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [saving, setSaving] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [error, setError] = useState("");

  const isEdit = Boolean(initial.id);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
  }, []);

  /* ── Quick-add handler ──────────────────────────────────────────────────── */

  function addBlock(type: ContentBlock["type"], params?: Record<string, unknown>) {
    setBlockItems((prev) => [...prev, newBlockFromType(type, params)]);
  }

  /* ── Save ─────────────────────────────────────────────────────────────── */

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
        published_at: finalStatus === "published" ? new Date(publishedAt).toISOString() : undefined,
        cover_image: coverImage || undefined,
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
          {isEdit && initial.id && (
            <Link
              href={`/preview/${initial.id}`}
              target="_blank"
              className="flex items-center gap-1.5 border border-[#242423]/12 text-[#242423]/55 font-semibold px-3 py-1.5 rounded-lg text-xs hover:border-[#242423]/25 hover:text-[#242423] transition"
            >
              <Eye size={12} /> Preview
            </Link>
          )}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "draft" | "published")}
            className="border border-[#242423]/12 rounded-lg px-3 py-1.5 text-xs text-[#242423] bg-white focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30"
          >
            <option value="draft">Draft</option>
            <option value="published">Tayang</option>
          </select>
          <button
            onClick={() => handleSave()}
            disabled={saving || savingDraft}
            className="flex items-center gap-1.5 bg-[#f5a700] text-white font-bold px-4 py-1.5 rounded-lg text-sm hover:bg-[#f5a700]/90 disabled:opacity-60 transition"
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex gap-6 items-start">

        {/* ── Main editor ─────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 space-y-0">

          {/* Title */}
          <div className="mb-2">
            <input
              className="w-full outline-none text-3xl font-extrabold text-[#242423] placeholder:text-[#242423]/20 bg-transparent py-1"
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
              className="w-full outline-none text-base text-[#242423]/60 placeholder:text-[#242423]/25 bg-transparent resize-none leading-relaxed"
              placeholder="Deskripsi singkat artikel (excerpt)..."
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-[#242423]/8 mb-4" />

          {/* Notion editor */}
          <div className="min-h-[300px]">
            <NotionEditor
              blocks={blockItems}
              onBlocksChange={setBlockItems}
              level={0}
            />
          </div>

          {/* Quick add bar */}
          <div className="mt-4 pt-4 border-t border-[#242423]/8">
            <p className="text-xs text-[#242423]/30 font-medium mb-2 px-7">Tambah blok:</p>
            <div className="flex flex-wrap gap-1.5 px-7">
              {SLASH_COMMANDS.map((cmd) => (
                <button
                  key={cmd.desc}
                  onClick={() => addBlock(cmd.blockType, cmd.params)}
                  className="flex items-center gap-1.5 text-xs font-medium border border-[#242423]/10 text-[#242423]/45 px-2.5 py-1.5 rounded-lg hover:border-[#f5a700]/50 hover:text-[#f5a700] hover:bg-[#f5a700]/5 transition"
                >
                  <span className="text-[#242423]/30">{cmd.icon}</span>
                  {cmd.label}
                </button>
              ))}
            </div>
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
                {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
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
