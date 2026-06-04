"use client";

import "@xyflow/react/dist/style.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ReactFlow, Background, Controls, MiniMap,
  useNodesState, useEdgesState,
  type Node, type Edge, type NodeMouseHandler, type OnNodeDrag,
} from "@xyflow/react";
import { FileText, LogOut } from "lucide-react";
import { logout } from "@/lib/api/admin";
import { adminListArticles, type AdminArticle } from "@/lib/api/admin";
import {
  fetchPillars, fetchTopics, updatePillar, updateTopic,
  type ContentPillar, type ContentTopic,
} from "@/lib/api/content-map";
import NicheNode from "@/components/content-map/NicheNode";
import PillarNode from "@/components/content-map/PillarNode";
import ArticleNode from "@/components/content-map/ArticleNode";
import TopicNode from "@/components/content-map/TopicNode";
import EditPanel from "@/components/content-map/EditPanel";
import AddNodeToolbar from "@/components/content-map/AddNodeToolbar";

const nodeTypes = {
  nicheNode: NicheNode,
  pillarNode: PillarNode,
  articleNode: ArticleNode,
  topicNode: TopicNode,
};

function posKey(id: string) { return `cm_pos_${id}`; }

function loadPos(id: string): { x: number; y: number } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(posKey(id));
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function savePos(id: string, x: number, y: number) {
  if (typeof window === "undefined") return;
  localStorage.setItem(posKey(id), JSON.stringify({ x, y }));
}

function buildGraph(
  pillars: ContentPillar[],
  topics: ContentTopic[],
  articles: AdminArticle[],
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const niches = Array.from(new Set(pillars.map(p => p.niche)));

  // Niche nodes — auto grid if no saved pos
  niches.forEach((niche, i) => {
    const id = `niche-${niche}`;
    const pos = loadPos(id) ?? { x: i * 220, y: 0 };
    const pillarCount = pillars.filter(p => p.niche === niche).length;
    nodes.push({ id, type: "nicheNode", position: pos, data: { label: niche, pillarCount } });
  });

  // Pillar nodes
  pillars.forEach((p, i) => {
    const nicheIdx = niches.indexOf(p.niche);
    const defaultPos = { x: nicheIdx * 220 + (i % 3) * 5, y: 120 + Math.floor(i / 3) * 140 };
    const pos = { x: p.position_x || defaultPos.x, y: p.position_y || defaultPos.y };
    const articleCount = articles.filter(a => a.pillar_id === p.id).length;
    const topicCount = topics.filter(t => t.pillar_id === p.id).length;
    nodes.push({
      id: p.id, type: "pillarNode", position: pos,
      data: { label: p.name, focusKeyword: p.focus_keyword, articleCount, topicCount, pillar: p },
    });
    edges.push({ id: `e-niche-${p.id}`, source: `niche-${p.niche}`, target: p.id, type: "smoothstep" });
  });

  // Topic nodes
  topics.forEach((t, i) => {
    const pillarIdx = pillars.findIndex(p => p.id === t.pillar_id);
    const pillar = pillars[pillarIdx];
    const defaultPos = pillar
      ? { x: (pillar.position_x || 0) + (i % 4 - 1.5) * 180, y: (pillar.position_y || 120) + 160 }
      : { x: i * 180, y: 400 };
    const pos = { x: t.position_x || defaultPos.x, y: t.position_y || defaultPos.y };
    nodes.push({
      id: t.id, type: "topicNode", position: pos,
      data: {
        label: t.title, focusKeyword: t.focus_keyword,
        searchVolume: t.search_volume, difficulty: t.difficulty,
        status: t.status, topic: t,
      },
    });
    if (t.pillar_id) {
      edges.push({ id: `e-pt-${t.id}`, source: t.pillar_id, target: t.id, type: "smoothstep" });
    }
  });

  // Article nodes
  articles.filter(a => a.pillar_id).forEach((a, i) => {
    const pillar = pillars.find(p => p.id === a.pillar_id);
    const defaultPos = pillar
      ? { x: (pillar.position_x || 0) - 200 + (i % 3) * 180, y: (pillar.position_y || 120) + 160 }
      : { x: i * 180, y: 560 };
    const pos = loadPos(a.id) ?? defaultPos;
    nodes.push({
      id: a.id, type: "articleNode", position: pos,
      data: { label: a.title, status: a.status, article: a },
    });
    edges.push({ id: `e-pa-${a.id}`, source: a.pillar_id!, target: a.id, type: "smoothstep" });
  });

  return { nodes, edges };
}

