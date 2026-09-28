import { randomBytes } from "node:crypto";
import type { BosEnvironment, BosKey } from "./keys";
import { authenticateBusinessOs } from "./hmac";
import type { NonceStore } from "./nonce";
import {
  assertEmptyGetBody,
  assertRange,
  GuardError,
  readInstant,
  readInterval,
  readPageLimit,
  rejectUnappliedFilters,
  utcStamp,
  type Resync,
} from "./guards";
import { cursorExpiry, decodeCursor, encodeCursor, queryBinding } from "./cursor";
import { redactExport } from "./redact";
import { capabilities, knownReport, period } from "./shape";
import { ExportConflict, SubscriptionRefused, type ExportStore, type SnapshotRow } from "./store";

export interface BosDeps {
  store: ExportStore;
  nonceStore: NonceStore;
  keys: BosKey[];
  now: () => Date;
  environment: BosEnvironment;
  projectId: "smscode";
  testTransport: boolean;
  rateLimit: number;
  cache?: Map<string, unknown>;
}

const ROUTES = [
  "/api/business-os/v1/capabilities",
  "/api/business-os/v1/overview",
  "/api/business-os/v1/finance/summary",
  "/api/business-os/v1/finance/daily",
  "/api/business-os/v1/finance/records",
  "/api/business-os/v1/finance/balances",
  "/api/business-os/v1/finance/reconciliation",
  "/api/business-os/v1/subscriptions/summary",
  "/api/business-os/v1/operations/daily",
  "/api/business-os/v1/analytics/report",
  "/api/business-os/v1/health",
] as const;

const ROUTE_SET = new Set<string>(ROUTES);
const RECORDS = "/api/business-os/v1/finance/records";
const ANALYTICS = "/api/business-os/v1/analytics/report";

const PERSISTED: Record<string, string> = {
  "/api/business-os/v1/overview": "overview",
  "/api/business-os/v1/finance/summary": "finance.summary",
  "/api/business-os/v1/finance/daily": "finance.daily",
  "/api/business-os/v1/finance/balances": "finance.balances",
  "/api/business-os/v1/finance/reconciliation": "finance.reconciliation",
  "/api/business-os/v1/operations/daily": "operations.daily",
  "/api/business-os/v1/subscriptions/summary": "subscriptions.summary",
  "/api/business-os/v1/health": "health",
};

export async function handleBusinessOs(request: Request, deps: BosDeps): Promise<Response> {
  const url = new URL(request.url);
  if (!ROUTE_SET.has(url.pathname)) return problem(404, "malformed_parameter", "Unknown route.", false);
  const body = new Uint8Array(await request.arrayBuffer());
  const tls = url.protocol === "https:" || request.headers.get("x-forwarded-proto") === "https";
  if (deps.keys.length === 0) return problem(503, "temporary_unavailable", "Export keys are not configured.", true);
  let auth: Awaited<ReturnType<typeof authenticateBusinessOs>>;
  try {
    auth = await authenticateBusinessOs({
      method: request.method,
      requestTarget: `${url.pathname}${url.search}`,
      body,
      headers: request.headers,
      keys: deps.keys,
      nonceStore: deps.nonceStore,
      nowMs: deps.now().getTime(),
      deploymentProjectId: deps.projectId,
      deploymentEnvironment: deps.environment,
      tls,
      testTransport: deps.testTransport,
      rateLimit: deps.rateLimit,
    });
  } catch {
    return problem(503, "temporary_unavailable", "The export is temporarily unavailable.", true);
  }
  if (!auth.ok) return problem(auth.status, auth.code, auth.message, auth.retryable, auth.retryAfter);
  try {
    assertEmptyGetBody(body);
    if (request.method !== "GET") throw new GuardError(400, "malformed_parameter", false, "Only GET is supported.");
    const requested = url.searchParams.get("snapshot_id");
    const route = PERSISTED[url.pathname];
    if (requested && route) {
      const cacheKey = `${url.pathname}\0${requested}`;
      const cached = deps.cache?.get(cacheKey);
      if (cached) return json(cached, 200);
      const hit = await deps.store.readResponse(route, requested);
      if (!hit) {
        throw new GuardError(410, "snapshot_expired", false, "Snapshot expired.", resyncFor(url.pathname));
      }
      const stamped = finish(hit, deps);
      deps.cache?.set(cacheKey, stamped);
      return json(stamped, 200);
    }
    const payload = await dispatch(url.pathname, url.searchParams, deps);
    const stamped = finish(payload, deps);
    if (typeof stamped.snapshot_id === "string" && route) {
      deps.cache?.set(`${url.pathname}\0${stamped.snapshot_id}`, stamped);
    }
    return json(stamped, 200);
  } catch (error) {
    if (error instanceof GuardError) {
      return problem(error.status, error.code, error.message, error.retryable, undefined, error.resync);
    }
    if (error instanceof ExportConflict) {
      return problem(503, "temporary_unavailable", "A record revision hash conflict blocked the export.", true);
    }
    if (error instanceof SubscriptionRefused) {
      return problem(503, "temporary_unavailable", "Subscriptions are unsupported for SMS Code.", true);
    }
    return problem(503, "temporary_unavailable", "The export is temporarily unavailable.", true);
  }
}

