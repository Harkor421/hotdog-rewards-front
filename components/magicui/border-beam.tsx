"use client";

import { motion, type MotionStyle, type Transition } from "motion/react";
import { cn } from "@/lib/utils";

/** Magic UI — BorderBeam. A light running the perimeter of a card. */
export function BorderBeam({
  className,
  size = 60,
  delay = 0,
  duration = 6,
  colorFrom = "#f7b500",
  colorTo = "#e31837",
  transition,
  style,
  reverse = false,
  initialOffset = 0,
  borderWidth = 1,
}: {
  className?: string;
  size?: number;
  delay?: number;
  duration?: number;
  colorFrom?: string;
  colorTo?: string;
  transition?: Transition;
  style?: MotionStyle;
  reverse?: boolean;
  initialOffset?: number;
  borderWidth?: number;
}) {
  return (
    <div
      className="pointer-events-none absolute inset-0 rounded-[inherit] border-[calc(var(--border-beam-width)*1px)] [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]"
      style={{ "--border-beam-width": borderWidth } as React.CSSProperties}
    >
      <motion.div
        className={cn(
          "absolute aspect-square",
          "bg-gradient-to-l from-[var(--color-from)] via-[var(--color-to)] to-transparent",
          className
        )}
        style={
          {
            width: size,
            offsetPath: `rect(0 auto auto 0 round ${size}px)`,
            "--color-from": colorFrom,
            "--color-to": colorTo,
            ...style,
          } as MotionStyle
        }
        initial={{ offsetDistance: `${initialOffset}%` }}
        animate={{ offsetDistance: reverse ? [`${100 - initialOffset}%`, `${-initialOffset}%`] : [`${initialOffset}%`, `${100 + initialOffset}%`] }}
        transition={{ repeat: Infinity, ease: "linear", duration, delay: -delay, ...transition }}
      />
    </div>
  );
}
