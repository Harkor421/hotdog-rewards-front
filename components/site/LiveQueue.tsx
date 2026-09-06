"use client";

import { AnimatePresence, motion } from "motion/react";
import { ExternalLink } from "lucide-react";
import { dogs, num, pct, short, usd } from "@/lib/format";
import type { LiveState } from "@/lib/live";
import { Addr, Dot, Panel, Pill, Section } from "./ui";

/**
 * The queue, filling in as it is paid.
 *
 * Every row is a transfer that was actually broadcast, in the order it went
 * out, with a link to it. This is the part of the page that is checkable — a
 * counter can be anything, but a transaction hash either exists or it does not.
 */
export function LiveQueue({ s }: { s: LiveState }) {
  const serving = s.serving;
  const result = s.lastResult;
  const rows = s.feed;

  return (
    <Section
      id="queue"
      eyebrow="the queue"
      title="Watch it hand them out"
      lead="Each row is one transfer, streamed the instant it is broadcast. Open any of them and check it against the chain."
    >
      <div className="grid gap-3 lg:grid-cols-[1.35fr_1fr]">
        <Panel className="overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] px-5 py-3.5">
            <div className="flex items-center gap-2.5">
              <Dot tone={serving ? "live" : rows.length ? "warn" : "off"} />
              <span className="text-[13.5px] font-medium">
                {serving
                  ? `serving ${num(serving.people)} ${serving.people === 1 ? "wallet" : "wallets"}`
                  : rows.length
                    ? "last round"
                    : "waiting for the bell"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {(serving?.shortfall ?? result?.shortfall) && (
                <Pill tone="warn">the brake bit — everybody gets less</Pill>
              )}
              {(serving?.dryRun ?? result?.dryRun) && <Pill tone="warn">dry run</Pill>}
              {rows.length > 0 && <span className="text-[12px] text-muted-2">{num(rows.length)} shown</span>}
            </div>
          </div>

          <div className="scroll-thin max-h-[430px] min-h-[240px] overflow-y-auto">
            {rows.length === 0 ? (
              <Empty s={s} />
            ) : (
              <ul className="divide-y divide-[var(--line)]">
                <AnimatePresence initial={false}>
                  {rows.map((p, i) => (
                    <motion.li
                      key={`${p.to}-${p.tx ?? i}`}
                      layout
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                      className="flex items-center gap-3 px-5 py-2.5 text-[13px]"
                    >
                      <span className="w-9 shrink-0 text-[11.5px] tnum text-muted-2">
                        #{p.rank ?? i + 1}
                      </span>
                      <Addr address={short(p.to, 8, 6)} href={p.addrUrl} className="text-white/80" />
                      <span className="ml-auto shrink-0 text-[11.5px] tnum text-muted-2">
                        {pct(p.pct, 2)} of supply
                      </span>
                      <span className="w-16 shrink-0 text-right tnum font-medium text-[var(--mustard)]">
                        {usd(p.usd)}
                      </span>
                      {p.txUrl && p.tx?.startsWith("0x") ? (
                        <a
                          href={p.txUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="shrink-0 text-muted-2 transition-colors hover:text-white"
                          title="open the transaction"
                        >
                          <ExternalLink className="size-3.5" />
                        </a>
                      ) : (
                        <span className="w-3.5 shrink-0" />
                      )}
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </div>
        </Panel>

        <div className="grid gap-3 content-start">
          <Panel className="p-5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted-2">this round</p>
            {serving || result ? (
              <dl className="mt-3 space-y-2.5 text-[13.5px]">
                <Row k="mouths in the queue" v={num(serving?.people ?? result?.served ?? 0)} />
                <Row
                  k="each"
                  v={
                    <span className="text-[var(--mustard)]">
                      {usd(serving?.perHolderUsd ?? result?.perHolderUsd ?? null)}
                    </span>
                  }
                />
                <Row
                  k={`${s.brand.itemPlural} each`}
                  v={dogs(serving?.hotDogsEach ?? result?.hotDogsEach ?? null)}
                />
                <Row k="the round costs" v={usd(serving?.budgetUsd ?? result?.totalUsd ?? null)} />
                <Row k="paid in" v={serving?.asset ?? result?.asset ?? "—"} />
              </dl>
            ) : (
              <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
                Nothing is being served right now. The next bell is on the wall clock, so it lands at
                the same instant for everyone watching.
              </p>
            )}
          </Panel>

          {s.lastError && (
            <Panel className="border-[var(--brand-red)]/25 p-5">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#ff8598]">
                the last round fed nobody
              </p>
              <p className="mt-2.5 text-[13.5px] leading-relaxed text-white/80">{s.lastError}</p>
              <p className="mt-3 text-[12.5px] leading-relaxed text-muted-2">
                A round that refuses is recorded with its reason, the same as one that pays. An empty
                history means nobody has been fed — never that the recorder broke.
              </p>
            </Panel>
          )}
        </div>
      </div>
    </Section>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-muted">{k}</dt>
      <dd className="tnum font-medium">{v}</dd>
    </div>
  );
}

function Empty({ s }: { s: LiveState }) {
  return (
    <div className="flex h-[240px] flex-col items-center justify-center gap-3 px-6 text-center">
      <div className="relative">
        <span className="absolute inset-0 animate-pulse-ring rounded-full bg-[var(--mustard)]/20" />
        <span className="relative grid size-11 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-lg">
          🌭
        </span>
      </div>
      <p className="text-[13.5px] text-muted">
        {s.service?.queue
          ? `${num(s.service.queue)} in line. Nothing goes out until the bell.`
          : "Nobody in line yet."}
      </p>
    </div>
  );
}
