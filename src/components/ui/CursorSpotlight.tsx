"use client";

import { useEffect, useState } from "react";

export default function CursorSpotlight() {
  const [pos, setPos] = useState({ x: -9999, y: -9999 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      setPos({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    }
    function onLeave() {
      setVisible(false);
    }
    window.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [visible]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9997] hidden transition-opacity duration-300 md:block"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(600px circle at ${pos.x}px ${pos.y}px, rgba(245,167,0,0.12), transparent 70%)`,
        }}
      />
    </div>
  );
}
