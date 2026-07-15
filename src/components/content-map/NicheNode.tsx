import { Handle, Position, type NodeProps } from "@xyflow/react";

type NicheNodeData = {
  label: string;
  pillarCount: number;
};

export default function NicheNode({ data }: NodeProps) {
  const d = data as NicheNodeData;
  return (
    <div className="min-w-[140px] rounded-2xl bg-[#f5a700] px-4 py-3 text-white shadow-md">
      <div className="text-sm font-extrabold leading-tight">{d.label}</div>
      <div className="mt-0.5 text-[11px] text-white/75">{d.pillarCount} pillar</div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-2 !w-2 !border-white/40 !bg-white/60"
      />
    </div>
  );
}
