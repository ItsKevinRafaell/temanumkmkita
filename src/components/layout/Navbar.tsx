"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";
import Logo from "@/components/ui/Logo";

const navLinks = [
  { label: "Layanan", href: "/layanan" },
  { label: "Portofolio", href: "/portofolio" },
  { label: "Tentang Kami", href: "/tentang-kami" },
  { label: "Blog", href: "/blog" },
  { label: "Kontak", href: "/kontak" },
];

export default function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastScrollY = useRef(0);
  const { scrollY } = useScroll();
  const pathname = usePathname();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
    if (latest > lastScrollY.current && latest > 80) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    lastScrollY.current = latest;
  });

  return (
    <motion.header
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-canvas/85 backdrop-blur-md border-b border-brand-dark/8 shadow-sm"
          : "bg-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo />

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "nav-link-hover px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    active
                      ? "text-brand-dark"
                      : "text-brand-dark/60 hover:text-brand-dark"
                  )}
                >
                  {link.label}
                  {active && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* CTA */}
          <div className="hidden md:block">
            <a
              href="https://wa.me/6289501925395?text=Halo%2C+saya+ingin+konsultasi+gratis"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-accent text-white font-bold text-sm px-5 py-2.5 rounded-full hover:bg-accent/90 hover:shadow-md transition-all duration-200"
            >
              Konsultasi Gratis
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-brand-dark"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-5 flex flex-col gap-1.5">
              <span className={cn("h-0.5 bg-current transition-all duration-200", mobileOpen && "rotate-45 translate-y-2")} />
              <span className={cn("h-0.5 bg-current transition-all duration-200", mobileOpen && "opacity-0")} />
              <span className={cn("h-0.5 bg-current transition-all duration-200", mobileOpen && "-rotate-45 -translate-y-2")} />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden py-4 border-t border-brand-dark/8 space-y-1"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-accent/10 text-brand-dark"
                    : "text-brand-dark/60 hover:text-brand-dark hover:bg-brand-dark/5"
                )}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2">
              <a
                href="https://wa.me/6289501925395?text=Halo%2C+saya+ingin+konsultasi+gratis"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center bg-accent text-white font-bold text-sm px-4 py-3 rounded-full"
              >
                Konsultasi Gratis
              </a>
            </div>
          </motion.div>
        )}
      </nav>
    </motion.header>
  );
}
