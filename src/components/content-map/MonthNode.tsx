import { type NodeProps } from "@xyflow/react";

type MonthNodeData = {
  label: string;
  itemCount: number;
};

export default function MonthNode({ data }: NodeProps) {
  const d = data as MonthNodeData;
  return (
    <div className="min-w-[120px] rounded-lg bg-[#242423] px-3 py-2 text-white shadow-sm">
      <div className="text-xs font-extrabold leading-tight">{d.label}</div>
      <div className="mt-0.5 text-[10px] text-white/60">{d.itemCount} item</div>
    </div>
  );
}
