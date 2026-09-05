/** The wire contract, mirrored from the backend. Nothing else crosses it. */

export type Round = {
  id: number;
  seq: number;
  startedAt: number;
  endsAt: number;
  lengthMs: number;
  label: string;
};

export type Brand = { coin: string; item: string; itemPlural: string };

export type Service = {
  enabled: boolean;
  dryRun: boolean;
  mode: "flat" | "prorata";
  asset: string;
  hotDogUsd: number;
  brand: Brand;
  token: string | null;
  tokenSymbol: string | null;
  explorer: string;
  queue: number;
  queued: number;
  capped: boolean;
  maxRecipients: number;
  minEligiblePct: number;
  poolsExcluded: number;
  demo: boolean;
  holdersAt: number | null;
  treasury: string | null;
};

export type Pot = {
  ready: boolean;
  reason?: string;
  address?: string;
  addrUrl?: string;
  eth?: number;
  ethUsd?: number | null;
  usd?: number | null;
  spendableUsd?: number | null;
  gasReserveEth?: number;
  nextRoundUsd?: number | null;
  roundCapUsd?: number | null;
  roundsLeft?: number | null;
  maxRoundPct?: number;
  asset?: string;
  dryRun?: boolean;
};

export type Payment = {
  to: string;
  rank?: number;
  pct?: number;
  held?: number;
  usd: number;
  hotDogs: number;
  amount?: number;
  asset?: string;
  tx?: string | null;
  txUrl?: string | null;
  addrUrl?: string;
  simulated?: boolean;
};

export type ServeStart = {
  round?: Round;
  people: number;
  queued?: number;
  capped?: boolean;
  perHolderUsd: number | null;
  hotDogsEach?: number | null;
  budgetUsd: number;
  shortfall: boolean;
  mode?: string;
  asset?: string;
  hotDogUsd: number;
  dryRun?: boolean;
  demo?: boolean;
  simulated?: boolean;
};

export type ServeResult = {
  round?: Round;
  served: number;
  hotDogs: number;
  totalUsd: number;
  perHolderUsd?: number | null;
  hotDogsEach?: number | null;
  shortfall?: boolean;
  asset?: string;
  items?: Payment[];
  explorer?: string;
  dryRun?: boolean;
  demo?: boolean;
  simulated?: boolean;
};

export type Totals = { hotDogs: number; usd: number; rounds: number; people: number };

export type Stats = Totals & {
  ready: boolean;
  source: "db" | "since-boot";
  meals?: number;
  roundsPaid?: number;
  hotDogUsd?: number;
  note?: string;
};

export type LeaderRow = {
  rank: number;
  address: string;
  hotDogs: number;
  totalUsd: number;
  meals: number;
  lastAt: number | null;
  lastHeldPct: number | null;
};

export type RoundRow = {
  roundId: number;
  label: string | null;
  startedAt: number | null;
  paid: boolean;
  reason: string | null;
  served: number;
  hotDogs: number | null;
  totalUsd: number | null;
  perHolderUsd?: number | null;
  shortfall?: boolean;
  asset?: string | null;
  dryRun?: boolean;
  demo?: boolean;
  ts: number;
};

export type LastRound = ServeResult & { at: number };

export type Hello = {
  type: "hello";
  ts: number;
  brand: Brand;
  hotDogUsd: number;
  roundMs: number;
  round: Round | null;
  msLeft: number;
  history: Round[];
  service: Service | null;
  pot: Pot | null;
  lastRound: LastRound | null;
  session: Totals | null;
  viewers: number;
};
