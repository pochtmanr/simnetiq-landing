import type { AnalyticsCatalog } from "./shape";

export interface SnapshotRow {
  snapshotId: string;
  highWatermark: string;
  dataAsOf: string;
}

export interface RevisionPage {
  conflict: boolean;
  rows: Array<Record<string, unknown>>;
}

export interface IntervalInput {
  from: string;
  to: string;
  basis: string;
  asOf: string;
}

export interface AnalyticsQuery {
  provider: string;
  report: string;
  from: string;
  to: string;
  limit: number;
  after: string;
  asOf: string;
  snapshotId: string | null;
}

export interface AnalyticsPage {
  body: Record<string, unknown>;
  sequences: string[];
  highWatermark: string;
}

export interface ExportStore {
  readResponse(route: string, snapshotId: string): Promise<Record<string, unknown> | null>;
  financeSummary(input: IntervalInput): Promise<Record<string, unknown>>;
  overview(input: IntervalInput): Promise<Record<string, unknown>>;
  financeDaily(input: IntervalInput): Promise<Record<string, unknown>>;
  balances(asOf: string): Promise<Record<string, unknown>>;
  reconciliation(input: IntervalInput): Promise<Record<string, unknown>>;
  operations(input: IntervalInput): Promise<Record<string, unknown>>;
  subscriptions(input: IntervalInput): Promise<Record<string, unknown>>;
  health(asOf: string): Promise<Record<string, unknown>>;
  analyticsCatalog(): Promise<AnalyticsCatalog>;
  analytics(input: AnalyticsQuery): Promise<AnalyticsPage>;
  openSnapshot(asOf: string): Promise<SnapshotRow>;
  getSnapshot(snapshotId: string): Promise<SnapshotRow | null>;
  revisions(input: {
    snapshot: SnapshotRow;
    after: string;
    limit: number;
    from: string | null;
    to: string | null;
  }): Promise<RevisionPage>;
}

export class ExportConflict extends Error {
  constructor() {
    super("hash_conflict");
  }
}

export class SubscriptionRefused extends Error {
  constructor() {
    super("subscriptions_refused");
  }
}
