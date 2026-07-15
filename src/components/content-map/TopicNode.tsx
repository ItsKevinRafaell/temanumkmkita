import { Handle, Position, type NodeProps } from "@xyflow/react";

type TopicNodeData = {
  label: string;
  focusKeyword: string | null;
  searchVolume: number | null;
  difficulty: number | null;
  status: string;
};

export default function TopicNode({ data, selected }: NodeProps) {
  const d = data as TopicNodeData;
  const planned = d.status === "planned";
  return (
    <div
      className={`min-w-[140px] max-w-[200px] rounded-lg border bg-white px-3 py-2 shadow-sm transition-all ${
        selected
          ? "border-[#242423]/30 shadow-md"
          : planned
            ? "border-dashed border-[#242423]/20"
            : "border-[#242423]/15"
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!h-2 !w-2 !border-[#242423]/20 !bg-[#242423]/30"
      />
      <div className="line-clamp-2 text-xs font-semibold leading-snug text-[#242423]">
        {d.label}
      </div>
      {d.focusKeyword && (
        <div className="mt-0.5 truncate text-[9px] text-[#242423]/45">{d.focusKeyword}</div>
      )}
      <div className="mt-1.5 flex flex-wrap gap-1">
        {d.difficulty !== null && (
          <span
            className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
              d.difficulty >= 60
                ? "bg-red-50 text-red-600"
                : d.difficulty >= 40
                  ? "bg-amber-50 text-[#f5a700]"
                  : "bg-green-50 text-green-700"
            }`}
          >
            KD {d.difficulty}
          </span>
        )}
        {d.searchVolume !== null && (
          <span className="rounded-full bg-blue-50 px-1.5 py-0.5 text-[9px] font-semibold text-blue-600">
            {d.searchVolume >= 1000 ? `${(d.searchVolume / 1000).toFixed(1)}k` : d.searchVolume} vol
          </span>
        )}
        {planned && (
          <span className="rounded-full bg-[#242423]/5 px-1.5 py-0.5 text-[9px] text-[#242423]/40">
            planned
          </span>
        )}
      </div>
    </div>
  );
}
