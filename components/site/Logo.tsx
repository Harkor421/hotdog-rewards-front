"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * The logo slot.
 *
 * Renders `public/logo.png` if that file exists, and draws a placeholder badge
 * if it does not. The fallback is a runtime `onError` rather than a build-time
 * check on purpose: the artwork gets dropped in without touching the code, and
 * the page never shows a broken-image icon while the slot is empty.
 *
 * The slot is sized by HEIGHT and lets width follow the artwork, so a round
 * badge and a wide lockup both sit correctly without being cropped or squashed.
 */
export function Logo({
  size = 40,
  maxWidth = 200,
  compact = false,
  className,
}: {
  size?: number;
  maxWidth?: number;
  compact?: boolean;
  className?: string;
}) {
  const [src, setSrc] = useState<string | null>(null);

  /**
   * Load the file first, show it second.
   *
   * The obvious version renders <img src="/logo.png" onError={fallback}> — and
   * it does not work, because the element is server-rendered: the browser tries
   * the URL and fails before React hydrates, so the error event is long gone by
   * the time an onError handler exists. What you get is the broken-image icon
   * and the alt text sitting in the nav.
   *
   * Preloading inverts it. The drawn badge is what renders until a real file is
   * known to be there, so an empty slot looks deliberate rather than broken,
   * and there is no flash of a missing image on the way.
   */
  useEffect(() => {
    const img = new window.Image();
    img.onload = () => setSrc("/logo.png");
    img.src = "/logo.png";
    return () => {
      img.onload = null;
    };
  }, []);

  if (src) {
    return (
      // next/image is deliberately not used: this file may legitimately not
      // exist, and the point of the slot is that dropping it in needs no build.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt="Hotdog Rewards"
        className={cn("block w-auto object-contain", className)}
        style={{ height: size, maxWidth }}
      />
    );
  }

  return <PlaceholderBadge size={size} compact={compact} className={className} />;
}

/**
 * What stands in until there is a logo.png.
 *
 * Drawn rather than shipped as an image so it is sharp at any size, and so the
 * name is real text. Below ~64px it drops to ring-and-dog: three lines of type
 * at 40px render as three grey smudges, which reads as a broken image rather
 * than as a logo.
 */
function PlaceholderBadge({
  size,
  compact,
  className,
}: {
  size: number;
  compact: boolean;
  className?: string;
}) {
  const small = compact || size < 64;
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Hotdog Rewards"
    >
      <circle cx="100" cy="100" r="96" fill="#fff" />
      <circle cx="100" cy="100" r="92" fill="none" stroke="var(--blue)" strokeWidth={small ? 11 : 7} />

      {!small && (
        <>
          <text
            x="100" y="50" textAnchor="middle" fill="var(--red)"
            fontFamily="var(--font-geist-sans), system-ui, sans-serif"
            fontSize="31" fontWeight="800" letterSpacing="-1.2"
          >
            HOTDOG
          </text>
          <text
            x="100" y="68" textAnchor="middle" fill="var(--blue)"
            fontFamily="var(--font-geist-sans), system-ui, sans-serif"
            fontSize="15" fontWeight="800" letterSpacing="3.4"
          >
            REWARDS
          </text>
        </>
      )}

      {/* the dog — tilted, because a level one looks like a diagram */}
      <g transform={small ? "translate(100 100) rotate(-16) scale(1.22)" : "translate(100 108) rotate(-7)"}>
        <rect x="-68" y="2" width="136" height="26" rx="13" fill="#e2a45f" />
        <rect x="-68" y="2" width="136" height="26" rx="13" fill="none" stroke="#c98c46" strokeWidth="1.5" />
        <rect x="-72" y="-13" width="144" height="24" rx="12" fill="#c0392b" />
        <rect x="-72" y="-13" width="144" height="24" rx="12" fill="none" stroke="#96291d" strokeWidth="1.5" />
        <rect x="-64" y="-30" width="128" height="24" rx="12" fill="#f0c682" />
        <rect x="-64" y="-30" width="128" height="24" rx="12" fill="none" stroke="#d8a961" strokeWidth="1.5" />
        {[-46, -28, -10, 8, 26, 44].map((x, i) => (
          <ellipse key={x} cx={x} cy={i % 2 ? -22 : -17} rx="3.4" ry="2" fill="#fff3dc" />
        ))}
        <path
          d="M-58 -2 L-44 -9 L-30 -2 L-16 -9 L-2 -2 L12 -9 L26 -2 L40 -9 L54 -2"
          fill="none" stroke="var(--mustard)" strokeWidth="6.5"
          strokeLinecap="round" strokeLinejoin="round"
        />
      </g>

      {!small && (
        <>
          <path d="M22 158 q22 -9 46 -4" fill="none" stroke="var(--red)" strokeWidth="7" strokeLinecap="round" />
          <path d="M178 158 q-22 -9 -46 -4" fill="none" stroke="var(--red)" strokeWidth="7" strokeLinecap="round" />
          <text
            x="100" y="178" textAnchor="middle" fill="var(--blue)"
            fontFamily="var(--font-geist-sans), system-ui, sans-serif"
            fontSize="34" fontWeight="800" letterSpacing="-1"
          >
            $1.50
          </text>
        </>
      )}
    </svg>
  );
}

/** The nav lockup: the logo slot, then the name as text. */
export function Wordmark({ name }: { name: string }) {
  return (
    <span className="flex items-center gap-2.5">
      <Logo size={40} maxWidth={180} />
      <span className="text-[15.5px] font-bold tracking-[-0.02em] text-[var(--blue)]">{name}</span>
    </span>
  );
}