async function dispatch(path: string, params: URLSearchParams, deps: BosDeps): Promise<Record<string, unknown>> {
  const now = deps.now();
  const generatedAt = utcStamp(now);
  if (path.endsWith("/capabilities")) {
    return capabilities({
      environment: deps.environment,
      snapshotId: `cap-${randomBytes(8).toString("hex")}`,
      generatedAt,
      catalog: await deps.store.analyticsCatalog(),
    });
  }
  if (path.endsWith("/health")) return deps.store.health(generatedAt);
  if (path.endsWith("/analytics/report")) return analytics(params, deps, generatedAt);
  if (path.endsWith("/finance/records")) return records(params, deps, generatedAt);
  if (path.endsWith("/finance/balances")) {
    rejectUnappliedFilters(params);
    const asOf = readInstant(params.get("as_of"), "as_of", true);
    if (!asOf) throw new GuardError(400, "missing_required_parameter", false, "Missing as_of.");
    return deps.store.balances(asOf);
  }
  const basisRequired = path.endsWith("/overview") || path.endsWith("/finance/summary") || path.endsWith("/finance/daily");
  const query = readInterval(params, now, basisRequired);
  const input = { from: query.from, to: query.to, basis: query.basis, asOf: query.asOf };
  let body: Record<string, unknown>;
  if (path.endsWith("/overview")) body = await deps.store.overview(input);
  else if (path.endsWith("/finance/summary")) body = await deps.store.financeSummary(input);
  else if (path.endsWith("/finance/daily")) body = await deps.store.financeDaily(input);
  else if (path.endsWith("/finance/reconciliation")) body = await deps.store.reconciliation(input);
  else if (path.endsWith("/operations/daily")) body = await deps.store.operations(input);
  else body = await deps.store.subscriptions(input);
  if (path.endsWith("/subscriptions/summary") && (body.supported !== false || body.metrics !== null)) {
    throw new SubscriptionRefused();
  }
  return withPeriod(body, query.from, query.to, query.asOf);
}

function withPeriod(body: Record<string, unknown>, from: string, to: string, asOf: string): Record<string, unknown> {
  const warnings = Array.isArray(body.warnings) ? [...(body.warnings as string[])] : [];
  if (asOf < to && !warnings.includes("data_as_of is earlier than period.to")) {
    warnings.push("data_as_of is earlier than period.to");
  }
  return { ...body, period: period(from, to), warnings };
}

