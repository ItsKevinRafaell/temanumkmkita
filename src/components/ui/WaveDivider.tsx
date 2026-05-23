interface WaveDividerProps {
  fill: string;
  flip?: boolean;
  className?: string;
}

export default function WaveDivider({ fill, flip = false, className = "" }: WaveDividerProps) {
  return (
    <div
      className={`absolute ${flip ? "top-0" : "bottom-0"} left-0 right-0 pointer-events-none overflow-hidden leading-none ${className}`}
      style={{ transform: flip ? "rotate(180deg)" : undefined }}
    >
      <svg
        viewBox="0 0 1440 72"
        preserveAspectRatio="none"
        className="w-full h-[72px]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,36 C240,72 480,0 720,36 C960,72 1200,0 1440,36 L1440,72 L0,72 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}
