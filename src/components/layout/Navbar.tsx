"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Globe, MapPin, Share2, Wrench, PenLine, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "@/components/ui/Logo";

const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Tentang Kami", href: "/tentang-kami" },
  { label: "Artikel", href: "/blog" },
  { label: "Kontak", href: "/kontak" },
];

const layananLinks = [
  { label: "Semua Layanan", href: "/layanan", icon: Globe },
  { label: "Web Development", href: "/layanan/web-development", icon: Globe },
  { label: "Web Development (Bulanan)", href: "/layanan/web-development-bulanan", icon: Globe },
  { label: "SEO & Google Maps", href: "/layanan/seo-google-maps", icon: MapPin },
  { label: "Maintenance Website", href: "/layanan/maintenance", icon: Wrench },
  { label: "Kelola Sosial Media", href: "/layanan/kelola-sosial-media", icon: Share2 },
  { label: "Desain Logo", href: "/layanan/desain-logo", icon: PenLine },
];

const DARK_HERO_PAGES: string[] = [];

export default function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [layananOpen, setLayananOpen] = useState(false);
  const [layananMobileOpen, setLayananMobileOpen] = useState(false);
  const lastScrollY = useRef(0);
  const layananRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const pathname = usePathname();

  const isDarkHero = DARK_HERO_PAGES.includes(pathname) && !scrolled;

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
    if (latest > lastScrollY.current && latest > 80) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    lastScrollY.current = latest;
  });


  const linkColor = isDarkHero
    ? "text-white/60 hover:text-white"
    : "text-brand-dark/60 hover:text-brand-dark";

  const activeLinkColor = isDarkHero ? "text-white" : "text-brand-dark";

  return (
    <motion.header
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-canvas/90 backdrop-blur-md border-b border-brand-dark/8 shadow-sm"
          : "bg-canvas/60 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none md:border-transparent md:shadow-none"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo variant="secondary" color={isDarkHero ? "white" : "yellow"} />

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {/* Beranda */}
            {navLinks.slice(0, 1).map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "nav-link-hover px-3 py-2 text-sm font-medium rounded-lg transition-colors relative",
                    active ? activeLinkColor : linkColor
                  )}
                >
                  {link.label}
                  {active && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-sm"
                    />
                  )}
                </Link>
              );
            })}

            {/* Layanan dropdown */}
            <div
              ref={layananRef}
              className="relative"
              onMouseEnter={() => setLayananOpen(true)}
              onMouseLeave={() => setLayananOpen(false)}
              onFocus={() => setLayananOpen(true)}
            >
              <Link
                href="/layanan"
                onClick={() => setLayananOpen(false)}
                className={cn(
                  "nav-link-hover px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1 relative",
                  pathname.startsWith("/layanan") ? activeLinkColor : linkColor
                )}
              >
                Layanan
                <ChevronDown
                  size={14}
                  className={cn("transition-transform duration-200", layananOpen && "rotate-180")}
                />
                {pathname.startsWith("/layanan") && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-sm"
                  />
                )}
              </Link>

              <AnimatePresence>
                {layananOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 bg-white border border-brand-dark/10 rounded-lg shadow-lg p-2 min-w-[220px] z-50"
                  >
                    {layananLinks.map((item) => {
                      const Icon = item.icon;
                      const active = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setLayananOpen(false)}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                            active
                              ? "bg-accent/10 text-brand-dark"
                              : "text-brand-dark/60 hover:text-brand-dark hover:bg-accent/8"
                          )}
                        >
                          <Icon size={15} className={active ? "text-accent" : "text-brand-dark/40"} />
                          {item.label}
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Rest of nav links */}
            {navLinks.slice(1).map((link) => {
              const active = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "nav-link-hover px-3 py-2 text-sm font-medium rounded-lg transition-colors relative",
                    active ? activeLinkColor : linkColor
                  )}
                >
                  {link.label}
                  {active && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-sm"
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
              className="bg-accent text-white font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-accent/90 hover:shadow-md transition-all duration-200"
            >
              Konsultasi Gratis
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className={cn("md:hidden p-2", isDarkHero ? "text-white" : "text-brand-dark")}
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

      </nav>

      {/* Mobile menu — outside nav so bg covers full viewport width */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-canvas border-t border-brand-dark/8"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-1">
              {navLinks.slice(0, 1).map((link) => (
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

              {/* Mobile Layanan dropdown */}
              <div>
                <button
                  onClick={() => setLayananMobileOpen(!layananMobileOpen)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    pathname.startsWith("/layanan")
                      ? "bg-accent/10 text-brand-dark"
                      : "text-brand-dark/60 hover:text-brand-dark hover:bg-brand-dark/5"
                  )}
                >
                  Layanan
                  <ChevronDown
                    size={14}
                    className={cn("transition-transform duration-200", layananMobileOpen && "rotate-180")}
                  />
                </button>
                {layananMobileOpen && (
                  <div className="pl-4 mt-1 space-y-0.5">
                    {layananLinks.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-brand-dark/60 hover:text-brand-dark hover:bg-brand-dark/5 transition-colors"
                          onClick={() => { setMobileOpen(false); setLayananMobileOpen(false); }}
                        >
                          <Icon size={14} className="text-brand-dark/30" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {navLinks.slice(1).map((link) => (
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
                  className="block text-center bg-accent text-white font-bold text-sm px-4 py-3 rounded-lg"
                >
                  Konsultasi Gratis
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
