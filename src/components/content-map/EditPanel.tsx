"use client";

import { useState, useEffect } from "react";
import { X, Save, Trash2, ExternalLink } from "lucide-react";
import {
  updatePillar, updateTopic, deletePillar, deleteTopic,
  type ContentPillar, type ContentTopic,
} from "@/lib/api/content-map";
import { adminUpdateArticle, type AdminArticle } from "@/lib/api/admin";
import ConfirmModal from "@/components/ui/ConfirmModal";

type SelectedNode =
  | { type: "nicheNode"; nicheLabel: string; pillars: ContentPillar[] }
  | { type: "pillarNode"; pillar: ContentPillar }
  | { type: "topicNode"; topic: ContentTopic }
  | { type: "articleNode"; article: AdminArticle };

interface EditPanelProps {
  node: SelectedNode | null;
  pillars: ContentPillar[];
  onClose: () => void;
  onRefresh: () => void;
}

type ModalState =
  | { type: "deletePillar"; name: string }
  | { type: "deleteTopic"; name: string }
  | { type: "detachArticle"; title: string }
  | { type: "renameNiche"; current: string }
  | null;

export default function EditPanel({ node, pillars, onClose, onRefresh }: EditPanelProps) {
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [modal, setModal] = useState<ModalState>(null);
  const [renameValue, setRenameValue] = useState("");

  // pillar form
  const [pNiche, setPNiche] = useState("");
  const [pName, setPName] = useState("");
  const [pDesc, setPDesc] = useState("");
  const [pKw, setPKw] = useState("");

  // topic form
  const [tTitle, setTTitle] = useState("");
  const [tKw, setTKw] = useState("");
  const [tVolume, setTVolume] = useState<string>("");
  const [tDiff, setTDiff] = useState<string>("");
  const [tNotes, setTNotes] = useState("");
  const [tStatus, setTStatus] = useState("planned");
  const [tPillarId, setTPillarId] = useState<string>("");

  useEffect(() => {
    if (!node) return;
    if (node.type === "pillarNode") {
      const p = node.pillar;
      setPNiche(p.niche); setPName(p.name);
      setPDesc(p.description ?? ""); setPKw(p.focus_keyword ?? "");
    } else if (node.type === "topicNode") {
      const t = node.topic;
      setTTitle(t.title); setTKw(t.focus_keyword ?? "");
      setTVolume(t.search_volume !== null ? String(t.search_volume) : "");
      setTDiff(t.difficulty !== null ? String(t.difficulty) : "");
      setTNotes(t.notes ?? ""); setTStatus(t.status);
      setTPillarId(t.pillar_id ?? "");
    }
  }, [node]);

  if (!node) return null;

  async function savePillar() {
    if (node?.type !== "pillarNode") return;
    setSaving(true);
    try {
      await updatePillar(node.pillar.id, {
        niche: pNiche, name: pName,
        description: pDesc || undefined,
        focus_keyword: pKw || undefined,
      });
      onRefresh();
    } finally { setSaving(false); }
  }

  async function saveTopic() {
    if (node?.type !== "topicNode") return;
    setSaving(true);
    try {
      await updateTopic(node.topic.id, {
        title: tTitle,
        focus_keyword: tKw || undefined,
        search_volume: tVolume ? parseInt(tVolume) : undefined,
        difficulty: tDiff ? parseInt(tDiff) : undefined,
        notes: tNotes || undefined,
        status: tStatus,
        pillar_id: tPillarId || null,
      });
      onRefresh();
    } finally { setSaving(false); }
  }

  async function confirmAction() {
    if (!modal) return;
    if (modal.type === "deletePillar") {
      if (node?.type !== "pillarNode") return;
      setDeleting(true);
      try { await deletePillar(node.pillar.id); onClose(); onRefresh(); }
      finally { setDeleting(false); setModal(null); }
    } else if (modal.type === "deleteTopic") {
      if (node?.type !== "topicNode") return;
      setDeleting(true);
      try { await deleteTopic(node.topic.id); onClose(); onRefresh(); }
      finally { setDeleting(false); setModal(null); }
    } else if (modal.type === "detachArticle") {
      if (node?.type !== "articleNode") return;
      setSaving(true);
      try { await adminUpdateArticle(node.article.id, { pillar_id: null }); onClose(); onRefresh(); }
      finally { setSaving(false); setModal(null); }
    } else if (modal.type === "renameNiche") {
      if (node?.type !== "nicheNode" || !renameValue.trim() || renameValue.trim() === modal.current) {
        setModal(null); return;
      }
      setSaving(true);
      try {
        await Promise.all(node.pillars.map(p => updatePillar(p.id, { niche: renameValue.trim() })));
        onRefresh();
      } finally { setSaving(false); setModal(null); }
    }
  }

  const labelCls = "block text-[10px] font-bold text-[#242423]/50 uppercase tracking-wider mb-1";
  const inputCls = "w-full border border-[#242423]/12 rounded-lg px-2.5 py-2 text-sm text-[#242423] bg-white focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30";

  const modalConfig = (() => {
    if (!modal) return null;
    if (modal.type === "deletePillar") return {
      title: "Hapus Pillar",
      message: `Hapus pillar "${modal.name}"? Topik terhubung tidak ikut terhapus.`,
      confirmLabel: "Hapus", danger: true,
    };
    if (modal.type === "deleteTopic") return {
      title: "Hapus Topik",
      message: `Hapus topik "${modal.name}"? Tindakan ini tidak bisa dibatalkan.`,
      confirmLabel: "Hapus", danger: true,
    };
    if (modal.type === "detachArticle") return {
      title: "Lepas dari Pillar",
      message: `Lepas artikel "${modal.title}" dari content pillar ini?`,
      confirmLabel: "Lepas", danger: false,
    };
    if (modal.type === "renameNiche") return {
      title: "Rename Niche",
      message: `Ubah nama niche dari "${modal.current}":`,
      confirmLabel: "Simpan", danger: false,
      inputLabel: "Nama niche baru",
    };
    return null;
  })();

  return (
    <>
      <div className="absolute right-0 top-0 h-full w-80 bg-white border-l border-[#242423]/8 shadow-lg flex flex-col z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#242423]/8">
          <span className="text-xs font-bold text-[#242423]/60 uppercase tracking-wider">
            {node.type === "nicheNode" ? "Niche"
              : node.type === "pillarNode" ? "Content Pillar"
              : node.type === "topicNode" ? "Topik"
              : "Artikel"}
          </span>
          <button onClick={onClose} className="text-[#242423]/40 hover:text-[#242423] transition">
            <X size={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {/* Niche */}
          {node.type === "nicheNode" && (
            <>
              <div>
                <div className="font-bold text-[#242423] text-sm">{node.nicheLabel}</div>
                <div className="text-xs text-[#242423]/45 mt-0.5">{node.pillars.length} pillar terhubung</div>
              </div>
              <button
                onClick={() => { setRenameValue(node.nicheLabel); setModal({ type: "renameNiche", current: node.nicheLabel }); }}
                disabled={saving}
                className="w-full text-sm border border-[#242423]/12 rounded-lg px-3 py-2 text-[#242423]/60 hover:border-[#242423]/25 hover:text-[#242423] transition disabled:opacity-40"
              >
                Rename niche...
              </button>
            </>
          )}

          {/* Pillar */}
          {node.type === "pillarNode" && (
            <>
              <div>
                <label className={labelCls}>Niche</label>
                <input value={pNiche} onChange={e => setPNiche(e.target.value)} className={inputCls} placeholder="Niche" />
              </div>
              <div>
                <label className={labelCls}>Nama Pillar</label>
                <input value={pName} onChange={e => setPName(e.target.value)} className={inputCls} placeholder="Nama pillar" />
              </div>
              <div>
                <label className={labelCls}>Focus Keyword</label>
                <input value={pKw} onChange={e => setPKw(e.target.value)} className={inputCls} placeholder="keyword utama" />
              </div>
              <div>
                <label className={labelCls}>Deskripsi</label>
                <textarea value={pDesc} onChange={e => setPDesc(e.target.value)} rows={3} className={inputCls} placeholder="Opsional" />
              </div>
            </>
          )}

          {/* Topic */}
          {node.type === "topicNode" && (
            <>
              <div>
                <label className={labelCls}>Judul Topik</label>
                <input value={tTitle} onChange={e => setTTitle(e.target.value)} className={inputCls} placeholder="Judul topik" />
              </div>
              <div>
                <label className={labelCls}>Focus Keyword</label>
                <input value={tKw} onChange={e => setTKw(e.target.value)} className={inputCls} placeholder="keyword" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={labelCls}>Search Volume</label>
                  <input type="number" value={tVolume} onChange={e => setTVolume(e.target.value)} className={inputCls} placeholder="e.g. 2400" />
                </div>
                <div>
                  <label className={labelCls}>Difficulty (0-100)</label>
                  <input type="number" min={0} max={100} value={tDiff} onChange={e => setTDiff(e.target.value)} className={inputCls} placeholder="e.g. 35" />
                </div>
              </div>
              <div>
                <label className={labelCls}>Content Pillar</label>
                <select value={tPillarId} onChange={e => setTPillarId(e.target.value)} className={inputCls}>
                  <option value="">— tidak terhubung —</option>
                  {pillars.map(p => (
                    <option key={p.id} value={p.id}>{p.niche} / {p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Status</label>
                <select value={tStatus} onChange={e => setTStatus(e.target.value)} className={inputCls}>
                  <option value="planned">Planned</option>
                  <option value="written">Written</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Catatan</label>
                <textarea value={tNotes} onChange={e => setTNotes(e.target.value)} rows={3} className={inputCls} placeholder="Catatan SEMrush, angle, dll." />
              </div>
            </>
          )}

          {/* Article */}
          {node.type === "articleNode" && (
            <>
              <div>
                <div className="font-semibold text-[#242423] text-sm leading-snug">{node.article.title}</div>
                <div className="text-xs text-[#242423]/45 mt-1">{node.article.slug}</div>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-[10px] font-bold rounded-full px-2 py-0.5 ${
                    node.article.status === "published"
                      ? "bg-green-50 text-green-700"
                      : "bg-[#242423]/6 text-[#242423]/50"
                  }`}
                >
                  {node.article.status === "published" ? "Tayang" : "Draft"}
                </span>
              </div>
              <a
                href={`/admin/posts/${node.article.id}`}
                target="_blank"
                className="flex items-center gap-1.5 text-xs text-[#f5a700] hover:underline"
              >
                <ExternalLink size={12} /> Edit artikel
              </a>
              <button
                onClick={() => setModal({ type: "detachArticle", title: node.article.title })}
                disabled={saving}
                className="w-full text-xs border border-red-200 text-red-500 rounded-lg px-3 py-2 hover:bg-red-50 transition disabled:opacity-40"
              >
                Lepas dari pillar
              </button>
            </>
          )}
        </div>

        {/* Footer actions */}
        {(node.type === "pillarNode" || node.type === "topicNode") && (
          <div className="px-4 py-3 border-t border-[#242423]/8 flex gap-2">
            <button
              onClick={() =>
                node.type === "pillarNode"
                  ? setModal({ type: "deletePillar", name: node.pillar.name })
                  : setModal({ type: "deleteTopic", name: node.topic.title })
              }
              disabled={deleting}
              className="flex items-center gap-1.5 text-xs border border-red-200 text-red-500 rounded-lg px-3 py-2 hover:bg-red-50 transition disabled:opacity-40"
            >
              <Trash2 size={12} /> Hapus
            </button>
            <button
              onClick={node.type === "pillarNode" ? savePillar : saveTopic}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-1.5 bg-[#f5a700] text-white text-xs font-bold rounded-lg px-3 py-2 hover:bg-[#f5a700]/90 transition disabled:opacity-40"
            >
              <Save size={12} /> {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        )}
      </div>

      {modalConfig && (
        <ConfirmModal
          open={modal !== null}
          title={modalConfig.title}
          message={modalConfig.message}
          confirmLabel={modalConfig.confirmLabel}
          danger={modalConfig.danger}
          inputLabel={"inputLabel" in modalConfig ? modalConfig.inputLabel : undefined}
          inputValue={modal?.type === "renameNiche" ? renameValue : undefined}
          onInputChange={modal?.type === "renameNiche" ? setRenameValue : undefined}
          onConfirm={confirmAction}
          onCancel={() => setModal(null)}
        />
      )}
    </>
  );
}
