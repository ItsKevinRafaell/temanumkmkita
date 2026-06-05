"use client";

import { useEffect, useRef } from "react";

interface Dot {
  x: number;
  y: number;
  baseOpacity: number;
  phase: number;
  speed: number;
}

const SPACING = 72;
const BASE_COLOR = "36,36,35";

export default function AnimatedDots() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dots: Dot[] = [];
    let isRunning = true;

    function buildDots() {
      if (!canvas) return;
      dots = [];
      const cols = Math.ceil(canvas.width / SPACING) + 1;
      const rows = Math.ceil(canvas.height / SPACING) + 1;
      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          dots.push({
            x: c * SPACING,
            y: r * SPACING,
            baseOpacity: 0.05 + Math.random() * 0.04,
            phase: Math.random() * Math.PI * 2,
            speed: 0.3 + Math.random() * 0.7,
          });
        }
      }
    }

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      buildDots();
    }

    function draw(t: number) {
      if (!canvas || !ctx) return;
      if (!isRunning) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const dot of dots) {
        const breathe = Math.sin(t * 0.001 * dot.speed + dot.phase) * 0.5 + 0.5;
        const alpha = dot.baseOpacity * (0.5 + breathe * 0.5);

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${BASE_COLOR},${alpha.toFixed(3)})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    function handleVisibility() {
      isRunning = !document.hidden;
    }

    resize();
    document.addEventListener("visibilitychange", handleVisibility);
    rafRef.current = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
