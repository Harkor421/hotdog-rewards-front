"use client";

import { Ban, Coins, ScanSearch, Timer } from "lucide-react";
import { MagicCard } from "@/components/magicui/magic-card";
import { num, pct, usd } from "@/lib/format";
import type { CostcoState } from "@/lib/useCostco";
import { Panel, Section } from "./ui";

export function HowItWorks({ s }: { s: CostcoState }) {
  const steps = [
    {
      icon: Timer,
      title: "The bell is the wall clock",
      body: `Rounds land on the ${Math.round(s.roundMs / 60000)}-minute mark — :00, :05, :10 — not on whenever the server happened to start. Everyone's countdown hits zero at the same instant, and a redeploy does not shift the schedule.`,
    },
    {
      icon: ScanSearch,
      title: "Who holds the coin is read off the chain",
      body: "The indexer is tried first and the chain itself second, because the explorer on this network answers servers with a Cloudflare page that looks exactly like a coin with no holders. Balances are then re-read on-chain before anyone is paid.",
    },
    {
      icon: Ban,
      title: "Pools, curves and contracts do not eat",
      body: `The bonding curve and the AMM pool hold most of a young coin's supply and neither is a person. Any contract over ${pct(0.5, 1)} of supply is dropped, and every remaining address gets an eth_getCode before it is paid.${s.service?.poolsExcluded ? ` ${num(s.service.poolsExcluded)} excluded right now.` : ""}`,
    },
    {
      icon: Coins,
      title: "Then everybody gets the same dollar",
      body: `Not a slice weighted by how rich you are — ${usd(s.hotDogUsd)} each, because that is what a hot dog costs. You have to hold at least ${pct(s.service?.minEligiblePct ?? 0.1, 2)} of supply to be in the queue.`,
    },
  ];

  return (
    <Section
      id="how"
      eyebrow="how it works"
      title="Four things happen, in this order"
      lead="The distribution machinery is Stock Royale's, carried over intact. What changed is what comes out of it: a flat dollar instead of a share of a stock."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {steps.map((st, i) => (
          <MagicCard key={st.title} className="rounded-2xl border border-[var(--line)]">
            <div className="p-6">
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-xl border border-white/10 bg-white/[0.04]">
                  <st.icon className="size-[17px] text-[var(--mustard)]" />
                </span>
                <span className="text-[11px] tnum uppercase tracking-[0.18em] text-muted-2">
                  step {i + 1}
                </span>
              </div>
              <h3 className="mt-4 text-[16.5px] font-semibold tracking-tight">{st.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{st.body}</p>
            </div>
          </MagicCard>
        ))}
      </div>

      <Panel className="mt-3 p-6">
        <h3 className="text-[15px] font-semibold tracking-tight">
          The part a flat payout gets wrong if nobody thinks about it
        </h3>
        <p className="mt-2.5 max-w-3xl text-[13.5px] leading-relaxed text-muted">
          A pro-rata split defends itself: spread your bag over a hundred wallets and you get exactly
          the slice you had, so nobody bothers. <span className="text-white/85">A flat dollar per
          wallet is the opposite — a hundred wallets is a hundred dollars.</span> The floor of{" "}
          <span className="text-white/85">{pct(s.service?.minEligiblePct ?? 0.1, 2)} of supply</span>{" "}
          is what prices that attack, and it doubles as a ceiling on the bill: at that floor only{" "}
          {num(Math.floor(100 / (s.service?.minEligiblePct || 0.1)))} wallets can ever qualify, so a
          round can never cost more than {usd(Math.floor(100 / (s.service?.minEligiblePct || 0.1)) * s.hotDogUsd)}{" "}
          no matter what happens. The server refuses to start without it.
        </p>
      </Panel>
    </Section>
  );
}
