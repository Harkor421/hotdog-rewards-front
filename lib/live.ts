"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  Brand, Hello, LeaderRow, Payment, Pot, Round, RoundRow, ServeResult, ServeStart, Service, Stats, Totals,
} from "./types";

const RAW = process.env.NEXT_PUBLIC_BACKEND_URL || "wss://hotdog-rewards-back-production.up.railway.app";
export const WS_URL = RAW.replace(/^http/, "ws").replace(/\/$/, "");
export const HTTP_URL = RAW.replace(/^ws/, "http").replace(/\/$/, "");

export type Connection = "connecting" | "open" | "closed";

export type LiveState = {
  connection: Connection;
  brand: Brand;
  hotDogUsd: number;
  roundMs: number;
  round: Round | null;
  /** Milliseconds to the next bell, corrected for the client's clock drift. */
  msLeft: number;
  service: Service | null;
  pot: Pot | null;
  /** All-time when a database is attached; since-boot when not. Labelled either way. */
  stats: Stats | null;
  /** Live increments applied on top of `stats` between refetches. */
  live: Totals;
  serving: ServeStart | null;
  lastResult: ServeResult | null;
  lastError: string | null;
  feed: Payment[];
  leaderboard: LeaderRow[];
  rounds: RoundRow[];
  viewers: number;
  /** Bumped on every serveResult, so the 3D scene can react to the bell. */
  bell: number;
};

const EMPTY: Totals = { hotDogs: 0, usd: 0, rounds: 0, people: 0 };