async function records(params: URLSearchParams, deps: BosDeps, generatedAt: string): Promise<Record<string, unknown>> {
  const from = readInstant(params.get("from"), "from", false);
  const to = readInstant(params.get("to"), "to", false);
  if ((from && !to) || (!from && to)) {
    throw new GuardError(400, "malformed_parameter", false, "from and to must be sent together.");
  }
  if (from && to) assertRange(from, to);
  rejectUnappliedFilters(params);
  const limit = readPageLimit(params.get("limit"));
  const binding = queryBinding(params);
  const wire = params.get("cursor");
  let snapshot: SnapshotRow;
  let after = "0";
  if (wire) {
    const cursor = decodeCursor(wire);
    if (!cursor) throw new GuardError(400, "malformed_parameter", false, "Cursor is malformed.");
    if (cursor.expires_at <= generatedAt) {
      throw new GuardError(410, "cursor_expired", false, "Cursor expired. Drop the cursor and bootstrap a new snapshot.", {
        drop_cursor: true,
        endpoint: RECORDS,
        reuse_original_from_to: true,
      });
    }
    if (
      cursor.project_id !== deps.projectId ||
      cursor.environment !== deps.environment ||
      cursor.endpoint !== RECORDS ||
      cursor.query_sha256 !== binding
    ) {
      throw new GuardError(422, "cursor_query_mismatch", false, "Cursor does not match this query.");
    }
    if (cursor.after_change_sequence === cursor.high_watermark) {
      snapshot = await deps.store.openSnapshot(generatedAt);
      after = cursor.high_watermark;
    } else {
      const existing = await deps.store.getSnapshot(cursor.snapshot_id);
      if (!existing) {
        throw new GuardError(410, "snapshot_expired", false, "Snapshot expired. Drop the cursor and bootstrap a new snapshot.", {
          drop_cursor: true,
          endpoint: RECORDS,
          reuse_original_from_to: true,
        });
      }
      snapshot = existing;
      after = cursor.after_change_sequence;
    }
  } else if (params.get("snapshot_id")) {
    const existing = await deps.store.getSnapshot(params.get("snapshot_id") as string);
    if (!existing) {
      throw new GuardError(410, "snapshot_expired", false, "Snapshot expired.", {
        drop_cursor: true,
        endpoint: RECORDS,
        reuse_original_from_to: true,
      });
    }
    snapshot = existing;
  } else {
    snapshot = await deps.store.openSnapshot(generatedAt);
  }
  const page = await deps.store.revisions({ snapshot, after, limit, from, to });
  if (page.conflict) throw new ExportConflict();
  return recordsPage({ rows: page.rows, limit, snapshot, binding, generatedAt, environment: deps.environment, now: deps.now() });
}

function recordsPage(input: {
  rows: Array<Record<string, unknown>>;
  limit: number;
  snapshot: SnapshotRow;
  binding: string;
  generatedAt: string;
  environment: BosEnvironment;
  now: Date;
}): Record<string, unknown> {
  const hasMore = input.rows.length > input.limit;
  const visible = hasMore ? input.rows.slice(0, input.limit) : input.rows;
  const expiry = cursorExpiry(input.now);
  const lastSequence = visible.length > 0 ? String(visible[visible.length - 1]?.change_sequence) : input.snapshot.highWatermark;
  const next = (after: string): string =>
    encodeCursor({
      v: 1,
      project_id: "smscode",
      environment: input.environment,
      endpoint: RECORDS,
      query_sha256: input.binding,
      snapshot_id: input.snapshot.snapshotId,
      high_watermark: input.snapshot.highWatermark,
      after_change_sequence: after,
      expires_at: expiry,
    });
  return {
    schema_version: "1.0.0",
    contract_version: "business-os.contract.v1",
    project_id: "smscode",
    environment: input.environment,
    snapshot_id: input.snapshot.snapshotId,
    generated_at: input.generatedAt,
    data_as_of: input.snapshot.dataAsOf,
    high_watermark: input.snapshot.highWatermark,
    query_binding_sha256: input.binding,
    records: visible,
    page: {
      limit: input.limit,
      has_more: hasMore,
      next_cursor: hasMore ? next(lastSequence) : null,
      cursor_expires_at: expiry,
      next_sync_checkpoint: hasMore ? null : next(input.snapshot.highWatermark),
    },
  };
}

