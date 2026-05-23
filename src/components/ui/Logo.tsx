import Link from "next/link";

interface LogoProps {
  variant?: "light" | "dark";
  className?: string;
}

const SYSTEM_FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

export default function Logo({ variant = "dark", className = "" }: LogoProps) {
  const wordmarkColor = variant === "dark" ? "#f5a700" : "#ffffff";
  const subColor = variant === "dark" ? "#a3a3a3" : "rgba(255,255,255,0.6)";

  return (
    <Link
      href="/"
      className={`flex flex-col leading-none ${className}`}
      style={{ fontFamily: SYSTEM_FONT }}
    >
      <span
        className="font-bold text-lg"
        style={{ color: wordmarkColor, letterSpacing: "-0.025em" }}
      >
        Teman UMKM Kita
      </span>
      <span
        className="text-[10px] font-medium uppercase"
        style={{ letterSpacing: "0.1em", color: subColor, marginTop: "2px" }}
      >
        Solusi Digital Indonesia
      </span>
    </Link>
  );
}
