"use client";

import dynamic from "next/dynamic";

/**
 * WebGL never runs on the server, and a Canvas that renders to a blank box on
 * first paint is worse than a placeholder that says what is coming. So the
 * scene is client-only with a fallback that occupies exactly the same space.
 */
const HotDogScene = dynamic(() => import("./HotDogScene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="relative">
        <div className="absolute inset-0 animate-pulse-ring rounded-full bg-[var(--mustard)]/30" />
        <div className="relative grid size-16 place-items-center rounded-full border border-[var(--line)] bg-white text-2xl">
          🌭
        </div>
      </div>
    </div>
  ),
});

export function HotDogStage({ bell, className }: { bell: number; className?: string }) {
  return <HotDogScene bell={bell} className={className} />;
}