async function analytics(params: URLSearchParams, deps: BosDeps, generatedAt: string): Promise<Record<string, unknown>> {
  const provider = params.get("provider");
  const report = params.get("report");
  if (!provider || !report) throw new GuardError(400, "missing_required_parameter", false, "Missing provider or report.");
  const known = knownReport(report);
  if (!known) throw new GuardError(422, "unsupported_dataset", false, "The report is not in the contract.");
  if (known.provider !== provider) throw new GuardError(422, "unsupported_dataset", false, "The provider does not own that report.");
  const query = readInterval(params, deps.now(), false);
  const limit = readPageLimit(params.get("limit"));
  let after = "0";
  let snapshotId: string | null = null;
  const wire = params.get("cursor");
  if (wire) {
    const cursor = decodeCursor(wire);
    if (!cursor) throw new GuardError(400, "malformed_parameter", false, "Cursor is malformed.");
    if (cursor.expires_at <= generatedAt) {
      throw new GuardError(410, "cursor_expired", false, "Cursor expired. Drop the cursor and bootstrap a new snapshot.", {
        drop_cursor: true,
        endpoint: ANALYTICS,
        reuse_original_from_to: true,
      });
    }
    if (
      cursor.project_id !== deps.projectId ||
      cursor.endpoint !== ANALYTICS ||
      cursor.query_sha256 !== queryBinding(params) ||
      cursor.environment !== deps.environment
    ) {
      throw new GuardError(422, "cursor_query_mismatch", false, "Cursor does not match this query.");
    }
    after = cursor.after_change_sequence;
    snapshotId = cursor.snapshot_id;
  }
  const page = await deps.store.analytics({
    provider,
    report,
    from: query.from,
    to: query.to,
    limit,
    after,
    asOf: generatedAt,
    snapshotId,
  });
  const meta = page.body.page;
  if (!meta || typeof meta !== "object" || Array.isArray(meta)) return page.body;
  const pageMeta = meta as { has_more?: boolean; next_cursor?: string | null };
  if (pageMeta.has_more) {
    const last = page.sequences[page.sequences.length - 1];
    if (!last || !/^[1-9][0-9]*$/.test(last) || !/^[1-9][0-9]*$/.test(page.highWatermark)) {
      throw new Error("analytics page could not be continued");
    }
    pageMeta.next_cursor = encodeCursor({
      v: 1,
      project_id: "smscode",
      environment: deps.environment,
      endpoint: ANALYTICS,
      query_sha256: queryBinding(params),
      snapshot_id: String(page.body.snapshot_id),
      high_watermark: page.highWatermark,
      after_change_sequence: last,
      expires_at: cursorExpiry(deps.now()),
    });
  }
  return page.body;
}

function finish(body: Record<string, unknown>, deps: BosDeps): Record<string, unknown> {
  return redactExport({
    ...body,
    project_id: "smscode",
    environment: deps.environment,
    generated_at: utcStamp(deps.now()),
  });
}

function resyncFor(path: string): Resync | undefined {
  if (path === RECORDS || path === ANALYTICS) {
    return { drop_cursor: true, endpoint: path, reuse_original_from_to: true };
  }
  return undefined;
}

function problem(
  status: number,
  code: string,
  message: string,
  retryable: boolean,
  retryAfter?: number,
  resync?: Resync,
): Response {
  const error: Record<string, unknown> = { code, message, retryable };
  if (resync) error.resync = resync;
  return json({ error }, status, retryAfter);
}

function json(body: unknown, status: number, retryAfter?: number): Response {
  const headers: Record<string, string> = { "cache-control": "private, no-store" };
  if (retryAfter) headers["retry-after"] = String(retryAfter);
  return Response.json(body, { status, headers });
}
