"use client";

import { Wordmark } from "./Logo";
import { Dot, Pill } from "./ui";
import type { Connection } from "@/lib/live";

export function Nav({ connection, name }: { connection: Connection; name: string }) {
  return (
    <header className="sticky top-0 z-40">
      {/* the blue strip a warehouse store puts above everything */}
      <div className="h-1.5 bg-[var(--blue)]" />
      <div className="border-b border-[var(--line)] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-5 sm:px-8">
          <a href="#top" aria-label={name}>
            <Wordmark name={name} />
          </a>
          <Pill tone={connection === "open" ? "live" : "warn"}>
            <Dot tone={connection === "open" ? "live" : "warn"} />
            {connection === "open" ? "live" : connection === "connecting" ? "connecting" : "offline"}
          </Pill>
        </div>
      </div>
    </header>
  );
}
