"use client";

import "@xyflow/react/dist/style.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type NodeMouseHandler,
  type OnNodeDrag,
  type ReactFlowInstance,
} from "@xyflow/react";
import { CalendarDays, FileText, LayoutGrid, Loader2, LogOut } from "lucide-react";
import { logout } from "@/lib/api/admin";
import { adminListArticles, type AdminArticle } from "@/lib/api/admin";
import {
  fetchPillars,
  fetchTopics,
  updatePillar,
  updateTopic,
  type ContentPillar,
  type ContentTopic,
} from "@/lib/api/content-map";
import NicheNode from "@/components/content-map/NicheNode";
import PillarNode from "@/components/content-map/PillarNode";
import ArticleNode from "@/components/content-map/ArticleNode";
import TopicNode from "@/components/content-map/TopicNode";
import MonthNode from "@/components/content-map/MonthNode";
import EditPanel from "@/components/content-map/EditPanel";
import AddNodeToolbar from "@/components/content-map/AddNodeToolbar";

const nodeTypes = {
  nicheNode: NicheNode,
  pillarNode: PillarNode,
  articleNode: ArticleNode,
  topicNode: TopicNode,
  monthNode: MonthNode,
};

function posKey(id: string) {
  return `cm_pos_${id}`;
}

function loadPos(id: string): { x: number; y: number } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(posKey(id));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function savePos(id: string, x: number, y: number) {
  if (typeof window === "undefined") return;
  localStorage.setItem(posKey(id), JSON.stringify({ x, y }));
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

const YEAR_OPTIONS = Array.from(
  new Set([
    new Date().getFullYear() - 1,
    new Date().getFullYear(),
    new Date().getFullYear() + 1,
    new Date().getFullYear() + 2,
    2026,
    2027,
  ])
).sort((a, b) => a - b);

const NICHE_ORDER = [
  "Website",
  "SEO & Google Maps",
  "Sosial Media",
  "Branding",
  "Maintenance",
  "Tips Bisnis",
];

type DateFilters = {
  year: string;
  month: string;
  dateFrom: string;
  dateTo: string;
};

function articleEditorialDate(article: AdminArticle): string | null {
  return (article.published_at ?? article.created_at)?.slice(0, 10) ?? null;
}

function topicPublishDate(topic: ContentTopic): string | null {
  const match = topic.notes?.match(/Publish date:\s*(\d{4}-\d{2}-\d{2})/);
  return match?.[1] ?? null;
}

function monthKeyFromDate(date: string | null): string | null {
  return date ? date.slice(0, 7) : null;
}

function monthLabel(monthKey: string) {
  if (monthKey === "unscheduled") return "Tanpa Jadwal";
  return new Date(`${monthKey}-01T00:00:00`).toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });
}

function inDateFilters(date: string | null, filters: DateFilters) {
  const selectedMonth = filters.year && filters.month ? `${filters.year}-${filters.month}` : "";
  if (!date) return !filters.year && !selectedMonth && !filters.dateFrom && !filters.dateTo;
  if (selectedMonth && !date.startsWith(selectedMonth)) return false;
  if (!selectedMonth && filters.year && !date.startsWith(`${filters.year}-`)) return false;
  if (filters.dateFrom && date < filters.dateFrom) return false;
  if (filters.dateTo && date > filters.dateTo) return false;
  return true;
}

function filterTopicsByDate(topics: ContentTopic[], filters: DateFilters) {
  return topics.filter((topic) => inDateFilters(topicPublishDate(topic), filters));
}

