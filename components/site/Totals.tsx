"use client";

import { NumberTicker } from "@/components/magicui/number-ticker";
import { num, usd } from "@/lib/format";
import type { LiveState } from "@/lib/live";
import { Section } from "./ui";

/** Three numbers: what has gone out, who got it, and what is left to give. */
export function Totals({ s }: { s: LiveState }) {
  const st = s.stats;
  const dogs = st?.hotDogs ?? 0;
  const pot = s.pot;

  return (
    <Section className="py-12 sm:py-16">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Tile
          label={`${s.brand.itemPlural} handed out`}
          value={dogs}
          decimals={dogs % 1 === 0 ? 0 : 2}
          color="var(--red)"
          foot={`${usd(s.hotDogUsd)} each`}
        />

        <Tile
          label="people fed"
          value={st?.people ?? 0}
          color="var(--blue)"
          foot="wallets that have been paid"
        />

        <Pot s={s} pot={pot} />
      </div>
    </Section>
  );
}

/**
 * The treasury.
 *
 * The balance alone flatters: $40 sounds like a working till and pays eight
 * cents a head across a queue of eighteen. So the balance is the headline and
 * the RUNWAY is the line under it, because how many more rounds it can cover is
 * the number that actually says whether holding the coin is worth anything.
 */
function Pot({ s, pot }: { s: LiveState; pot: LiveState["pot"] }) {
  if (!pot?.ready) {
    return (
      <div className="card rounded-2xl px-7 py-8 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-2">in the pot</p>
        <p className="mt-3 text-[56px] font-extrabold leading-none tracking-[-0.045em] text-muted-2">
          &mdash;
        </p>
        {/* "unset" and "empty" are very different things and must never look the same */}
        <p className="mt-3 text-[13px] text-muted">
          {pot?.reason ?? "treasury not connected yet"}
        </p>
      </div>
    );
  }

  const left = pot.roundsLeft;
  const foot =
    left != null && left > 0
      ? `${num(left)} full ${left === 1 ? "round" : "rounds"} left`
      : pot.eth != null
        ? `${pot.eth.toFixed(4)} ETH`
        : "";

  return (
    <div className="card rounded-2xl px-7 py-8 text-center sm:col-span-2 lg:col-span-1">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-2">in the pot</p>
      <p className="mt-3 text-[56px] font-extrabold leading-none tracking-[-0.045em] text-[var(--blue-deep)]">
        <NumberTicker value={pot.usd ?? 0} decimalPlaces={2} prefix="$" />
      </p>
      <p className="mt-3 text-[13px] text-muted">{foot}</p>
    </div>
  );
}

function Tile({
  label, value, decimals = 0, color, foot,
}: {
  label: string;
  value: number;
  decimals?: number;
  color: string;
  foot: string;
}) {
  return (
    <div className="card rounded-2xl px-7 py-8 text-center">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-2">{label}</p>
      <p
        className="mt-3 text-[56px] font-extrabold leading-none tracking-[-0.045em]"
        style={{ color }}
      >
        <NumberTicker value={value} decimalPlaces={decimals} />
      </p>
      <p className="mt-3 text-[13px] text-muted">{foot}</p>
    </div>
  );
}
