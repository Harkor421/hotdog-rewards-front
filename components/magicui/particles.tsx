"use client";

import { useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Circle = {
  x: number; y: number; translateX: number; translateY: number;
  size: number; alpha: number; targetAlpha: number; dx: number; dy: number; magnetism: number;
};

/**
 * Magic UI — Particles. Warm dust drifting in the light over the counter.
 * Redraws on a rAF loop and is DPR-aware, so it stays crisp on a retina panel.
 */
export function Particles({
  className,
  quantity = 60,
  staticity = 50,
  ease = 50,
  size = 0.5,
  color = "#f7b500",
  vx = 0,
  vy = 0,
}: {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  size?: number;
  color?: string;
  vx?: number;
  vy?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);
  const circles = useRef<Circle[]>([]);
  const mouse = useRef({ x: 0, y: 0 });
  const canvasSize = useRef({ w: 0, h: 0 });
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;

  const rgb = hexToRgb(color);

  const resize = useCallback(() => {
    if (!containerRef.current || !canvasRef.current || !ctx.current) return;
    const { offsetWidth: w, offsetHeight: h } = containerRef.current;
    canvasSize.current = { w, h };
    canvasRef.current.width = w * dpr;
    canvasRef.current.height = h * dpr;
    canvasRef.current.style.width = `${w}px`;
    canvasRef.current.style.height = `${h}px`;
    ctx.current.scale(dpr, dpr);
    circles.current = [];
    for (let i = 0; i < quantity; i++) circles.current.push(newCircle(w, h, size));
  }, [dpr, quantity, size]);

  useEffect(() => {
    if (canvasRef.current) ctx.current = canvasRef.current.getContext("2d");
    resize();

    let raf = 0;
    const animate = () => {
      const c = ctx.current;
      const { w, h } = canvasSize.current;
      if (!c) return;
      c.clearRect(0, 0, w, h);
      circles.current.forEach((circle, i) => {
        // fade in at spawn, and out as it approaches an edge
        const edge = [
          circle.x + circle.translateX - circle.size,
          w - circle.x - circle.translateX - circle.size,
          circle.y + circle.translateY - circle.size,
          h - circle.y - circle.translateY - circle.size,
        ];
        const closest = Math.min(...edge);
        const remap = Number((closest / 20).toFixed(2));
        circle.alpha = remap > 1 ? Math.min(circle.alpha + 0.02, circle.targetAlpha) : circle.targetAlpha * Math.max(remap, 0);

        circle.x += circle.dx + vx;
        circle.y += circle.dy + vy;
        circle.translateX += (mouse.current.x / (staticity / circle.magnetism) - circle.translateX) / ease;
        circle.translateY += (mouse.current.y / (staticity / circle.magnetism) - circle.translateY) / ease;

        c.translate(circle.translateX, circle.translateY);
        c.beginPath();
        c.arc(circle.x, circle.y, circle.size, 0, 2 * Math.PI);
        c.fillStyle = `rgba(${rgb.join(", ")}, ${circle.alpha})`;
        c.fill();
        c.setTransform(dpr, 0, 0, dpr, 0, 0);

        if (
          circle.x < -circle.size || circle.x > w + circle.size ||
          circle.y < -circle.size || circle.y > h + circle.size
        ) {
          circles.current[i] = newCircle(w, h, size);
        }
      });
      raf = requestAnimationFrame(animate);
    };
    animate();

    const onMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const { w, h } = canvasSize.current;
      const x = e.clientX - rect.left - w / 2;
      const y = e.clientY - rect.top - h / 2;
      if (Math.abs(x) < w / 2 && Math.abs(y) < h / 2) mouse.current = { x, y };
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, [resize, dpr, ease, staticity, size, vx, vy, rgb]);

  return (
    <div ref={containerRef} className={cn("pointer-events-none", className)} aria-hidden>
      <canvas ref={canvasRef} className="size-full" />
    </div>
  );
}

function newCircle(w: number, h: number, size: number): Circle {
  return {
    x: Math.floor(Math.random() * w),
    y: Math.floor(Math.random() * h),
    translateX: 0,
    translateY: 0,
    size: Math.floor(Math.random() * 2) + size,
    alpha: 0,
    targetAlpha: Number((Math.random() * 0.5 + 0.12).toFixed(2)),
    dx: (Math.random() - 0.5) * 0.12,
    dy: (Math.random() - 0.5) * 0.12,
    magnetism: 0.1 + Math.random() * 4,
  };
}

function hexToRgb(hex: string): number[] {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const int = parseInt(full, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}
