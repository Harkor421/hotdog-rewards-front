"use client";

import { AnimatePresence, motion } from "motion/react";
import { ExternalLink } from "lucide-react";
import { num, short, usd } from "@/lib/format";
import type { LiveState } from "@/lib/live";
import { Addr, Dot, Section } from "./ui";

/** Who got one. Each row is a transfer that was actually broadcast. */
export function Fed({ s }: { s: LiveState }) {
  const rows = s.feed;
  const serving = !!s.serving;

  return (
    <Section className="pb-20">
      <div className="card overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between gap-3 border-b border-[var(--line)] bg-[var(--surface)] px-5 py-3.5">
          <span className="flex items-center gap-2.5 text-[13px] font-bold uppercase tracking-[0.12em]">
            <Dot tone={serving ? "live" : rows.length ? "warn" : "off"} />
            {serving ? "handing them out" : "who got one"}
          </span>
          {rows.length > 0 && (
            <span className="text-[12px] font-medium text-muted-2">{num(rows.length)} shown</span>
          )}
        </div>

        <div className="scroll-thin max-h-[520px] min-h-[220px] overflow-y-auto">
          {rows.length === 0 ? (
            <div className="flex h-[220px] flex-col items-center justify-center gap-3 px-6 text-center">
              <div className="relative">
                <span className="absolute inset-0 animate-pulse-ring rounded-full bg-[var(--mustard)]/30" />
                <span className="relative grid size-11 place-items-center rounded-full border border-[var(--line)] bg-white text-lg">
                  🌭
                </span>
              </div>
              <p className="text-[13.5px] text-muted">
                {s.service?.queue
                  ? `${num(s.service.queue)} in line. Nothing goes out until the bell.`
                  : "Nobody in line yet."}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-[var(--line)]">
              <AnimatePresence initial={false}>
                {rows.map((p, i) => (
                  <motion.li
                    key={`${p.to}-${p.tx ?? i}`}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center gap-3 px-5 py-3 text-[13.5px]"
                  >
                    <span className="w-9 shrink-0 text-[12px] font-semibold tnum text-muted-2">
                      {i + 1}
                    </span>
                    <Addr address={short(p.to, 10, 6)} href={p.addrUrl} />
                    <span className="ml-auto shrink-0 font-bold tnum text-[var(--red)]">
                      {usd(p.usd)}
                    </span>
                    {p.txUrl && p.tx?.startsWith("0x") ? (
                      <a
                        href={p.txUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="shrink-0 text-muted-2 transition-colors hover:text-[var(--blue)]"
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
      </div>
    </Section>
  );
}
