"use client";

import type { CSSProperties, ComponentPropsWithoutRef, FC } from "react";
import { cn } from "@/lib/utils";

/** Magic UI — AnimatedShinyText. A slow highlight sweeping across a label. */
export interface AnimatedShinyTextProps extends ComponentPropsWithoutRef<"span"> {
  shimmerWidth?: number;
}

export const AnimatedShinyText: FC<AnimatedShinyTextProps> = ({
  children,
  className,
  shimmerWidth = 90,
  ...props
}) => (
  <span
    style={{ "--shiny-width": `${shimmerWidth}px` } as CSSProperties}
    className={cn(
      "mx-auto max-w-md text-white/45",
      "animate-shiny-text bg-clip-text bg-no-repeat [background-position:0_0] [background-size:var(--shiny-width)_100%] [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]",
      "bg-linear-to-r from-transparent via-white/85 via-50% to-transparent",
      className
    )}
    {...props}
  >
    {children}
  </span>
);
