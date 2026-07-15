"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronDown } from "lucide-react";

interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

interface TableOfContentsProps {
  headings: Heading[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const onScroll = useCallback(() => {
    const scrollY = window.scrollY + 120;
    let current = "";
    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el && el.offsetTop <= scrollY) current = h.id;
    }
    setActiveId(current);
  }, [headings]);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  if (headings.length === 0) return null;

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top, behavior: "smooth" });
    setMobileOpen(false);
  }

  return (
    <div className="border-brand-dark/8 card-shadow overflow-hidden rounded-lg border bg-white">
      {/* Header — always visible */}
      <button
        onClick={() => setMobileOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4 lg:pointer-events-none"
      >
        <span className="text-xs font-bold uppercase tracking-wider text-brand-dark/70">
          Daftar Isi
        </span>
        <ChevronDown
          size={14}
          className={`text-brand-dark/40 transition-transform lg:hidden ${mobileOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Items */}
      <div className={`${mobileOpen ? "block" : "hidden"} px-3 pb-4 lg:block`}>
        <ul className="space-y-0.5">
          {headings.map((h) => {
            const isActive = activeId === h.id;
            return (
              <li key={h.id}>
                <button
                  onClick={() => scrollTo(h.id)}
                  className={`w-full rounded-xl px-3 py-2 text-left text-sm leading-snug transition-all duration-150 ${
                    h.level === 3 ? "pl-6" : ""
                  } ${
                    isActive
                      ? "bg-accent/10 font-semibold text-accent"
                      : "hover:bg-brand-dark/4 text-brand-dark/75 hover:text-brand-dark"
                  }`}
                >
                  {isActive && (
                    <span className="-mt-0.5 mr-2 inline-block h-1.5 w-1.5 rounded-sm bg-accent align-middle" />
                  )}
                  {h.text}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
