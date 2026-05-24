import { Handle, Position, type NodeProps } from "@xyflow/react";

type NicheNodeData = {
  label: string;
  pillarCount: number;
};

export default function NicheNode({ data }: NodeProps) {
  const d = data as NicheNodeData;
  return (
    <div className="bg-[#f5a700] text-white rounded-2xl px-4 py-3 min-w-[140px] shadow-md">
      <div className="font-extrabold text-sm leading-tight">{d.label}</div>
      <div className="text-[11px] text-white/75 mt-0.5">{d.pillarCount} pillar</div>
      <Handle type="source" position={Position.Bottom} className="!bg-white/60 !border-white/40 !w-2 !h-2" />
    </div>
  );
}