type SelectedNode =
  | { type: "nicheNode"; nicheLabel: string; pillars: ContentPillar[] }
  | { type: "pillarNode"; pillar: ContentPillar }
  | { type: "topicNode"; topic: ContentTopic }
  | { type: "articleNode"; article: AdminArticle };

export default function ContentMapPage() {
  const router = useRouter();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<SelectedNode | null>(null);

  const pillarsRef = useRef<ContentPillar[]>([]);
  const topicsRef = useRef<ContentTopic[]>([]);
  const articlesRef = useRef<AdminArticle[]>([]);

  const load = useCallback(async () => {
    try {
      const [ps, ts, artData] = await Promise.all([
        fetchPillars(),
        fetchTopics(),
        adminListArticles(1, 200),
      ]);
      pillarsRef.current = ps;
      topicsRef.current = ts;
      articlesRef.current = artData.items;
      const { nodes: n, edges: e } = buildGraph(ps, ts, artData.items);
      setNodes(n);
      setEdges(e);
    } catch {
      router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  }, [router, setNodes, setEdges]);

  useEffect(() => { load(); }, [load]);

  const handleNodeClick: NodeMouseHandler = useCallback((_, node) => {
    const { type, data } = node;
    if (type === "nicheNode") {
      const label = data.label as string;
      setSelectedNode({
        type: "nicheNode",
        nicheLabel: label,
        pillars: pillarsRef.current.filter(p => p.niche === label),
      });
    } else if (type === "pillarNode") {
      setSelectedNode({ type: "pillarNode", pillar: data.pillar as ContentPillar });
    } else if (type === "topicNode") {
      setSelectedNode({ type: "topicNode", topic: data.topic as ContentTopic });
    } else if (type === "articleNode") {
      setSelectedNode({ type: "articleNode", article: data.article as AdminArticle });
    }
  }, []);

  const handleDragStop: OnNodeDrag = useCallback(async (_, node) => {
    const { id, type, position } = node;
    if (type === "pillarNode") {
      await updatePillar(id, { position_x: position.x, position_y: position.y });
    } else if (type === "topicNode") {
      await updateTopic(id, { position_x: position.x, position_y: position.y });
    } else {
      savePos(id, position.x, position.y);
    }
  }, []);

  function handleLogout() {
    logout();
    document.cookie = "admin_token=; path=/; max-age=0";
    router.push("/admin/login");
  }

  const unassigned = articlesRef.current.filter(a => !a.pillar_id);

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-[#fcfaf7]">
      {/* Topbar */}
      <header className="bg-white border-b border-[#242423]/8 px-4 sm:px-6 py-3.5 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-7 h-7 bg-[#f5a700] rounded-lg flex items-center justify-center flex-shrink-0">
            <FileText size={13} className="text-white" />
          </div>
          <span className="hidden sm:inline font-extrabold text-[#242423] text-base">Teman UMKM Kita</span>
          <span className="hidden sm:inline text-[#242423]/20 text-sm">/ Content Map</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="/admin/posts"
            className="text-xs text-[#242423]/50 hover:text-[#242423] transition"
          >
            ← Artikel
          </a>
          <AddNodeToolbar
            pillars={pillarsRef.current}
            unassignedArticles={unassigned}
            onRefresh={load}
          />
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-[#242423]/50 hover:text-[#242423] transition"
          >
            <LogOut size={13} /> Keluar
          </button>
        </div>
      </header>

      {/* Canvas */}
      <div className="flex-1 min-h-0 relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-[#242423]/40">
            Memuat...
          </div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={handleNodeClick}
            onNodeDragStop={handleDragStop}
            onPaneClick={() => setSelectedNode(null)}
            fitView
            defaultEdgeOptions={{ type: "smoothstep", style: { stroke: "#242423", strokeOpacity: 0.15 } }}
          >
            <Background color="#242423" gap={20} size={1} style={{ opacity: 0.04 }} />
            <Controls />
            <MiniMap
              nodeColor={(n) =>
                n.type === "nicheNode" ? "#f5a700"
                : n.type === "pillarNode" ? "#f5a700"
                : n.type === "topicNode" ? "#9ca3af"
                : "#6ee7b7"
              }
              style={{ background: "#fcfaf7", border: "1px solid rgba(36,36,35,0.08)" }}
            />
          </ReactFlow>
        )}

        {selectedNode && (
          <EditPanel
            node={selectedNode}
            pillars={pillarsRef.current}
            onClose={() => setSelectedNode(null)}
            onRefresh={() => { setSelectedNode(null); load(); }}
          />
        )}
      </div>
    </div>
  );
}
