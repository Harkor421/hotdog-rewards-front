"use client";

import { BorderBeam } from "@/components/magicui/border-beam";
import { num, usd } from "@/lib/format";
import type { CostcoState } from "@/lib/useCostco";
import { Addr, Panel, Pill, Section } from "./ui";

/**
 * The till, and how long it lasts.
 *
 * `roundsLeft` is the number that actually decides whether holding the coin is
 * worth anything, so it is given the most weight on the page — not the balance,
 * which sounds impressive and says nothing on its own.
 */
export function Till({ s }: { s: CostcoState }) {
  const p = s.pot;
  const runway = p?.roundsLeft ?? null;
  const hours = runway != null ? (runway * s.roundMs) / 3_600_000 : null;

  return (
    <Section
      id="till"
      eyebrow="the till"
      title="What is behind the counter"
      lead="A treasury that cannot pay is a promise, not a product. Here is the balance, what the next bell costs, and how many bells are left in it."
    >
      {!p?.ready ? (
        <Panel className="p-6">
          <Pill tone="warn">no treasury wallet configured</Pill>
          <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-muted">
            {p?.reason ??
              "Nothing is connected yet, so there is no balance to show. This says “unset” rather than “$0” on purpose — an empty till and an unconfigured one are very different things, and the page should never let you confuse them."}
          </p>
        </Panel>
      ) : (
        <div className="grid gap-3 lg:grid-cols-3">
          <Panel className="relative overflow-hidden p-6 lg:col-span-1">
            <BorderBeam size={80} duration={9} borderWidth={1.4} colorFrom="#f7b500" colorTo="#e31837" />
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted-2">rounds left in it</p>
            <p className="mt-2 text-[46px] font-semibold leading-none tracking-[-0.04em] tnum text-[var(--mustard)]">
              {runway == null ? "—" : num(runway)}
            </p>
            <p className="mt-2.5 text-[13px] leading-relaxed text-muted">
              {runway == null
                ? "Not enough information to say."
                : hours != null && hours >= 1
                  ? `About ${hours < 48 ? `${hours.toFixed(0)} hours` : `${(hours / 24).toFixed(1)} days`} at today's queue length, if nothing is ever added.`
                  : "Less than an hour at today's queue length."}
            </p>
          </Panel>

          <Panel className="p-6 lg:col-span-2">
            <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
              <Stat k="balance" v={usd(p.usd)} sub={p.eth != null ? `${p.eth.toFixed(5)} ETH` : undefined} />
              <Stat
                k="the next bell costs"
                v={usd(p.nextRoundUsd)}
                sub={`${num(s.service?.queue ?? 0)} wallets × ${usd(s.hotDogUsd)}`}
              />
              <Stat
                k="the brake"
                v={usd(p.roundCapUsd)}
                sub={`at most ${p.maxRoundPct}% of the till per round`}
              />
              <Stat
                k="held back for gas"
                v={p.gasReserveEth != null ? `${p.gasReserveEth} ETH` : "—"}
                sub="never spent on food"
              />
            </dl>

            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[var(--line)] pt-4 text-[12.5px] text-muted-2">
              <span>treasury</span>
              <Addr address={p.address ?? "—"} href={p.addrUrl} className="text-white/70" />
              {p.dryRun && <Pill tone="warn">dry run — nothing has left it</Pill>}
            </div>
          </Panel>
        </div>
      )}

      <p className="mt-4 max-w-2xl text-[13px] leading-relaxed text-muted-2">
        When the bill is bigger than the brake allows, the round&rsquo;s budget is split{" "}
        <span className="text-white/70">equally</span> rather than paying the first wallets a whole
        dollar and the rest nothing. Half a hot dog each is a worse day; half the queue going hungry
        is a different product.
      </p>
    </Section>
  );
}

function Stat({ k, v, sub }: { k: string; v: string; sub?: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-[0.16em] text-muted-2">{k}</dt>
      <dd className="mt-1.5 text-[24px] font-semibold leading-none tracking-[-0.03em] tnum">{v}</dd>
      {sub && <p className="mt-1.5 text-[12.5px] text-muted-2">{sub}</p>}
    </div>
  );
}
