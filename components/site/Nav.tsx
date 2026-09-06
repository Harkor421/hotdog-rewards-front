"use client";

import { Dot, Pill } from "./ui";
import type { Connection } from "@/lib/live";

export function Nav({
  connection,
  viewers,
  name,
}: {
  connection: Connection;
  viewers: number;
  name: string;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--background)]/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="grid size-7 place-items-center rounded-lg bg-[var(--brand-red)] text-[13px] leading-none shadow-[0_6px_18px_-6px_rgba(227,24,55,0.9)]">
            🌭
          </span>
          <span className="text-[15px] font-semibold tracking-tight">
            {name}
            <span className="text-[var(--mustard)]">.</span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 text-[13.5px] text-muted md:flex">
          <a className="transition-colors hover:text-white" href="#counter">The counter</a>
          <a className="transition-colors hover:text-white" href="#how">How it works</a>
          <a className="transition-colors hover:text-white" href="#till">The till</a>
          <a className="transition-colors hover:text-white" href="#queue">Who ate</a>
          <a className="transition-colors hover:text-white" href="#rounds">Every round</a>
        </nav>

        <Pill tone={connection === "open" ? "live" : connection === "connecting" ? "warn" : "bad"}>
          <Dot tone={connection === "open" ? "live" : connection === "connecting" ? "warn" : "bad"} />
          {connection === "open" ? `live · ${viewers} watching` : connection === "connecting" ? "connecting" : "offline"}
        </Pill>
      </div>
    </header>
  );
}
