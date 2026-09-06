/** Formatting, in one place, so no two panels disagree about what a number looks like. */

const usdFmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const usdCents = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const usd = (n: number | null | undefined) =>
  n == null ? "—" : Math.abs(n) >= 1000 ? usdFmt.format(Math.round(n)) : usdCents.format(n);

export const num = (n: number | null | undefined, d = 0) =>
  n == null ? "—" : n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

/** 0x1234…abcd — long enough to recognise, short enough to sit in a row. */
export const short = (a: string | null | undefined, head = 6, tail = 4) =>
  !a ? "—" : a.length <= head + tail + 1 ? a : `${a.slice(0, head)}…${a.slice(-tail)}`;

export const pct = (n: number | null | undefined, d = 2) => (n == null ? "—" : `${n.toFixed(d)}%`);

/** m:ss, always two digits on the seconds, so the countdown never jumps width. */
export function clock(ms: number) {
  const t = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
}

/**
 * The countdown, in the units the round is actually measured in.
 *
 * m:ss is right for a five-minute round and absurd for a five-second one —
 * "0:04" spends three of its four characters saying nothing. Under a minute,
 * count seconds.
 */
export function countdown(ms: number, roundMs: number) {
  if (roundMs >= 60_000) return clock(ms);
  return `${Math.max(0, Math.ceil(ms / 1000))}s`;
}

export function ago(ts: number | null | undefined) {
  if (!ts) return "—";
  const s = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

/**
 * How many hot dogs that is, said the way a person would say it. A round that
 * pays a full dollar says "1 hot dog"; one where the brake bit says "⅓ of a
 * hot dog", because rounding it up to 1 would be the page lying about the
 * thing it exists to report.
 */
export function dogs(n: number | null | undefined) {
  if (n == null) return "—";
  if (n >= 1) return n.toLocaleString("en-US", { maximumFractionDigits: n % 1 === 0 ? 0 : 2 });
  return n.toFixed(2);
}

const WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];

/**
 * The payout interval, said the way a person says it.
 *
 * The backend owns the number, so this has to read correctly whether a round is
 * five seconds or five minutes — the headline cannot hard-code either, or the
 * page starts lying the moment ROUND_MS is changed.
 */
export function every(ms: number, spelled = false) {
  const seconds = Math.round(ms / 1000);
  const [n, unit] = seconds % 60 === 0 && seconds >= 60 ? [seconds / 60, "minute"] : [seconds, "second"];
  const label = spelled && n <= 10 ? WORDS[n] : String(n);
  return `${label} ${unit}${n === 1 ? "" : "s"}`;
}
