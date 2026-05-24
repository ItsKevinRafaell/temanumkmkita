"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { createPillar, createTopic, type ContentPillar } from "@/lib/api/content-map";
import { adminUpdateArticle, type AdminArticle } from "@/lib/api/admin";

interface AddNodeToolbarProps {
  pillars: ContentPillar[];
  unassignedArticles: AdminArticle[];
  onRefresh: () => void;
}

type Modal =
  | { type: "pillar" }
  | { type: "topic" }
  | { type: "assign"; pillarId: string };

export default function AddNodeToolbar({ pillars, unassignedArticles, onRefresh }: AddNodeToolbarProps) {
  const [modal, setModal] = useState<Modal | null>(null);
  const [saving, setSaving] = useState(false);

  // Pillar form
  const [pNiche, setPNiche] = useState("");
  const [pName, setPName] = useState("");

  // Topic form
  const [tTitle, setTTitle] = useState("");
  const [tPillarId, setTPillarId] = useState("");

  // Assign form
  const [selectedArticles, setSelectedArticles] = useState<Set<string>>(new Set());

  function openPillar() { setPNiche(""); setPName(""); setModal({ type: "pillar" }); }
  function openTopic() { setTTitle(""); setTPillarId(""); setModal({ type: "topic" }); }

  async function handleCreatePillar() {
    if (!pNiche.trim() || !pName.trim()) return;
    setSaving(true);
    try { await createPillar({ niche: pNiche.trim(), name: pName.trim() }); setModal(null); onRefresh(); }
    finally { setSaving(false); }
  }

  async function handleCreateTopic() {
    if (!tTitle.trim()) return;
    setSaving(true);
    try {
      await createTopic({ title: tTitle.trim(), pillar_id: tPillarId || undefined });
      setModal(null); onRefresh();
    } finally { setSaving(false); }
  }

  async function handleAssign() {
    if (modal?.type !== "assign" || selectedArticles.size === 0) return;
    setSaving(true);
    try {
      await Promise.all(Array.from(selectedArticles).map(id => adminUpdateArticle(id, { pillar_id: modal.pillarId })));
      setModal(null); setSelectedArticles(new Set()); onRefresh();
    } finally { setSaving(false); }
  }

  const inputCls = "w-full border border-[#242423]/12 rounded-lg px-2.5 py-2 text-sm text-[#242423] bg-white focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30";

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={openPillar}
          className="flex items-center gap-1.5 text-xs font-semibold bg-[#f5a700] text-white px-3 py-1.5 rounded-lg hover:bg-[#f5a700]/90 transition"
        >
          <Plus size={12} /> Pillar
        </button>
        <button
          onClick={openTopic}
          className="flex items-center gap-1.5 text-xs font-semibold border border-[#242423]/12 text-[#242423]/60 px-3 py-1.5 rounded-lg hover:border-[#242423]/25 hover:text-[#242423] transition"
        >
          <Plus size={12} /> Topik
        </button>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#242423]/8">
              <span className="font-bold text-[#242423] text-sm">
                {modal.type === "pillar" ? "Tambah Content Pillar"
                  : modal.type === "topic" ? "Tambah Topik"
                  : "Assign Artikel ke Pillar"}
              </span>
              <button onClick={() => setModal(null)} className="text-[#242423]/40 hover:text-[#242423]">
                <X size={14} />
              </button>
            </div>
            <div className="px-5 py-4 space-y-3">
              {modal.type === "pillar" && (
                <>
                  <input value={pNiche} onChange={e => setPNiche(e.target.value)} className={inputCls} placeholder="Nama niche (e.g. UMKM Digital)" />
                  <input value={pName} onChange={e => setPName(e.target.value)} className={inputCls} placeholder="Nama pillar (e.g. SEO untuk UMKM)" />
                  <button
                    onClick={handleCreatePillar}
                    disabled={saving || !pNiche.trim() || !pName.trim()}
                    className="w-full bg-[#f5a700] text-white text-sm font-bold rounded-lg py-2.5 hover:bg-[#f5a700]/90 disabled:opacity-40 transition"
                  >
                    {saving ? "Membuat..." : "Buat Pillar"}
                  </button>
                </>
              )}
              {modal.type === "topic" && (
                <>
                  <input value={tTitle} onChange={e => setTTitle(e.target.value)} className={inputCls} placeholder="Judul topik" />
                  <select value={tPillarId} onChange={e => setTPillarId(e.target.value)} className={inputCls}>
                    <option value="">— tidak terhubung ke pillar —</option>
                    {pillars.map(p => (
                      <option key={p.id} value={p.id}>{p.niche} / {p.name}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleCreateTopic}
                    disabled={saving || !tTitle.trim()}
                    className="w-full bg-[#f5a700] text-white text-sm font-bold rounded-lg py-2.5 hover:bg-[#f5a700]/90 disabled:opacity-40 transition"
                  >
                    {saving ? "Membuat..." : "Buat Topik"}
                  </button>
                </>
              )}
              {modal.type === "assign" && (
                <>
                  <div className="text-xs text-[#242423]/50 mb-2">Pilih artikel yang akan dihubungkan:</div>
                  <div className="max-h-60 overflow-y-auto space-y-1">
                    {unassignedArticles.length === 0 ? (
                      <div className="text-xs text-[#242423]/40 py-4 text-center">Semua artikel sudah terhubung ke pillar.</div>
                    ) : unassignedArticles.map(a => (
                      <label key={a.id} className="flex items-start gap-2 p-2 rounded-lg hover:bg-[#242423]/3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedArticles.has(a.id)}
                          onChange={e => {
                            const s = new Set(selectedArticles);
                            if (e.target.checked) { s.add(a.id); } else { s.delete(a.id); }
                            setSelectedArticles(s);
                          }}
                          className="mt-0.5 accent-[#f5a700]"
                        />
                        <div>
                          <div className="text-xs font-semibold text-[#242423] leading-snug">{a.title}</div>
                          <div className="text-[10px] text-[#242423]/40">{a.status === "published" ? "Tayang" : "Draft"}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                  <button
                    onClick={handleAssign}
                    disabled={saving || selectedArticles.size === 0}
                    className="w-full bg-[#f5a700] text-white text-sm font-bold rounded-lg py-2.5 hover:bg-[#f5a700]/90 disabled:opacity-40 transition"
                  >
                    {saving ? "Menyimpan..." : `Assign ${selectedArticles.size} artikel`}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export type { Modal };
