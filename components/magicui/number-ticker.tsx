"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Magic UI — NumberTicker.
 *
 * Springs to the value instead of jumping to it. Two changes from the stock
 * component, both because this page counts money in public:
 *
 *  · it re-animates when `value` CHANGES, not only when it scrolls into view.
 *    A counter that ticks up the moment a round lands is the whole point.
 *  · `decimalPlaces` is fixed rather than adaptive, so a figure never changes
 *    width mid-count and shove the layout sideways.
 */
export function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  decimalPlaces = 0,
  className,
  prefix,
  suffix,
}: {
  value: number;
  direction?: "up" | "down";
  delay?: number;
  decimalPlaces?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "down" ? value : 0);
  const spring = useSpring(motionValue, { damping: 60, stiffness: 90 });
  const inView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => motionValue.set(direction === "down" ? 0 : value), delay * 1000);
    return () => clearTimeout(t);
  }, [motionValue, inView, delay, value, direction]);

  useEffect(
    () =>
      spring.on("change", (latest: number) => {
        if (!ref.current) return;
        ref.current.textContent =
          (prefix ?? "") +
          Intl.NumberFormat("en-US", {
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: decimalPlaces,
          }).format(Number(latest.toFixed(decimalPlaces))) +
          (suffix ?? "");
      }),
    [spring, decimalPlaces, prefix, suffix]
  );

  return (
    <span
      ref={ref}
      className={cn("inline-block tnum tracking-tight", className)}
      // Rendered once on the server so the figure is in the HTML for anyone
      // who never runs the script, and so the box is the right width on paint.
    >
      {(prefix ?? "") +
        Intl.NumberFormat("en-US", {
          minimumFractionDigits: decimalPlaces,
          maximumFractionDigits: decimalPlaces,
        }).format(0) +
        (suffix ?? "")}
    </span>
  );
}
