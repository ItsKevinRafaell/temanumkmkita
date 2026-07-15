interface BlobProps {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  size?: number;
  opacity?: number;
  shape?: 1 | 2 | 3;
  className?: string;
}

const borderRadii = [
  "60% 40% 30% 70% / 60% 30% 70% 40%",
  "30% 70% 70% 30% / 30% 30% 70% 70%",
  "50% 60% 40% 50% / 40% 60% 50% 60%",
];

const positions: Record<NonNullable<BlobProps["position"]>, string> = {
  "top-left": "-top-20 -left-20",
  "top-right": "-top-20 -right-20",
  "bottom-left": "-bottom-20 -left-20",
  "bottom-right": "-bottom-20 -right-20",
};

export default function BlobDecoration({
  position = "bottom-right",
  size = 400,
  opacity = 0.15,
  shape = 1,
  className = "",
}: BlobProps) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute ${positions[position]} ${className}`}
      style={{
        width: size,
        height: size,
        background: `rgba(245, 167, 0, ${opacity})`,
        borderRadius: borderRadii[shape - 1],
        filter: "blur(48px)",
      }}
    />
  );
}
