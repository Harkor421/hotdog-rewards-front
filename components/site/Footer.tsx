"use client";

import type { LiveState } from "@/lib/live";
import { Logo } from "./Logo";

export function Footer({ s }: { s: LiveState }) {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--surface)]">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4 px-5 py-10 text-center sm:px-8">
        <Logo size={44} />
        <p className="max-w-md text-[12.5px] leading-relaxed text-muted-2">
          Hotdog Rewards is not affiliated with Costco Wholesale Corporation. The dollar-fifty hot
          dog is the reference, not the brand.
        </p>
      </div>
      <div className="h-1.5 bg-[var(--blue)]" />
    </footer>
  );
}
