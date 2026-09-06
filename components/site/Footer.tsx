"use client";

import { HTTP_URL } from "@/lib/live";
import type { LiveState } from "@/lib/live";
import { Addr } from "./ui";

export function Footer({ s }: { s: LiveState }) {
  const endpoints: [string, string][] = [
    ["/state", "the live snapshot"],
    ["/stats", "hot dogs, people, rounds"],
    ["/rounds", "every round, fed or refused"],
    ["/leaderboard", "who ate the most"],
    ["/holders", "what was found and what was excluded"],
  ];

  return (
    <footer className="border-t border-[var(--line)]">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.2fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid size-7 place-items-center rounded-lg bg-[var(--brand-red)] text-[13px] leading-none">
              🌭
            </span>
            <span className="text-[15px] font-semibold tracking-tight">
              {s.brand.name}
              <span className="text-[var(--mustard)]">.</span>
            </span>
          </div>
          <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-muted">
            A {s.brand.item} is a dollar. Hold ${s.brand.coin} and one arrives every{" "}
            {Math.round(s.roundMs / 60000)} minutes. Not a promise on a roadmap — a transfer with a
            hash, listed above, checkable on the explorer.
          </p>
          {s.service?.token && (
            <p className="mt-4 text-[12px] text-muted-2">
              contract{" "}
              <Addr
                address={s.service.token}
                href={`${s.service.explorer}/address/${s.service.token}`}
                className="text-white/60"
              />
            </p>
          )}
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-muted-2">
            check the numbers yourself
          </p>
          <ul className="mt-4 space-y-2">
            {endpoints.map(([path, desc]) => (
              <li key={path} className="flex items-baseline gap-3 text-[13px]">
                <a
                  href={`${HTTP_URL}${path}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="font-mono text-white/75 underline decoration-white/15 underline-offset-4 transition-colors hover:decoration-[var(--mustard)]"
                >
                  {path}
                </a>
                <span className="text-muted-2">{desc}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-[var(--line)]">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-5 text-[12px] text-muted-2 sm:px-8">
          <span>
            Not affiliated with Costco Wholesale Corporation. The dollar hot dog is the
            reference, not the brand.
          </span>
          <span>
            {s.service?.dryRun ? "running in dry run — nothing has moved" : "live"} ·{" "}
            {s.service?.mode === "flat" ? "flat payout" : "pro-rata payout"}
          </span>
        </div>
      </div>
    </footer>
  );
}
