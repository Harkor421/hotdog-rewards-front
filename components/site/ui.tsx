"use client";

import { cn } from "@/lib/utils";

export function Section({
  id, eyebrow, title, lead, children, className,
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  lead?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-24", className)}>
      {(eyebrow || title || lead) && (
        <header className="mb-10 max-w-2xl">
          {eyebrow && (
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--mustard)]">{eyebrow}</p>
          )}
          {title && <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>}
          {lead && <p className="mt-3 text-pretty text-[15px] leading-relaxed text-muted">{lead}</p>}
        </header>
      )}
      {children}
    </section>
  );
}

export function Panel({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("panel rounded-2xl", className)}>{children}</div>;
}

export function Pill({
  tone = "neutral", children, className,
}: {
  tone?: "neutral" | "live" | "warn" | "bad";
  children: React.ReactNode;
  className?: string;
}) {
  const tones = {
    neutral: "border-white/10 bg-white/[0.03] text-muted",
    live: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
    warn: "border-[var(--mustard)]/30 bg-[var(--mustard)]/10 text-[var(--mustard)]",
    bad: "border-[var(--costco-red)]/35 bg-[var(--costco-red)]/10 text-[#ff8598]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium leading-none",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function Dot({ tone = "live" }: { tone?: "live" | "warn" | "bad" | "off" }) {
  const c = {
    live: "bg-emerald-400",
    warn: "bg-[var(--mustard)]",
    bad: "bg-[var(--costco-red)]",
    off: "bg-white/25",
  }[tone];
  return (
    <span className="relative flex size-1.5">
      {tone !== "off" && <span className={cn("absolute inline-flex size-full animate-ping rounded-full opacity-60", c)} />}
      <span className={cn("relative inline-flex size-1.5 rounded-full", c)} />
    </span>
  );
}

/** A monospace address that is safe to put in a table and safe to click. */
export function Addr({ address, href, className }: { address: string; href?: string; className?: string }) {
  const body = <span className={cn("font-mono text-[12.5px] tracking-tight", className)}>{address}</span>;
  if (!href) return body;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="text-inherit underline decoration-white/15 underline-offset-4 transition-colors hover:decoration-[var(--mustard)]"
    >
      {body}
    </a>
  );
}
