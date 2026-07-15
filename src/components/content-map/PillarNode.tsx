import { Handle, Position, type NodeProps } from "@xyflow/react";

type PillarNodeData = {
  label: string;
  focusKeyword: string | null;
  articleCount: number;
  topicCount: number;
};

export default function PillarNode({ data, selected }: NodeProps) {
  const d = data as PillarNodeData;
  return (
    <div
      className={`min-w-[160px] rounded-xl border-2 bg-white px-4 py-3 shadow-sm transition-all ${
        selected ? "border-[#f5a700] shadow-md" : "border-[#f5a700]/40"
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!h-2 !w-2 !border-[#f5a700]/40 !bg-[#f5a700]/60"
      />
      <div className="text-sm font-bold leading-snug text-[#242423]">{d.label}</div>
      {d.focusKeyword && (
        <div className="mt-0.5 truncate text-[10px] font-semibold text-[#f5a700]">
          {d.focusKeyword}
        </div>
      )}
      <div className="mt-1.5 flex gap-2">
        {d.articleCount > 0 && (
          <span className="rounded-full bg-green-50 px-1.5 py-0.5 text-[10px] font-semibold text-green-700">
            {d.articleCount} artikel
          </span>
        )}
        {d.topicCount > 0 && (
          <span className="bg-[#242423]/6 rounded-full px-1.5 py-0.5 text-[10px] font-semibold text-[#242423]/60">
            {d.topicCount} topik
          </span>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-2 !w-2 !border-[#f5a700]/40 !bg-[#f5a700]/60"
      />
    </div>
  );
}
