"use client";

import { BorderBeam } from "@/components/magicui/border-beam";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { num, usd } from "@/lib/format";
import type { CostcoState } from "@/lib/useCostco";
import { Panel, Pill, Section } from "./ui";

/**
 * The four numbers the page exists to publish.
 *
 * The source label under them is not decoration. Without a database attached
 * the backend counts only what it has seen since it last booted, and a total
 * that quietly reset on a deploy would be the page lying about the one thing
 * anybody came here to check.
 */
export function Counter({ s }: { s: CostcoState }) {
  const st = s.stats;
  const sinceBoot = st?.source === "since-boot";

  const cards = [
    {
      label: `${s.brand.itemPlural} served`,
      value: st?.hotDogs ?? 0,
      decimals: (st?.hotDogs ?? 0) % 1 === 0 ? 0 : 2,
      accent: "text-[var(--mustard)]",
      foot: `at ${usd(s.hotDogUsd)} each`,
      hero: true,
    },
    {
      label: "people fed",
      value: st?.people ?? 0,
      decimals: 0,
      accent: "text-white",
      foot: "distinct wallets paid",
    },
    {
      label: "rounds served",
      value: st?.rounds ?? 0,
      decimals: 0,
      accent: "text-white",
      foot: `one every ${Math.round(s.roundMs / 60000)} minutes`,
    },
    {
      label: "handed out",
      value: st?.usd ?? 0,
      decimals: 2,
      accent: "text-white",
      foot: "total, in dollars",
      prefix: "$",
    },
  ];

  return (
    <Section id="counter" className="pt-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Panel
            key={c.label}
            className={`relative overflow-hidden p-5 ${c.hero ? "sm:col-span-2 lg:col-span-1" : ""}`}
          >
            {c.hero && <BorderBeam size={70} duration={7} borderWidth={1.4} />}
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted-2">{c.label}</p>
            <p className={`mt-2.5 text-[34px] font-semibold leading-none tracking-[-0.035em] ${c.accent}`}>
              <NumberTicker value={c.value} decimalPlaces={c.decimals} prefix={c.prefix} />
            </p>
            <p className="mt-2 text-[12.5px] text-muted-2">{c.foot}</p>
          </Panel>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-[12.5px] text-muted-2">
        {sinceBoot ? (
          <>
            <Pill tone="warn">since the server last restarted</Pill>
            <span>
              No receipt book attached, so these are this process&rsquo;s own tally rather than an
              all-time total.
            </span>
          </>
        ) : (
          <>
            <Pill tone="live">all time</Pill>
            <span>Every figure here is a sum over the receipt book — one row per transfer.</span>
          </>
        )}
        {s.service?.capped && (
          <Pill tone="warn">
            queue cut to the largest {num(s.service.maxRecipients)} · {num(s.service.queued)} qualify
          </Pill>
        )}
      </div>
    </Section>
  );
}
