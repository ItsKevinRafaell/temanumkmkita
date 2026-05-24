import { Handle, Position, type NodeProps } from "@xyflow/react";

type ArticleNodeData = {
  label: string;
  status: string;
};

export default function ArticleNode({ data, selected }: NodeProps) {
  const d = data as ArticleNodeData;
  const published = d.status === "published";
  return (
    <div
      className={`bg-white rounded-lg border px-3 py-2 min-w-[140px] max-w-[200px] shadow-sm transition-all ${
        selected ? "border-[#242423]/30 shadow-md" : "border-[#242423]/12"
      }`}
    >
      <Handle type="target" position={Position.Top} className="!bg-[#242423]/30 !border-[#242423]/20 !w-2 !h-2" />
      <div className="font-semibold text-[#242423] text-xs leading-snug line-clamp-2">{d.label}</div>
      <span
        className={`inline-block mt-1 text-[9px] font-bold rounded-full px-1.5 py-0.5 ${
          published ? "bg-green-50 text-green-700" : "bg-[#242423]/6 text-[#242423]/50"
        }`}
      >
        {published ? "Tayang" : "Draft"}
      </span>
    </div>
  );
}
