# 🌭 Hotdog Rewards — Frontend

The page for [`hotdog-rewards-back`](https://github.com/Harkor421/hotdog-rewards-back): a countdown,
a hot dog, and every dollar the treasury has ever handed out.

**Next.js 16 · React 19 · Tailwind v4 · Magic UI · Three.js**

---

## The hot dog

It is the whole page, so it is worth saying how it is built: **there is no model
file and no texture file.** The bun, the sausage and both sauces are generated in
the browser, and every map on them is value noise painted onto a canvas.

That is not a stunt. It is what makes the page load instantly and never break:

- **Nothing can 404.** No `.glb`, no HDR environment, no JPEG. drei's `Environment`
  presets pull a few megabytes from a third-party CDN, so the environment here is
  three `Lightformer`s instead — a warm key overhead, a red bounce from the left, a
  cool rim from the right. The sauces have something to reflect and it costs nothing.
- **The bun is one extruded cross-section**, not two half-loaves stuck together, so
  the groove the sausage sits in is genuinely part of the same surface and catches
  light the way a slit in bread does. The cross-section is centred along its
  **length only** — `geometry.center()` would also recentre Y, which lifts the bun
  and closes the bread over the sausage. That is a bap, not a hot dog.
- **The sauces are swept around the sausage, not across it.** The zigzag is an angle
  orbiting the cylinder rather than a sideways offset in `x`, so the ribbon stays
  welded to the curved surface instead of sinking into it at the crests.
- **The bun is shorter than the sausage on purpose.** A dog that ends flush with its
  bun reads as a sandwich. The overhang is the silhouette.
- Noise is generated on a **wrapping lattice**, so the bread has no seam where the
  UVs repeat. Albedo rides the low-frequency octaves, bump rides the high ones —
  which is what separates baked bread from an orange plastic tube.

It pops when a round is served, and you can drag it.

## Live state

One WebSocket carries everything; REST fills in the history. `lib/live.ts`
holds the whole thing, and two details in it are load-bearing:

- **The countdown runs through a clock offset, not a local timer.** Every message
  carries the server's timestamp, and the difference against `Date.now()` is a
  running correction. The promise of the page is that the bell rings at the same
  instant for everyone — including on a laptop whose clock is four minutes fast.
- **Counters move optimistically and reconcile a beat later.** A number that only
  updates on the next poll makes the page look asleep at the exact moment it is
  doing its one job. When the authoritative totals land, the optimistic ones are
  dropped rather than added to.

## Honesty on screen

The backend can only count what it has seen since it last booted when no database
is attached, so `/stats` says `source: "since-boot"` and **the page prints that**
under the counter. A total that quietly reset on a deploy would be the page lying
about the only thing anybody came here to check. The same goes for:

- a treasury that is *unset* versus one that is *empty* — very different things,
  never shown the same way;
- a round where the brake bit, which says **"0.50 hot dogs each"** rather than
  rounding up to one;
- rounds that fed nobody, listed with the reason they refused;
- a demo queue, labelled as a demo everywhere it appears.

## Run it

```bash
npm install
cp .env.example .env.local     # point it at your backend
npm run dev
```

```
NEXT_PUBLIC_BACKEND_URL=wss://hotdog-rewards-back-production.up.railway.app
```

The client derives the `https://` origin from that same value, so there is one URL
to set, not two.

## Deploy

Vercel, as-is. Set `NEXT_PUBLIC_BACKEND_URL` in the project's environment variables
and push — the page is static, and everything live arrives over the socket.

```bash
vercel --prod
```

## Layout

```
app/            page + layout
components/
  hotdog/       the model, the stage, and the noise that textures it
  magicui/      Magic UI components (number ticker, border beam, shimmer, marquee…)
  site/         the sections of the page
lib/            wire types, formatting, and the live-state hook
```
