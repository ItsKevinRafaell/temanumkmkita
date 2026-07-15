"use client";

import { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  inputLabel?: string;
  inputValue?: string;
  onInputChange?: (v: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Hapus",
  danger = true,
  inputLabel,
  inputValue,
  onInputChange,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
      if (e.key === "Enter") onConfirm();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel, onConfirm]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#242423]/40 backdrop-blur-sm" />

      {/* Dialog */}
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        {/* Close */}
        <button
          onClick={onCancel}
          className="hover:bg-[#242423]/6 absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-lg text-[#242423]/35 transition hover:text-[#242423]"
        >
          <X size={14} />
        </button>

        {/* Icon + title */}
        <div className="mb-4 flex items-start gap-4">
          {danger && (
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-red-50">
              <AlertTriangle size={18} className="text-red-500" />
            </div>
          )}
          <div className="pt-1">
            <h3 className="text-base font-extrabold leading-snug text-[#242423]">{title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-[#242423]/55">{message}</p>
          </div>
        </div>

        {/* Optional input */}
        {inputLabel !== undefined && (
          <div className="mb-2">
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#242423]/50">
              {inputLabel}
            </label>
            <input
              autoFocus
              value={inputValue ?? ""}
              onChange={(e) => onInputChange?.(e.target.value)}
              className="border-[#242423]/12 w-full rounded-lg border px-3 py-2 text-sm text-[#242423] focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30"
            />
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-2.5">
          <button
            onClick={onCancel}
            className="border-[#242423]/12 rounded-xl border px-4 py-2 text-sm font-semibold text-[#242423]/60 transition hover:border-[#242423]/25 hover:text-[#242423]"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className={`rounded-xl px-4 py-2 text-sm font-bold text-white transition ${
              danger ? "bg-red-500 hover:bg-red-600" : "bg-[#f5a700] hover:bg-[#f5a700]/90"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
