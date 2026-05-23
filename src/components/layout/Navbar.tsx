"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";

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
          ? "bg-canvas/80 backdrop-blur-md border-b border-brand-dark/10 shadow-sm"
          : "bg-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-brand-dark font-black text-sm">T</span>
            </div>
            <span className="font-bold text-brand-dark text-sm leading-tight">
              Teman<br />
              <span className="text-accent">UMKM Kita</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-brand-dark/70 hover:text-brand-dark transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:block">
            <a
              href="https://wa.me/6289501925395?text=Halo%2C+saya+ingin+konsultasi+gratis"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-accent text-brand-dark font-bold text-sm px-4 py-2 rounded-full hover:bg-accent/90 transition-colors"
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
            <div className="w-5 flex flex-col gap-1">
              <span className={cn("h-0.5 bg-current transition-all", mobileOpen && "rotate-45 translate-y-1.5")} />
              <span className={cn("h-0.5 bg-current transition-all", mobileOpen && "opacity-0")} />
              <span className={cn("h-0.5 bg-current transition-all", mobileOpen && "-rotate-45 -translate-y-1.5")} />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden py-4 border-t border-brand-dark/10"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 text-sm font-medium text-brand-dark/70 hover:text-brand-dark"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://wa.me/6289501925395?text=Halo%2C+saya+ingin+konsultasi+gratis"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 block text-center bg-accent text-brand-dark font-bold text-sm px-4 py-2 rounded-full"
            >
              Konsultasi Gratis
            </a>
          </motion.div>
        )}
      </nav>
    </motion.header>
  );
}