export function useLive(): LiveState {
  const [connection, setConnection] = useState<Connection>("connecting");
  const [brand, setBrand] = useState<Brand>({
    name: "Hotdog Rewards",
    coin: "HDR",
    item: "hot dog",
    itemPlural: "hot dogs",
  });
  const [hotDogUsd, setHotDogUsd] = useState(1);
  const [roundMs, setRoundMs] = useState(300_000);
  const [round, setRound] = useState<Round | null>(null);
  const [msLeft, setMsLeft] = useState(0);
  const [service, setService] = useState<Service | null>(null);
  const [pot, setPot] = useState<Pot | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [live, setLive] = useState<Totals>(EMPTY);
  const [serving, setServing] = useState<ServeStart | null>(null);
  const [lastResult, setLastResult] = useState<ServeResult | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const [feed, setFeed] = useState<Payment[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderRow[]>([]);
  const [rounds, setRounds] = useState<RoundRow[]>([]);
  const [viewers, setViewers] = useState(0);
  const [bell, setBell] = useState(0);

  /**
   * The difference between this browser's clock and the server's.
   *
   * The countdown has to be right on a laptop whose clock is four minutes fast,
   * because the whole promise of the page is that the bell rings at the same
   * instant for everyone. Every message carries the server's `ts`; the offset
   * is the running correction, and the countdown is computed through it rather
   * than from a local timer that started whenever this tab happened to open.
   */
  const skew = useRef(0);
  const roundRef = useRef<Round | null>(null);

  const refetch = useCallback(async () => {
    const get = async <T,>(path: string): Promise<T | null> => {
      try {
        const r = await fetch(`${HTTP_URL}${path}`, { cache: "no-store" });
        return r.ok ? ((await r.json()) as T) : null;
      } catch {
        return null;
      }
    };
    const [s, l, rr] = await Promise.all([
      get<Stats>("/stats"),
      get<{ rows: LeaderRow[] }>("/leaderboard?limit=25"),
      get<{ rows: RoundRow[] }>("/rounds?limit=20"),
    ]);
    if (s) {
      setStats(s);
      // The authoritative totals just landed; the optimistic ones they were
      // standing in for are now double-counting. Drop them.
      setLive(EMPTY);
    }
    if (l?.rows) setLeaderboard(l.rows);
    if (rr?.rows) setRounds(rr.rows);
  }, []);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let retry = 0;
    let reconnectTimer: ReturnType<typeof setTimeout>;
    let pinger: ReturnType<typeof setInterval>;
    let closed = false;

    const connect = () => {
      if (closed) return;
      setConnection("connecting");
      try {
        ws = new WebSocket(WS_URL);
      } catch {
        schedule();
        return;
      }

      ws.onopen = () => {
        retry = 0;
        setConnection("open");
        pinger = setInterval(() => {
          try { ws?.send(JSON.stringify({ op: "ping" })); } catch {}
        }, 25_000);
      };

      ws.onclose = () => {
        clearInterval(pinger);
        setConnection("closed");
        schedule();
      };
      ws.onerror = () => { try { ws?.close(); } catch {} };

      ws.onmessage = (ev) => {
        let m: Record<string, unknown>;
        try { m = JSON.parse(ev.data as string); } catch { return; }
        if (typeof m.ts === "number") skew.current = m.ts - Date.now();

        switch (m.type) {
          case "hello": {
            const h = m as unknown as Hello;
            // MERGE, never replace.
            //
            // A backend one version behind sends {coin, item, itemPlural} with
            // no `name`, and replacing the whole object wiped the site's own
            // name out of the nav. Any field the server does not send keeps its
            // default instead of becoming undefined on screen.
            if (h.brand) setBrand((b) => ({ ...b, ...h.brand }));
            if (h.hotDogUsd) setHotDogUsd(h.hotDogUsd);
            if (h.roundMs) setRoundMs(h.roundMs);
            setRound(h.round);
            roundRef.current = h.round;
            setService(h.service);
            setPot(h.pot);
            setViewers(h.viewers ?? 0);
            // Seed the queue from the last round the server served. A round
            // takes seconds and the gap between them is five minutes, so
            // almost everyone arrives while nothing is happening — and an
            // empty list reads as "this does not work", not as "wait".
            if (h.lastRound?.items?.length) {
              setLastResult(h.lastRound);
              setFeed((f) => (f.length ? f : [...h.lastRound!.items!].reverse().slice(0, 60)));
            }
            // Without a database the server's own since-boot tally is the only
            // record there is, so seed from it rather than showing zeroes.
            if (h.session) setStats((prev) => prev ?? { ...h.session!, ready: false, source: "since-boot" });
            break;
          }
          case "tick": {
            const r = m.round as Round | null;
            if (r) { setRound(r); roundRef.current = r; }
            break;
          }
          case "roundStart": {
            const r = m.round as Round;
            setRound(r);
            roundRef.current = r;
            setServing(null);
            break;
          }
          case "roundEnd":
            break;
          case "pot":
            setPot(m as unknown as Pot);
            break;
          case "holders":
            setService((s) =>
              s ? { ...s, queue: (m.count as number) ?? s.queue, queued: (m.queued as number) ?? s.queued, capped: !!m.capped } : s
            );
            break;
          case "serveStart": {
            setLastError(null);
            setServing(m as unknown as ServeStart);
            // The feed is deliberately NOT cleared here.
            //
            // It used to reset every round, which was fine at five minutes and
            // is unusable at five seconds: the list was wiped and refilled
            // faster than its own enter animation could finish, so it sat
            // permanently blank while claiming forty rows. A rolling log of the
            // most recent transfers is both steadier and more honest — every
            // row is still one transfer that was actually broadcast.
            break;
          }
          case "servePayment": {
            const p = m as unknown as Payment;
            // Newest first, and bounded: this is a window on the last few
            // rounds, not a ledger. The ledger is /recent and the receipt book.
            setFeed((f) => [p, ...f].slice(0, 60));
            break;
          }
          case "serveResult": {
            const r = m as unknown as ServeResult;
            setLastResult(r);
            setServing(null);
            setBell((b) => b + 1);
            // Move the counters now and reconcile against the server shortly
            // after: a number that only updates on the next poll makes the page
            // look asleep at the exact moment it is doing its one job.
            setLive((v) => ({
              hotDogs: v.hotDogs + (r.hotDogs || 0),
              usd: v.usd + (r.totalUsd || 0),
              rounds: v.rounds + 1,
              people: v.people,
            }));
            setTimeout(() => refetch(), 2500);
            break;
          }
          case "serveError":
            setServing(null);
            setLastError(String(m.message ?? "the round could not be served"));
            setTimeout(() => refetch(), 2000);
            break;
        }
      };
    };

    const schedule = () => {
      if (closed) return;
      // Back off, but never past a few seconds: this page is a countdown, and
      // a viewer who reloads into a 30-second reconnect sees a dead clock.
      const wait = Math.min(6000, 600 * 2 ** retry++);
      reconnectTimer = setTimeout(connect, wait);
    };

    connect();
    refetch();
    const poll = setInterval(refetch, 60_000);

    return () => {
      closed = true;
      clearTimeout(reconnectTimer);
      clearInterval(pinger);
      clearInterval(poll);
      try { ws?.close(); } catch {}
    };
  }, [refetch]);

  // The countdown, driven locally but anchored to the server's clock.
  useEffect(() => {
    const tick = () => {
      const r = roundRef.current;
      setMsLeft(r ? Math.max(0, r.endsAt - (Date.now() + skew.current)) : 0);
    };
    tick();
    const id = setInterval(tick, 200);
    return () => clearInterval(id);
  }, []);

  const merged: Stats | null = stats
    ? {
        ...stats,
        hotDogs: stats.hotDogs + live.hotDogs,
        usd: stats.usd + live.usd,
        rounds: stats.rounds + live.rounds,
      }
    : null;

  return {
    connection, brand, hotDogUsd, roundMs, round, msLeft, service, pot,
    stats: merged, live, serving, lastResult, lastError, feed, leaderboard, rounds, viewers, bell,
  };
}
