"use client";

import { BlurFade } from "@/components/magicui/blur-fade";
import { Counter } from "@/components/site/Counter";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/site/Hero";
import { HowItWorks } from "@/components/site/HowItWorks";
import { Leaderboard, Rounds } from "@/components/site/Leaderboard";
import { LiveQueue } from "@/components/site/LiveQueue";
import { Nav } from "@/components/site/Nav";
import { Refusals, Ticker } from "@/components/site/Refusals";
import { Till } from "@/components/site/Till";
import { useLive } from "@/lib/live";

export default function Page() {
  const s = useLive();

  return (
    <>
      <Nav connection={s.connection} viewers={s.viewers} name={s.brand.name} />
      <main className="flex-1">
        <Hero s={s} />
        <Ticker item={s.brand.item} />
        <Counter s={s} />
        <BlurFade><LiveQueue s={s} /></BlurFade>
        <BlurFade><HowItWorks s={s} /></BlurFade>
        <BlurFade><Till s={s} /></BlurFade>
        <BlurFade><Refusals /></BlurFade>
        <BlurFade><Leaderboard s={s} /></BlurFade>
        <BlurFade><Rounds s={s} /></BlurFade>
      </main>
      <Footer s={s} />
    </>
  );
}
