"use client";

import { Marquee } from "@/components/magicui/marquee";
import { Panel, Section } from "./ui";

/**
 * What it refuses to do.
 *
 * These four are the reason the numbers above can be trusted, and each one is
 * here because it went wrong on a live token before it was a rule. They are
 * worth more page than a features list would be.
 */
const REFUSALS = [
  {
    when: "the crawl saw less than 40% of the supply",
    why: "That is a truncated crawl, not a coin with a tiny float. Paying over it hands every hot dog to whichever addresses happened to land on the first page.",
  },
  {
    when: "the holder count collapses against the last crawl",
    why: "A sudden drop to under a third is an indexer having a bad minute far more often than it is a real exodus — and paying through it quietly concentrates the round into whoever survived the bad data.",
  },
  {
    when: "the snapshot is more than ten minutes old",
    why: "Distributing over frozen data pays the queue that existed, not the one that exists.",
  },
  {
    when: "discovery accounted for less than 99.5% of the supply",
    why: "Unaccounted supply is not noise. It is wallets nobody has looked at yet, and every one of them is a person who would go hungry. Stopping at 83% once hid the holder owed 89% of an airdrop.",
  },
];

export function Refusals() {
  return (
    <Section
      eyebrow="the refusals"
      title="It would rather feed nobody than feed the wrong queue"
      lead="Four conditions stop a round dead. Each is recorded with its reason and shows up in the history above."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {REFUSALS.map((r) => (
          <Panel key={r.when} className="p-5">
            <p className="text-[14px] font-medium leading-snug">
              <span className="mr-2 text-[var(--brand-red)]">✕</span>
              {r.when}
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">{r.why}</p>
          </Panel>
        ))}
      </div>
    </Section>
  );
}

export function Ticker({ item }: { item: string }) {
  const words = [
    `one ${item}`,
    "every five minutes",
    "same dollar for everyone",
    "no pools",
    "no bonding curves",
    "no contracts",
    "checked on-chain",
    "every round on the record",
  ];
  return (
    <div className="relative border-y border-[var(--line)] bg-white/[0.015] py-3">
      <Marquee className="[--duration:32s] [--gap:2.5rem]" pauseOnHover>
        {words.map((w) => (
          <span
            key={w}
            className="flex items-center gap-10 whitespace-nowrap text-[12px] uppercase tracking-[0.24em] text-muted-2"
          >
            {w}
            <span className="text-[var(--mustard)]">🌭</span>
          </span>
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[var(--background)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[var(--background)] to-transparent" />
    </div>
  );
}
