"use client";

import { Fed } from "@/components/site/Fed";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/site/Hero";
import { Nav } from "@/components/site/Nav";
import { Totals } from "@/components/site/Totals";
import { useLive } from "@/lib/live";

export default function Page() {
  const s = useLive();

  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero s={s} />
        <Totals s={s} />
        <Fed s={s} />
      </main>
      <Footer s={s} />
    </>
  );
}
