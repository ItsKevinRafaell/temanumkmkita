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
      className={`min-w-[140px] max-w-[200px] rounded-lg border bg-white px-3 py-2 shadow-sm transition-all ${
        selected ? "border-[#242423]/30 shadow-md" : "border-[#242423]/12"
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
      <span
        className={`mt-1 inline-block rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
          published ? "bg-green-50 text-green-700" : "bg-[#242423]/6 text-[#242423]/50"
        }`}
      >
        {published ? "Tayang" : "Draft"}
      </span>
    </div>
  );
}
