"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { HotDogStage } from "@/components/hotdog/HotDogStage";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { Particles } from "@/components/magicui/particles";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { clock, num, short, usd } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { LiveState } from "@/lib/live";
import { Dot, Pill } from "./ui";

export function Hero({ s }: { s: LiveState }) {
  const progress = s.round ? 1 - s.msLeft / s.round.lengthMs : 0;
  const serving = !!s.serving;

  return (
    <div id="top" className="relative overflow-hidden">
      <DotPattern className="[mask-image:radial-gradient(650px_circle_at_50%_18%,white,transparent)] opacity-40" />
      <Particles className="absolute inset-0" quantity={70} color="#f7b500" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-5 pb-6 pt-14 text-center sm:px-8 sm:pt-20">
        <div className="mb-6 inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-1 py-1 pr-3.5 backdrop-blur">
          <span className="mr-2.5 rounded-full bg-[var(--brand-red)] px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white">
            $1.50 is a lie
          </span>
          <AnimatedShinyText className="text-[13px]">
            It has always been a dollar. Hold the coin and find out.
          </AnimatedShinyText>
        </div>

        <h1 className="max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-6xl">
          Every five minutes,
          <br />
          <span className="bg-gradient-to-b from-[#ffd97a] via-[var(--mustard)] to-[#e08a00] bg-clip-text text-transparent">
            a hot dog.
          </span>
        </h1>

        <p className="mt-5 max-w-xl text-pretty text-[15px] leading-relaxed text-muted sm:text-[16.5px]">
          The treasury pays <span className="text-white">{usd(s.hotDogUsd)}</span> to every wallet
          holding <span className="text-white">${s.brand.coin}</span> — the same dollar for
          everybody, because everybody is buying the same hot dog.
        </p>

        {/* the object itself */}
        <div className="relative mt-2 h-[340px] w-full sm:h-[440px] lg:h-[500px]">
          <div
            className={cn(
              "pointer-events-none absolute left-1/2 top-1/2 size-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-opacity duration-700 sm:size-[420px]",
              serving ? "bg-[var(--mustard)]/25 opacity-100" : "bg-[var(--brand-red)]/18 opacity-80"
            )}
          />
          <HotDogStage bell={s.bell} className="absolute inset-0" />
          <p className="pointer-events-none absolute bottom-1 left-1/2 w-full -translate-x-1/2 text-[11px] text-muted-2">
            drag to turn it over
          </p>
        </div>

        <Countdown
          msLeft={s.msLeft}
          progress={progress}
          serving={serving}
          served={s.serving?.people ?? s.service?.queue ?? 0}
        />

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <ShimmerButton className="text-[14px] font-semibold" onClick={() => scrollTo("how")}>
            How the dollar gets there
          </ShimmerButton>
          <a
            href="#counter"
            className="rounded-full border border-white/12 bg-white/[0.03] px-5 py-3 text-[14px] font-medium text-white/85 transition-colors hover:border-white/25 hover:text-white"
          >
            Watch the counter
          </a>
        </div>

        <Contract s={s} />
      </div>
    </div>
  );
}

function Countdown({
  msLeft, progress, serving, served,
}: {
  msLeft: number;
  progress: number;
  serving: boolean;
  served: number;
}) {
  return (
    <div className="mt-4 w-full max-w-md">
      <div className="flex items-baseline justify-between text-[11px] uppercase tracking-[0.18em] text-muted-2">
        <span>{serving ? "serving now" : "next hot dog in"}</span>
        <span>{num(served)} in the queue</span>
      </div>

      <div
        className="mt-2 text-[52px] font-semibold leading-none tracking-[-0.04em] tnum sm:text-[64px]"
        // aria-live so a screen reader is told the round ended, but only when
        // it does — announcing every second would be unusable.
        aria-live="polite"
        aria-atomic="true"
      >
        {serving ? (
          <span className="bg-gradient-to-b from-white to-[var(--mustard)] bg-clip-text text-transparent">
            serving
          </span>
        ) : (
          clock(msLeft)
        )}
      </div>

      <div className="mt-4 h-[3px] w-full overflow-hidden rounded-full bg-white/[0.07]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[var(--brand-red)] to-[var(--mustard)] transition-[width] duration-200 ease-linear"
          style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
        />
      </div>
    </div>
  );
}

function Contract({ s }: { s: LiveState }) {
  const [copied, setCopied] = useState(false);
  const token = s.service?.token;

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
      {token ? (
        <button
          onClick={() => {
            navigator.clipboard?.writeText(token).then(() => setCopied(true)).catch(() => {});
          }}
          className="group inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] py-2 pl-3.5 pr-3 font-mono text-[12.5px] text-white/70 transition-colors hover:border-white/25 hover:text-white"
          title="Copy the contract address"
        >
          <Dot tone="live" />
          <span className="hidden sm:inline">{token}</span>
          <span className="sm:hidden">{short(token, 10, 8)}</span>
          {copied ? (
            <Check className="size-3.5 text-emerald-400" />
          ) : (
            <Copy className="size-3.5 text-white/35 transition-colors group-hover:text-white/70" />
          )}
        </button>
      ) : (
        <Pill tone="warn">contract not published yet</Pill>
      )}

      {s.service?.demo && <Pill tone="warn">demo queue — no real coin configured</Pill>}
      {s.service?.dryRun && !s.service?.demo && <Pill tone="warn">dry run — nothing has moved</Pill>}
    </div>
  );
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}
