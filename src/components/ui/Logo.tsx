import Link from "next/link";

interface LogoProps {
  variant?: "light" | "dark" | "footer";
  className?: string;
}

export default function Logo({ variant = "dark", className = "" }: LogoProps) {
  const imageVar =
    variant === "footer"
      ? "var(--brand-logo-footer-url)"
      : variant === "light"
        ? "var(--brand-logo-light-url)"
        : "var(--brand-logo-url)";
  const imageSize = variant === "footer" ? "h-11 w-[194px]" : "h-8 w-[190px]";

  return (
    <Link
      href="/"
      className={`inline-flex items-center ${variant === "light" ? "rounded-lg bg-white px-2 py-1" : ""} ${className}`}
      aria-label="Teman UMKM Kita"
    >
      <span
        aria-hidden="true"
        className={`block ${imageSize} bg-left bg-contain bg-no-repeat`}
        style={{ backgroundImage: imageVar }}
      />
      <span className="sr-only">Teman UMKM Kita</span>
    </Link>
  );
}
