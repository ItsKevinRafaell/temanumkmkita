import Link from "next/link";

type LogoVariant = "secondary" | "primary" | "icon";
type LogoColor = "yellow" | "white";

interface LogoProps {
  variant?: LogoVariant;
  color?: LogoColor;
  className?: string;
}

const SIZE_MAP: Record<LogoVariant, string> = {
  icon: "h-10 w-10",
  secondary: "h-10 w-[210px]",
  primary: "h-24 w-[260px]",
};

const VAR_MAP: Record<`${LogoVariant}-${LogoColor}`, string> = {
  "secondary-yellow": "var(--brand-logo-url)",
  "secondary-white": "var(--brand-logo-light-url)",
  "primary-yellow": "var(--brand-logo-primary-url)",
  "primary-white": "var(--brand-logo-primary-light-url)",
  "icon-yellow": "var(--brand-logo-icon-yellow-url)",
  "icon-white": "var(--brand-logo-icon-white-url)",
};

export default function Logo({
  variant = "secondary",
  color = "yellow",
  className = "",
}: LogoProps) {
  const imageVar = VAR_MAP[`${variant}-${color}`];
  const imageSize = SIZE_MAP[variant];

  return (
    <Link
      href="/"
      className={`inline-flex items-center ${color === "white" && variant !== "icon" ? "rounded-lg bg-transparent" : ""} ${className}`}
      aria-label="Teman UMKM Kita"
    >
      <span
        aria-hidden="true"
        className={`block ${imageSize} bg-contain bg-left bg-no-repeat`}
        style={{ backgroundImage: imageVar }}
      />
      <span className="sr-only">Teman UMKM Kita</span>
    </Link>
  );
}
