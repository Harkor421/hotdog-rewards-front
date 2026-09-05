"use client";

import { ago, dogs, num, pct, short, usd } from "@/lib/format";
import type { CostcoState } from "@/lib/useCostco";
import { Addr, Panel, Pill, Section } from "./ui";

export function Leaderboard({ s }: { s: CostcoState }) {
  const rows = s.leaderboard;
  const explorer = s.service?.explorer;

  return (
    <Section
      id="eaters"
      eyebrow="who ate"
      title={`Most ${s.brand.itemPlural} eaten`}
      lead="Every wallet that has ever been paid, and how much of it. Ranked by hot dogs, which is the same as ranked by dollars, because a hot dog is a dollar."
    >
      <Panel className="overflow-hidden">
        {rows.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <p className="text-[14px] text-muted">Nobody has eaten yet.</p>
            <p className="mx-auto mt-2 max-w-md text-[12.5px] leading-relaxed text-muted-2">
              This table reads the receipt book. With no database attached the backend keeps no
              per-wallet history, so it stays empty by design rather than inventing a ranking.
            </p>
          </div>
        ) : (
          <div className="scroll-thin overflow-x-auto">
            <table className="w-full min-w-[620px] text-[13px]">
              <thead>
                <tr className="border-b border-[var(--line)] text-left text-[11px] uppercase tracking-[0.14em] text-muted-2">
                  <th className="px-5 py-3 font-medium">#</th>
                  <th className="px-3 py-3 font-medium">wallet</th>
                  <th className="px-3 py-3 text-right font-medium">{s.brand.itemPlural}</th>
                  <th className="px-3 py-3 text-right font-medium">total</th>
                  <th className="px-3 py-3 text-right font-medium">rounds</th>
                  <th className="px-3 py-3 text-right font-medium">holds</th>
                  <th className="px-5 py-3 text-right font-medium">last fed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {rows.map((r) => (
                  <tr key={r.address} className="transition-colors hover:bg-white/[0.02]">
                    <td className="px-5 py-2.5 tnum text-muted-2">{r.rank}</td>
                    <td className="px-3 py-2.5">
                      <Addr
                        address={short(r.address, 10, 6)}
                        href={explorer ? `${explorer}/address/${r.address}` : undefined}
                        className="text-white/85"
                      />
                    </td>
                    <td className="px-3 py-2.5 text-right tnum font-medium text-[var(--mustard)]">
                      {dogs(r.hotDogs)}
                    </td>
                    <td className="px-3 py-2.5 text-right tnum">{usd(r.totalUsd)}</td>
                    <td className="px-3 py-2.5 text-right tnum text-muted">{num(r.meals)}</td>
                    <td className="px-3 py-2.5 text-right tnum text-muted">{pct(r.lastHeldPct, 2)}</td>
                    <td className="px-5 py-2.5 text-right text-muted-2">{ago(r.lastAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </Section>
  );
}

export function Rounds({ s }: { s: CostcoState }) {
  const rows = s.rounds;

  return (
    <Section
      id="rounds"
      eyebrow="every round"
      title="Including the ones that fed nobody"
      lead="A round is a fact whether or not money moved. The ones that refused are here too, with the reason they refused — so an empty history can only ever mean nobody has been fed."
    >
      <Panel className="overflow-hidden">
        {rows.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <p className="text-[14px] text-muted">No rounds on record.</p>
            <p className="mx-auto mt-2 max-w-md text-[12.5px] leading-relaxed text-muted-2">
              Rounds are written to the receipt book as they happen. Without one attached, the bell
              still rings — it just leaves no trace here.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-[var(--line)]">
            {rows.map((r) => (
              <li key={r.roundId} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3.5">
                <span className="w-16 shrink-0 tnum text-[13px] text-muted">{r.label ?? "—"}</span>

                {r.paid ? (
                  <>
                    <span className="text-[13.5px]">
                      fed <span className="font-medium">{num(r.served)}</span>
                      {r.served === 1 ? " wallet" : " wallets"}
                    </span>
                    <span className="text-[13px] text-muted">
                      {dogs(r.hotDogs)} {s.brand.itemPlural} · {usd(r.totalUsd)}
                    </span>
                    {r.shortfall && <Pill tone="warn">short — everybody got less</Pill>}
                    {r.dryRun && <Pill tone="neutral">dry run</Pill>}
                    {r.demo && <Pill tone="warn">demo</Pill>}
                  </>
                ) : (
                  <>
                    <Pill tone="bad">fed nobody</Pill>
                    <span className="min-w-0 flex-1 truncate text-[13px] text-muted" title={r.reason ?? ""}>
                      {r.reason ?? "no reason recorded"}
                    </span>
                  </>
                )}

                <span className="ml-auto shrink-0 text-[12px] text-muted-2">{ago(r.ts)}</span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </Section>
  );
}
