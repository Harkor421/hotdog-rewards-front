"use client";

import { cn } from "@/lib/utils";

export function Section({ id, children, className }: { id?: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={cn("mx-auto w-full max-w-5xl px-5 sm:px-8", className)}>
      {children}
    </section>
  );
}

export function Pill({
  tone = "neutral", children, className,
}: {
  tone?: "neutral" | "live" | "warn";
  children: React.ReactNode;
  className?: string;
}) {
  const tones = {
    neutral: "border-[var(--line)] bg-[var(--surface)] text-muted",
    live: "border-emerald-600/25 bg-emerald-50 text-emerald-700",
    warn: "border-amber-500/30 bg-amber-50 text-amber-800",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold leading-none",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function Dot({ tone = "live" }: { tone?: "live" | "warn" | "off" }) {
  const c = { live: "bg-emerald-500", warn: "bg-amber-500", off: "bg-[var(--line-strong)]" }[tone];
  return (
    <span className="relative flex size-1.5">
      {tone !== "off" && <span className={cn("absolute inline-flex size-full animate-ping rounded-full opacity-70", c)} />}
      <span className={cn("relative inline-flex size-1.5 rounded-full", c)} />
    </span>
  );
}

export function Addr({ address, href, className }: { address: string; href?: string; className?: string }) {
  const body = <span className={cn("font-mono text-[12.5px] tracking-tight", className)}>{address}</span>;
  if (!href) return body;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="text-[var(--blue)] underline decoration-[var(--blue)]/25 underline-offset-4 transition-colors hover:decoration-[var(--blue)]"
    >
      {body}
    </a>
  );
}
