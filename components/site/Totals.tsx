"use client";

import { NumberTicker } from "@/components/magicui/number-ticker";
import { usd } from "@/lib/format";
import type { LiveState } from "@/lib/live";
import { Section } from "./ui";

/** The two numbers, and nothing else. */
export function Totals({ s }: { s: LiveState }) {
  const st = s.stats;
  const dogs = st?.hotDogs ?? 0;

  return (
    <Section className="py-12 sm:py-16">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card rounded-2xl px-7 py-8 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-2">
            {s.brand.itemPlural} handed out
          </p>
          <p className="mt-3 text-[56px] font-extrabold leading-none tracking-[-0.045em] text-[var(--red)]">
            <NumberTicker value={dogs} decimalPlaces={dogs % 1 === 0 ? 0 : 2} />
          </p>
          <p className="mt-3 text-[13px] text-muted">{usd(s.hotDogUsd)} each</p>
        </div>

        <div className="card rounded-2xl px-7 py-8 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-2">people fed</p>
          <p className="mt-3 text-[56px] font-extrabold leading-none tracking-[-0.045em] text-[var(--blue)]">
            <NumberTicker value={st?.people ?? 0} />
          </p>
          <p className="mt-3 text-[13px] text-muted">wallets that have been paid</p>
        </div>
      </div>
    </Section>
  );
}
