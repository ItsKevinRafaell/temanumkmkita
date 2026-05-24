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
      className={`bg-white rounded-lg border px-3 py-2 min-w-[140px] max-w-[200px] shadow-sm transition-all ${
        selected
          ? "border-[#242423]/30 shadow-md"
          : planned
          ? "border-dashed border-[#242423]/20"
          : "border-[#242423]/15"
      }`}
    >
      <Handle type="target" position={Position.Top} className="!bg-[#242423]/30 !border-[#242423]/20 !w-2 !h-2" />
      <div className="font-semibold text-[#242423] text-xs leading-snug line-clamp-2">{d.label}</div>
      {d.focusKeyword && (
        <div className="text-[9px] text-[#242423]/45 mt-0.5 truncate">{d.focusKeyword}</div>
      )}
      <div className="flex gap-1 mt-1.5 flex-wrap">
        {d.difficulty !== null && (
          <span
            className={`text-[9px] font-bold rounded-full px-1.5 py-0.5 ${
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
          <span className="text-[9px] bg-blue-50 text-blue-600 rounded-full px-1.5 py-0.5 font-semibold">
            {d.searchVolume >= 1000 ? `${(d.searchVolume / 1000).toFixed(1)}k` : d.searchVolume} vol
          </span>
        )}
        {planned && (
          <span className="text-[9px] bg-[#242423]/5 text-[#242423]/40 rounded-full px-1.5 py-0.5">
            planned
          </span>
        )}
      </div>
    </div>
  );
}
