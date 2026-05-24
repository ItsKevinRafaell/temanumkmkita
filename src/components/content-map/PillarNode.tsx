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
      className={`bg-white rounded-xl border-2 px-4 py-3 min-w-[160px] shadow-sm transition-all ${
        selected ? "border-[#f5a700] shadow-md" : "border-[#f5a700]/40"
      }`}
    >
      <Handle type="target" position={Position.Top} className="!bg-[#f5a700]/60 !border-[#f5a700]/40 !w-2 !h-2" />
      <div className="font-bold text-[#242423] text-sm leading-snug">{d.label}</div>
      {d.focusKeyword && (
        <div className="text-[10px] text-[#f5a700] font-semibold mt-0.5 truncate">{d.focusKeyword}</div>
      )}
      <div className="flex gap-2 mt-1.5">
        {d.articleCount > 0 && (
          <span className="text-[10px] bg-green-50 text-green-700 rounded-full px-1.5 py-0.5 font-semibold">
            {d.articleCount} artikel
          </span>
        )}
        {d.topicCount > 0 && (
          <span className="text-[10px] bg-[#242423]/6 text-[#242423]/60 rounded-full px-1.5 py-0.5 font-semibold">
            {d.topicCount} topik
          </span>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-[#f5a700]/60 !border-[#f5a700]/40 !w-2 !h-2" />
    </div>
  );
}