function normalizeTitle(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function hideConvertedTopics(topics: ContentTopic[], articles: AdminArticle[]) {
  const articleTitles = new Set(articles.map((article) => normalizeTitle(article.title)));
  return topics.filter((topic) => !articleTitles.has(normalizeTitle(topic.title)));
}

function visibleMonthKeys(topics: ContentTopic[], articles: AdminArticle[]) {
  const counts = new Map<string, number>();
  for (const topic of topics) {
    const key = monthKeyFromDate(topicPublishDate(topic)) ?? "unscheduled";
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  for (const article of articles) {
    const key = monthKeyFromDate(articleEditorialDate(article)) ?? "unscheduled";
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return Array.from(counts.entries()).sort(([a], [b]) => a.localeCompare(b));
}

function buildGraph(
  pillars: ContentPillar[],
  topics: ContentTopic[],
  articles: AdminArticle[]
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const niches = Array.from(new Set(pillars.map((p) => p.niche)));
  const monthKeys = visibleMonthKeys(topics, articles);
  const autoPositions = buildAutoLayout(pillars, topics, articles);

  // Niche nodes — auto grid if no saved pos
  niches.forEach((niche, i) => {
    const id = `niche-${niche}`;
    const pos = loadPos(id) ?? autoPositions[id] ?? { x: i * 220, y: 0 };
    const pillarCount = pillars.filter((p) => p.niche === niche).length;
    nodes.push({ id, type: "nicheNode", position: pos, data: { label: niche, pillarCount } });
  });

  monthKeys.forEach(([monthKey, itemCount], i) => {
    const id = `month-${monthKey}`;
    const pos = loadPos(id) ?? autoPositions[id] ?? { x: -220, y: 320 + i * 260 };
    nodes.push({
      id,
      type: "monthNode",
      position: pos,
      data: { label: monthLabel(monthKey), itemCount },
    });
  });

  // Pillar nodes
  pillars.forEach((p, i) => {
    const nicheIdx = niches.indexOf(p.niche);
    const defaultPos = { x: nicheIdx * 220 + (i % 3) * 5, y: 120 + Math.floor(i / 3) * 140 };
    const pos = {
      x: p.position_x || autoPositions[p.id]?.x || defaultPos.x,
      y: p.position_y || autoPositions[p.id]?.y || defaultPos.y,
    };
    const articleCount = articles.filter((a) => a.pillar_id === p.id).length;
    const topicCount = topics.filter((t) => t.pillar_id === p.id).length;
    nodes.push({
      id: p.id,
      type: "pillarNode",
      position: pos,
      data: { label: p.name, focusKeyword: p.focus_keyword, articleCount, topicCount, pillar: p },
    });
    edges.push({
      id: `e-niche-${p.id}`,
      source: `niche-${p.niche}`,
      target: p.id,
      type: "smoothstep",
    });
  });

  // Topic nodes
  topics.forEach((t, i) => {
    const pillarIdx = pillars.findIndex((p) => p.id === t.pillar_id);
    const pillar = pillars[pillarIdx];
    const defaultPos = pillar
      ? { x: (pillar.position_x || 0) + ((i % 4) - 1.5) * 180, y: (pillar.position_y || 120) + 160 }
      : { x: i * 180, y: 400 };
    const pos = {
      x: t.position_x || autoPositions[t.id]?.x || defaultPos.x,
      y: t.position_y || autoPositions[t.id]?.y || defaultPos.y,
    };
    nodes.push({
      id: t.id,
      type: "topicNode",
      position: pos,
      data: {
        label: t.title,
        focusKeyword: t.focus_keyword,
        searchVolume: t.search_volume,
        difficulty: t.difficulty,
        status: t.status,
        topic: t,
      },
    });
    if (t.pillar_id) {
      edges.push({ id: `e-pt-${t.id}`, source: t.pillar_id, target: t.id, type: "smoothstep" });
    }
  });

  // Article nodes
  articles
    .filter((a) => a.pillar_id)
    .forEach((a, i) => {
      const pillar = pillars.find((p) => p.id === a.pillar_id);
      const defaultPos = pillar
        ? { x: (pillar.position_x || 0) - 200 + (i % 3) * 180, y: (pillar.position_y || 120) + 160 }
        : { x: i * 180, y: 560 };
      const pos = loadPos(a.id) ?? autoPositions[a.id] ?? defaultPos;
      nodes.push({
        id: a.id,
        type: "articleNode",
        position: pos,
        data: { label: a.title, status: a.status, article: a },
      });
      edges.push({ id: `e-pa-${a.id}`, source: a.pillar_id!, target: a.id, type: "smoothstep" });
    });

  return { nodes, edges };
}

function buildAutoLayout(
  pillars: ContentPillar[],
  topics: ContentTopic[],
  articles: AdminArticle[]
): Record<string, { x: number; y: number }> {
  const positions: Record<string, { x: number; y: number }> = {};
  const orderedPillars = [...pillars].sort((a, b) => {
    const niche =
      (NICHE_ORDER.indexOf(a.niche) < 0 ? 999 : NICHE_ORDER.indexOf(a.niche)) -
      (NICHE_ORDER.indexOf(b.niche) < 0 ? 999 : NICHE_ORDER.indexOf(b.niche));
    return niche !== 0 ? niche : a.name.localeCompare(b.name);
  });
  const pillarIndex = new Map(orderedPillars.map((pillar, index) => [pillar.id, index]));
  const columnWidth = 380;
  const rowGap = 108;
  const monthKeys = visibleMonthKeys(topics, articles).map(([key]) => key);
  const monthStackCounts = new Map<string, number>();
  const countStack = (monthKey: string, pillarId: string | null) => {
    const key = `${monthKey}:${pillarId ?? "none"}`;
    monthStackCounts.set(key, (monthStackCounts.get(key) ?? 0) + 1);
  };
  topics.forEach((topic) =>
    countStack(monthKeyFromDate(topicPublishDate(topic)) ?? "unscheduled", topic.pillar_id)
  );
  articles.forEach((article) =>
    countStack(monthKeyFromDate(articleEditorialDate(article)) ?? "unscheduled", article.pillar_id)
  );
  const maxStackByMonth = new Map<string, number>();
  monthStackCounts.forEach((count, key) => {
    const monthKey = key.split(":")[0];
    maxStackByMonth.set(monthKey, Math.max(maxStackByMonth.get(monthKey) ?? 0, count));
  });
  const monthHeights = monthKeys.map((key) =>
    Math.max(300, 120 + (maxStackByMonth.get(key) ?? 1) * rowGap)
  );
  const monthOffset = new Map<string, number>();
  monthKeys.reduce((offset, key, index) => {
    monthOffset.set(key, offset);
    return offset + monthHeights[index] + 70;
  }, 0);
  const headerY = 0;
  const pillarY = 130;
  const firstMonthY = 330;

  const niches = Array.from(new Set(orderedPillars.map((pillar) => pillar.niche)));
  niches.forEach((niche) => {
    const memberIndexes = orderedPillars
      .map((pillar, index) => (pillar.niche === niche ? index : -1))
      .filter((index) => index >= 0);
    const avgIndex =
      memberIndexes.reduce((sum, index) => sum + index, 0) / Math.max(1, memberIndexes.length);
    positions[`niche-${niche}`] = { x: avgIndex * columnWidth, y: headerY };
  });

  orderedPillars.forEach((pillar, index) => {
    positions[pillar.id] = { x: index * columnWidth, y: pillarY };
  });

  monthKeys.forEach((key) => {
    positions[`month-${key}`] = { x: -270, y: firstMonthY + (monthOffset.get(key) ?? 0) + 44 };
  });

  const stackIndexes = new Map<string, number>();
  const nextStack = (key: string) => {
    const current = stackIndexes.get(key) ?? 0;
    stackIndexes.set(key, current + 1);
    return current;
  };

  [...topics]
    .sort((a, b) => {
      const dateCompare = (topicPublishDate(a) ?? "").localeCompare(topicPublishDate(b) ?? "");
      return dateCompare !== 0 ? dateCompare : a.title.localeCompare(b.title);
    })
    .forEach((topic) => {
      const key = monthKeyFromDate(topicPublishDate(topic)) ?? "unscheduled";
      const column = topic.pillar_id ? (pillarIndex.get(topic.pillar_id) ?? 0) : 0;
      const stack = nextStack(`${key}:${topic.pillar_id ?? "none"}`);
      positions[topic.id] = {
        x: column * columnWidth,
        y: firstMonthY + (monthOffset.get(key) ?? 0) + 70 + stack * rowGap,
      };
    });

  [...articles]
    .sort((a, b) => {
      const dateCompare = (articleEditorialDate(a) ?? "").localeCompare(
        articleEditorialDate(b) ?? ""
      );
      return dateCompare !== 0 ? dateCompare : a.title.localeCompare(b.title);
    })
    .forEach((article) => {
      const key = monthKeyFromDate(articleEditorialDate(article)) ?? "unscheduled";
      const column = article.pillar_id ? (pillarIndex.get(article.pillar_id) ?? 0) : 0;
      const stack = nextStack(`${key}:${article.pillar_id ?? "none"}`);
      positions[article.id] = {
        x: column * columnWidth,
        y: firstMonthY + (monthOffset.get(key) ?? 0) + 70 + stack * rowGap,
      };
    });

  return positions;
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
  const [layouting, setLayouting] = useState(false);
  const [selectedNode, setSelectedNode] = useState<SelectedNode | null>(null);
  const [yearFilter, setYearFilter] = useState(String(new Date().getFullYear()));
  const [monthFilter, setMonthFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const pillarsRef = useRef<ContentPillar[]>([]);
  const topicsRef = useRef<ContentTopic[]>([]);
  const articlesRef = useRef<AdminArticle[]>([]);
  const flowRef = useRef<ReactFlowInstance | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const selectedMonth = yearFilter && monthFilter ? `${yearFilter}-${monthFilter}` : undefined;
      const [ps, ts, artData] = await Promise.all([
        fetchPillars(),
        fetchTopics(),
        adminListArticles(1, 500, {
          year: yearFilter || undefined,
          month: selectedMonth,
          date_from: dateFrom || undefined,
          date_to: dateTo || undefined,
        }),
      ]);
      const filteredTopics = filterTopicsByDate(ts, {
        year: yearFilter,
        month: monthFilter,
        dateFrom,
        dateTo,
      });
      const visibleTopics = hideConvertedTopics(filteredTopics, artData.items);
      pillarsRef.current = ps;
      topicsRef.current = visibleTopics;
      articlesRef.current = artData.items;
      setSelectedNode(null);
      const { nodes: n, edges: e } = buildGraph(ps, visibleTopics, artData.items);
      setNodes(n);
      setEdges(e);
    } catch {
      router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  }, [router, setNodes, setEdges, yearFilter, monthFilter, dateFrom, dateTo]);

  useEffect(() => {
    load();
  }, [load]);

  const handleNodeClick: NodeMouseHandler = useCallback((_, node) => {
    const { type, data } = node;
    if (type === "nicheNode") {
      const label = data.label as string;
      setSelectedNode({
        type: "nicheNode",
        nicheLabel: label,
        pillars: pillarsRef.current.filter((p) => p.niche === label),
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

  const handleAutoLayout = useCallback(async () => {
    setLayouting(true);
    const positions = buildAutoLayout(pillarsRef.current, topicsRef.current, articlesRef.current);
    setNodes((current) =>
      current.map((node) => (positions[node.id] ? { ...node, position: positions[node.id] } : node))
    );
    window.setTimeout(() => flowRef.current?.fitView({ padding: 0.18, duration: 500 }), 50);
    try {
      const pillarIds = new Set(pillarsRef.current.map((pillar) => pillar.id));
      const topicIds = new Set(topicsRef.current.map((topic) => topic.id));
      await Promise.all([
        ...pillarsRef.current
          .filter((pillar) => positions[pillar.id])
          .map((pillar) =>
            updatePillar(pillar.id, {
              position_x: positions[pillar.id].x,
              position_y: positions[pillar.id].y,
            })
          ),
        ...topicsRef.current
          .filter((topic) => positions[topic.id])
          .map((topic) =>
            updateTopic(topic.id, {
              position_x: positions[topic.id].x,
              position_y: positions[topic.id].y,
            })
          ),
      ]);
      Object.entries(positions).forEach(([id, position]) => {
        if (!pillarIds.has(id) && !topicIds.has(id)) savePos(id, position.x, position.y);
      });
      await load();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal merapikan content map");
    } finally {
      setLayouting(false);
    }
  }, [load, setNodes]);

  function handleLogout() {
    logout();
    document.cookie = "admin_token=; path=/; max-age=0";
    router.push("/admin/login");
  }

  const unassigned = articlesRef.current.filter((a) => !a.pillar_id);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#fcfaf7]">
      {/* Topbar */}
      <header className="border-[#242423]/8 z-20 flex shrink-0 flex-col justify-between gap-3 border-b bg-white px-4 py-3.5 sm:px-6 lg:flex-row lg:items-center">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[#f5a700]">
            <FileText size={13} className="text-white" />
          </div>
          <span className="hidden text-base font-extrabold text-[#242423] sm:inline">
            Teman UMKM Kita
          </span>
          <span className="hidden text-sm text-[#242423]/20 sm:inline">/ Content Map</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:justify-end">
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="border-[#242423]/12 rounded-lg border bg-white px-2.5 py-1.5 text-xs text-[#242423] focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30"
          >
            <option value="">Semua tahun</option>
            {YEAR_OPTIONS.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <select
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            disabled={!yearFilter}
            className="border-[#242423]/12 rounded-lg border bg-white px-2.5 py-1.5 text-xs text-[#242423] focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30 disabled:opacity-40"
          >
            <option value="">Semua bulan</option>
            {MONTHS.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-1 text-xs text-[#242423]/45">
            <CalendarDays size={12} />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="border-[#242423]/12 w-[124px] rounded-lg border bg-white px-2 py-1.5 text-xs text-[#242423] focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30"
              aria-label="Dari tanggal"
            />
            <span>sd</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="border-[#242423]/12 w-[124px] rounded-lg border bg-white px-2 py-1.5 text-xs text-[#242423] focus:outline-none focus:ring-2 focus:ring-[#f5a700]/30"
              aria-label="Sampai tanggal"
            />
          </div>
          <button
            onClick={handleAutoLayout}
            disabled={layouting || loading}
            className="flex items-center gap-1.5 rounded-lg bg-[#242423] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#242423]/90 disabled:opacity-50"
          >
            {layouting ? <Loader2 size={12} className="animate-spin" /> : <LayoutGrid size={12} />}
            Rapikan
          </button>
          <a
            href="/admin/posts"
            className="text-xs text-[#242423]/50 transition hover:text-[#242423]"
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
            className="flex items-center gap-1.5 text-xs text-[#242423]/50 transition hover:text-[#242423]"
          >
            <LogOut size={13} /> Keluar
          </button>
        </div>
      </header>

      {/* Canvas */}
      <div className="relative min-h-0 flex-1">
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
            onInit={(instance) => {
              flowRef.current = instance;
            }}
            fitView
            defaultEdgeOptions={{
              type: "smoothstep",
              style: { stroke: "#242423", strokeOpacity: 0.15 },
            }}
          >
            <Background color="#242423" gap={20} size={1} style={{ opacity: 0.04 }} />
            <Controls />
            <MiniMap
              nodeColor={(n) =>
                n.type === "nicheNode"
                  ? "#f5a700"
                  : n.type === "monthNode"
                    ? "#242423"
                    : n.type === "pillarNode"
                      ? "#f5a700"
                      : n.type === "topicNode"
                        ? "#9ca3af"
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
            onRefresh={() => {
              setSelectedNode(null);
              load();
            }}
          />
        )}
      </div>
    </div>
  );
}
