"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import type { Industry } from "../catalog";

interface Props {
  industries: Industry[];
  valueSlug: string;
  onSelect: (ind: Industry) => void;
  loading?: boolean;
  placeholder?: string;
}

// Custom SEARCHABLE dropdown (combobox) — bukan native <select>.
// User ketik untuk memfilter 22 industri, klik / Enter untuk memilih.
// Keyboard: ArrowUp/Down navigasi, Enter pilih, Escape tutup.
export default function SearchableDropdown({
  industries,
  valueSlug,
  onSelect,
  loading = false,
  placeholder = "Ketik / pilih jenis usahamu...",
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selected = useMemo(
    () => industries.find((i) => i.slug === valueSlug) || null,
    [industries, valueSlug]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return industries;
    return industries.filter((i) => i.label.toLowerCase().includes(q) || i.slug.includes(q));
  }, [industries, query]);

  // Tutup saat klik di luar.
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Reset highlight tiap filter berubah.
  useEffect(() => setActiveIdx(0), [query, open]);

  // Scroll item aktif ke dalam viewport list.
  useEffect(() => {
    if (!open || !listRef.current) return;
    const el = listRef.current.querySelector<HTMLElement>(`[data-idx="${activeIdx}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIdx, open]);

  function choose(ind: Industry) {
    onSelect(ind);
    setQuery("");
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      setOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const pick = filtered[activeIdx];
      if (pick) choose(pick);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={rootRef} className="relative">
      {/* Trigger / input */}
      <div
        className={`flex items-center gap-2 rounded-lg border bg-white px-4 py-3 text-sm transition-all ${
          open
            ? "border-accent/60 ring-2 ring-accent/25"
            : "border-brand-dark/12 hover:border-accent/40"
        }`}
        onClick={() => {
          setOpen(true);
          inputRef.current?.focus();
        }}
      >
        <span className="text-accent">
          <Search size={15} />
        </span>
        <input
          ref={inputRef}
          type="text"
          value={open ? query : selected?.label || ""}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!open) setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={loading ? "Memuat kategori..." : placeholder}
          disabled={loading}
          role="combobox"
          aria-expanded={open}
          aria-controls="industry-listbox"
          autoComplete="off"
          className="w-full bg-transparent text-brand-dark placeholder:text-brand-dark/35 focus:outline-none disabled:opacity-60"
        />
        {selected && !open && (
          <button
            type="button"
            aria-label="Hapus pilihan"
            onClick={(e) => {
              e.stopPropagation();
              onSelect({ slug: "", label: "" });
            }}
            className="text-brand-dark/30 transition-colors hover:text-brand-dark/60"
          >
            <X size={15} />
          </button>
        )}
        <span
          className={`text-brand-dark/35 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <ChevronDown size={16} />
        </span>
      </div>

      {/* Dropdown list */}
      {open && (
        <ul
          ref={listRef}
          id="industry-listbox"
          role="listbox"
          className="absolute z-30 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-brand-dark/10 bg-white p-1.5 shadow-xl"
        >
          {filtered.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-brand-dark/45">
              Nggak nemu &ldquo;{query}&rdquo;. Coba kata lain ya.
            </li>
          ) : (
            filtered.map((ind, idx) => {
              const isSel = ind.slug === valueSlug;
              const isActive = idx === activeIdx;
              return (
                <li key={ind.slug} data-idx={idx} role="option" aria-selected={isSel}>
                  <button
                    type="button"
                    onMouseEnter={() => setActiveIdx(idx)}
                    onClick={() => choose(ind)}
                    className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                      isActive ? "bg-accent/10 text-brand-dark" : "text-brand-dark/80"
                    }`}
                  >
                    <span className={isSel ? "font-bold" : ""}>{ind.label}</span>
                    {isSel && <Check size={15} className="shrink-0 text-accent" />}
                  </button>
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}
