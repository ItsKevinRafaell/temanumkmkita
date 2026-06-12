import { type NodeProps } from "@xyflow/react";

type MonthNodeData = {
  label: string;
  itemCount: number;
};

export default function MonthNode({ data }: NodeProps) {
  const d = data as MonthNodeData;
  return (
    <div className="bg-[#242423] text-white rounded-lg px-3 py-2 min-w-[120px] shadow-sm">
      <div className="font-extrabold text-xs leading-tight">{d.label}</div>
      <div className="text-[10px] text-white/60 mt-0.5">{d.itemCount} item</div>
    </div>
  );
}
