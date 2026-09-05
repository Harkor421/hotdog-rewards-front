"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

/** Magic UI — DotPattern. The faint warehouse grid behind everything. */
export function DotPattern({
  width = 22,
  height = 22,
  cx = 1,
  cy = 1,
  cr = 1,
  className,
  ...props
}: {
  width?: number;
  height?: number;
  cx?: number;
  cy?: number;
  cr?: number;
  className?: string;
} & React.SVGProps<SVGSVGElement>) {
  const id = useId();
  return (
    <svg
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 h-full w-full fill-white/[0.14]", className)}
      {...props}
    >
      <defs>
        <pattern id={id} width={width} height={height} patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
          <circle id="pattern-circle" cx={cx} cy={cy} r={cr} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
    </svg>
  );
}
