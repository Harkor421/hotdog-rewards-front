"use client";

import { useCallback, useEffect, useRef } from "react";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import { cn } from "@/lib/utils";

/** Magic UI — MagicCard. A spotlight that follows the cursor across a panel. */
export function MagicCard({
  children,
  className,
  gradientSize = 220,
  gradientColor = "#1a1a22",
  gradientOpacity = 0.85,
  gradientFrom = "#f7b500",
  gradientTo = "#e31837",
}: {
  children?: React.ReactNode;
  className?: string;
  gradientSize?: number;
  gradientColor?: string;
  gradientOpacity?: number;
  gradientFrom?: string;
  gradientTo?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(-gradientSize * 10);
  const mouseY = useMotionValue(-gradientSize * 10);

  const onMove = useCallback(
    (e: MouseEvent) => {
      const rect = cardRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    [mouseX, mouseY]
  );

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const leave = () => {
      mouseX.set(-gradientSize * 10);
      mouseY.set(-gradientSize * 10);
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", leave);
    };
  }, [onMove, mouseX, mouseY, gradientSize]);

  return (
    <div ref={cardRef} className={cn("group relative rounded-2xl", className)}>
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px, ${gradientFrom}, ${gradientTo}, var(--line) 100%)`,
        }}
      />
      <div className="absolute inset-px rounded-[inherit] bg-[var(--panel)]" />
      <motion.div
        className="pointer-events-none absolute inset-px rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px, ${gradientColor}, transparent 100%)`,
          opacity: gradientOpacity,
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
