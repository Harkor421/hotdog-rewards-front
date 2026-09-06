"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { HotDogStage } from "@/components/hotdog/HotDogStage";
import { countdown, every, short, usd } from "@/lib/format";
import type { LiveState } from "@/lib/live";
import { Dot, Pill, Section } from "./ui";

export function Hero({ s }: { s: LiveState }) {
  const serving = !!s.serving;

  return (
    <Section id="top" className="pb-4 pt-12 text-center sm:pt-16">
      <h1 className="mx-auto max-w-3xl text-balance text-[38px] font-extrabold leading-[1.04] tracking-[-0.035em] sm:text-[62px]">
        Every {every(s.roundMs, true)},
        <br />
        <span className="text-[var(--red)]">a hot dog.</span>
      </h1>

      <p className="mx-auto mt-5 max-w-xl text-pretty text-[16px] leading-relaxed text-muted sm:text-[18px]">
        Hold <span className="font-semibold text-[var(--blue)]">${s.brand.coin}</span> and we send you{" "}
        <span className="font-semibold text-[var(--foreground)]">{usd(s.hotDogUsd)}</span> every{" "}
        {every(s.roundMs)} — what a Costco hot dog costs.
      </p>

      <div className="relative mt-2 h-[280px] w-full sm:h-[360px] lg:h-[420px]">
        <HotDogStage bell={s.bell} className="absolute inset-0" />
      </div>

      <div className="mx-auto -mt-2 w-full max-w-xs">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-2">
          {serving ? "serving now" : "next hot dog in"}
        </p>
        <p
          className="mt-1.5 text-[56px] font-extrabold leading-none tracking-[-0.045em] tnum text-[var(--blue)] sm:text-[68px]"
          aria-live="polite"
          aria-atomic="true"
        >
          {serving ? <span className="text-[var(--red)]">now</span> : countdown(s.msLeft, s.roundMs)}
        </p>
      </div>

      <Contract s={s} />
    </Section>
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
    <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
      {token ? (
        <button
          onClick={() => navigator.clipboard?.writeText(token).then(() => setCopied(true)).catch(() => {})}
          className="group inline-flex items-center gap-2.5 rounded-full border border-[var(--line)] bg-white py-2 pl-3.5 pr-3 font-mono text-[12.5px] text-muted shadow-[0_1px_2px_rgba(14,18,25,0.04)] transition-colors hover:border-[var(--blue)] hover:text-[var(--foreground)]"
          title="Copy the contract address"
        >
          <Dot tone="live" />
          <span className="hidden sm:inline">{token}</span>
          <span className="sm:hidden">{short(token, 10, 8)}</span>
          {copied ? (
            <Check className="size-3.5 text-emerald-600" />
          ) : (
            <Copy className="size-3.5 text-muted-2 transition-colors group-hover:text-[var(--blue)]" />
          )}
        </button>
      ) : (
        <Pill tone="warn">contract not published yet</Pill>
      )}
      {s.service?.demo && <Pill tone="warn">demo — no real coin configured</Pill>}
      {s.service?.dryRun && !s.service?.demo && <Pill tone="warn">dry run — nothing has moved</Pill>}
    </div>
  );
}
