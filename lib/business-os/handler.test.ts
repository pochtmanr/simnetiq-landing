import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import Ajv from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { canonicalString, signHmac, bodySha256 } from "./hmac";
import { handleBusinessOs, type BosDeps } from "./handler";
import { MemoryNonceStore } from "./nonce";
import { MemoryExportStore, sampleRecord } from "./memory";
import type { BosKey } from "./keys";
import { decodeCursor, encodeCursor } from "./cursor";

const CONTRACT = "/Volumes/RomanSSD/Developer/simnetiq.store/contracts/business-os/v1/schemas";
const SECRET = "test-secret-do-not-use-in-production";
const KEY: BosKey = {
  keyId: "bos_test_smscode_production_v1",
  secret: SECRET,
  projectId: "smscode",
  environment: "production",
  status: "active",
};
const NOW = new Date("2026-09-28T12:00:00Z");
const FROM = "2026-09-26T23:00:00Z";
const TO = "2026-09-27T23:00:00Z";

function validator() {
  const ajv = new Ajv({ allErrors: true, strict: false, strictRequired: false, validateSchema: false });
  addFormats(ajv);
  for (const name of readdirSync(CONTRACT).filter((file) => file.endsWith(".json"))) {
    ajv.addSchema(JSON.parse(readFileSync(join(CONTRACT, name), "utf8")));
  }
  return ajv;
}

function signed(path: string, nonce: string, key: BosKey = KEY, body = "", origin = "https://export.test"): Request {
  const timestamp = String(Math.floor(NOW.getTime() / 1000));
  const canonical = canonicalString({
    method: "GET",
    requestTarget: path,
    timestamp,
    nonce,
    bodySha256: bodySha256(body),
  });
  return new Request(`${origin}${path}`, {
    method: "GET",
    body: body.length > 0 ? body : undefined,
    headers: {
      "X-BOS-Key-Id": key.keyId,
      "X-BOS-Timestamp": timestamp,
      "X-BOS-Nonce": nonce,
      "X-BOS-Signature": signHmac(key.secret, canonical),
    },
  });
}

function harness(store = new MemoryExportStore()): { deps: BosDeps; store: MemoryExportStore } {
  return {
    store,
    deps: {
      store,
      nonceStore: new MemoryNonceStore(),
      keys: [KEY],
      now: () => NOW,
      environment: "production",
      projectId: "smscode",
      testTransport: true,
      rateLimit: 60,
      cache: new Map(),
    },
  };
}

describe("hmac vectors", () => {
  it("matches the frozen empty-body health vector", () => {
    const canonical =
      "GET\n/api/business-os/v1/health\n1759017600\nnonce-health-0001\ne3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
    expect(signHmac(SECRET, canonical)).toBe("8dc751a41ba6d4cd5bdf4cb05713f13bf1828714e53f02b3996c99f5533b5aab");
    expect(bodySha256("")).toBe("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
    expect(bodySha256("{}")).toBe("44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a");
  });
});

describe("export api", () => {
  const ajv = validator();

  async function ok(path: string, nonce: string, schema: string, deps = harness().deps) {
    const response = await handleBusinessOs(signed(path, nonce), deps);
    expect(response.status, await response.clone().text()).toBe(200);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    const body = await response.json();
    const validate = ajv.getSchema(`https://simnetiq.store/contracts/business-os/v1/schemas/responses.json#/$defs/${schema}`);
    expect(validate, schema).toBeTruthy();
    const valid = validate?.(body);
    expect(valid, JSON.stringify(validate?.errors, null, 2)).toBe(true);
    return body;
  }

  it("validates every route against the frozen schemas", async () => {
    const { deps } = harness();
    const q = `from=${FROM}&to=${TO}&basis=sms_legacy`;
    await ok("/api/business-os/v1/capabilities", "nonce-schema-cap-01", "capabilities", deps);
    await ok(`/api/business-os/v1/overview?${q}`, "nonce-schema-over01", "overview", deps);
    await ok(`/api/business-os/v1/finance/summary?${q}`, "nonce-schema-sum-01", "financeSummary", deps);
    await ok(`/api/business-os/v1/finance/daily?${q}`, "nonce-schema-day-01", "financeDaily", deps);
    await ok(`/api/business-os/v1/finance/records?${q}`, "nonce-schema-rec-01", "recordsPage", deps);
    await ok(`/api/business-os/v1/finance/balances?as_of=${TO}`, "nonce-schema-bal-01", "financeBalances", deps);
    await ok(`/api/business-os/v1/finance/reconciliation?${q}`, "nonce-schema-recon1", "financeReconciliation", deps);
    await ok(`/api/business-os/v1/operations/daily?from=${FROM}&to=${TO}`, "nonce-schema-ops-01", "operationsDaily", deps);
    await ok(`/api/business-os/v1/subscriptions/summary?from=${FROM}&to=${TO}`, "nonce-schema-sub-01", "subscriptionsSummary", deps);
    await ok(
      `/api/business-os/v1/analytics/report?provider=ga4&report=ga4_overview_daily&from=${FROM}&to=${TO}`,
      "nonce-schema-an-001",
      "analyticsReport",
      deps,
    );
    await ok("/api/business-os/v1/health", "nonce-schema-hlth01", "health", deps);
  });

  it("keeps subscriptions unsupported and analytics empty", async () => {
    const { deps } = harness();
    const subscriptions = await ok(
      `/api/business-os/v1/subscriptions/summary?from=${FROM}&to=${TO}`,
      "nonce-sub-unsupported1",
      "subscriptionsSummary",
      deps,
    );
    expect(subscriptions.supported).toBe(false);
    expect(subscriptions.metrics).toBeNull();
    expect(JSON.stringify(subscriptions)).not.toContain('"mrr"');
    const analytics = await ok(
      `/api/business-os/v1/analytics/report?provider=ga4&report=ga4_overview_daily&from=${FROM}&to=${TO}`,
      "nonce-analytics-empty1",
      "analyticsReport",
      deps,
    );
    expect(analytics.availability).toBe("unsupported");
    expect(analytics.rows).toEqual([]);
    expect(analytics.period.timezone).toBe("Europe/London");
  });

  it("exports stored analytics separately from the primary visitor", async () => {
    const store = new MemoryExportStore();
    store.catalog = {
      datasets: {
        ga4_overview_daily: false,
        ga4_breakdown: false,
        ga4_period_unique_users: true,
        gsc_daily_totals: false,
        gsc_dimension_rows: true,
        vercel_daily: false,
      },
      configuredSources: ["ga4", "gsc"],
    };
    store.reports.set("ga4\0ga4_period_unique_users", {
      rows: [{ active_users: 15 }],
      dataState: "final",
      availability: "available",
      sourceTimezone: "Europe/London",
      completePropertyTotal: true,
      limitations: ["Period activeUsers come from one query. Do not sum daily or country rows."],
    });
    store.reports.set("gsc\0gsc_dimension_rows", {
      rows: [{ query: "sms", clicks: 2, impressions: 20, ctr: "0.1", position: "8.5" }],
      dataState: "partial",
      availability: "available",
      sourceTimezone: "America/Los_Angeles",
      completePropertyTotal: false,
      limitations: ["Dimension rows overlap, omit data, and are not the property total. Dates stay in America/Los_Angeles."],
    });
    const { deps } = harness(store);
    const capabilities = await ok("/api/business-os/v1/capabilities", "nonce-analytics-cap01", "capabilities", deps);
    expect(capabilities.formula_versions).toContain("sms-analytics-v1");
    expect(capabilities.datasets.analytics.ga4_period_unique_users).toBe(true);
    expect(capabilities.datasets.analytics.ga4_overview_daily).toBe(false);
    expect(capabilities.configured_sources).toEqual(["revenuecat", "onlinesim", "ga4", "gsc"]);
    const overview = await ok(
      `/api/business-os/v1/overview?from=${FROM}&to=${TO}&basis=sms_legacy`,
      "nonce-analytics-over1",
      "overview",
      deps,
    );
    expect(overview.traffic_highlights[0]).toMatchObject({
      provider: "vercel",
      metric: "primary_visitors",
      value: null,
      quality: "unavailable",
      reason: "primary_visitor_unconfigured",
    });
    const period = await ok(
      `/api/business-os/v1/analytics/report?provider=ga4&report=ga4_period_unique_users&from=${FROM}&to=${TO}`,
      "nonce-analytics-uniq1",
      "analyticsReport",
      deps,
    );
    expect(period.rows).toEqual([{ active_users: 15 }]);
    expect(period.must_not_sum_daily_uniques).toBe(true);
    const dimensions = await ok(
      `/api/business-os/v1/analytics/report?provider=gsc&report=gsc_dimension_rows&from=${FROM}&to=${TO}`,
      "nonce-analytics-gsc01",
      "analyticsReport",
      deps,
    );
    expect(dimensions.page.complete_property_total).toBe(false);
    expect(dimensions.source_timezone).toBe("America/Los_Angeles");
    expect(dimensions.period.timezone).toBe("America/Los_Angeles");
    for (const file of [
      "analytics-unconfigured.synthetic.json",
      "analytics-ga4-period.synthetic.json",
      "analytics-gsc-dimension.synthetic.json",
      "analytics-vercel-sampled.synthetic.json",
    ]) {
      const fixture = JSON.parse(readFileSync(join(process.cwd(), "docs/business-os/fixtures", file), "utf8"));
      const validate = ajv.getSchema("https://simnetiq.store/contracts/business-os/v1/schemas/responses.json#/$defs/analyticsReport");
      expect(validate?.(fixture), JSON.stringify(validate?.errors)).toBe(true);
    }
  });

  it("rejects revoked, replayed, wrong-project and wrong-environment keys", async () => {
    const { deps } = harness();
    const revoked: BosKey = { ...KEY, keyId: "revoked-key-000001", status: "revoked" };
    const otherProject: BosKey = { ...KEY, keyId: "other-project-0001", projectId: "doppler" };
    const staging: BosKey = { ...KEY, keyId: "staging-key-000001", environment: "staging" };
    deps.keys = [KEY, revoked, otherProject, staging];

    const denied = async (key: BosKey, nonce: string) => {
      const response = await handleBusinessOs(signed("/api/business-os/v1/health", nonce, key), deps);
      return response.status === 403 ? ((await response.json()) as { error: { code: string } }).error.code : response.status;
    };
    expect(await denied(revoked, "nonce-revoked-00001")).toBe("key_revoked");
    expect(await denied(otherProject, "nonce-project-00001")).toBe("project_mismatch");
    expect(await denied(staging, "nonce-environ-00001")).toBe("environment_mismatch");

    const first = await handleBusinessOs(signed("/api/business-os/v1/health", "nonce-replay-000001"), deps);
    expect(first.status).toBe(200);
    const replay = await handleBusinessOs(signed("/api/business-os/v1/health", "nonce-replay-000001"), deps);
    expect(replay.status).toBe(403);
    expect(((await replay.json()) as { error: { code: string } }).error.code).toBe("nonce_replayed");
  });

  it("requires TLS for a production deployment and a fresh nonce after a bad signature", async () => {
    const { deps } = harness();
    deps.testTransport = false;
    const response = await handleBusinessOs(
      signed("/api/business-os/v1/health", "nonce-plain-http-01", KEY, "", "http://export.test"),
      deps,
    );
    expect(response.status).toBe(403);
    deps.testTransport = true;
    const bad = signed("/api/business-os/v1/health", "nonce-bad-sign-0001");
    bad.headers.set("x-bos-signature", "a".repeat(64));
    const invalid = await handleBusinessOs(bad, deps);
    expect(((await invalid.json()) as { error: { code: string } }).error.code).toBe("invalid_signature");
    const again = await handleBusinessOs(signed("/api/business-os/v1/health", "nonce-bad-sign-0001"), deps);
    expect(((await again.json()) as { error: { code: string } }).error.code).toBe("nonce_replayed");
  });

  it("rejects a non-empty GET body after the signature matches", async () => {
    const { deps } = harness();
    const path = "/api/business-os/v1/health";
    const nonce = "nonce-body-00000001";
    const timestamp = String(Math.floor(NOW.getTime() / 1000));
    const canonical = canonicalString({
      method: "GET",
      requestTarget: path,
      timestamp,
      nonce,
      bodySha256: bodySha256("{}"),
    });
    const request = {
      url: `https://export.test${path}`,
      method: "GET",
      headers: new Headers({
        "X-BOS-Key-Id": KEY.keyId,
        "X-BOS-Timestamp": timestamp,
        "X-BOS-Nonce": nonce,
        "X-BOS-Signature": signHmac(KEY.secret, canonical),
      }),
      arrayBuffer: async () => new TextEncoder().encode("{}"),
    } as unknown as Request;
    const response = await handleBusinessOs(request, deps);
    expect(response.status).toBe(400);
    expect(((await response.json()) as { error: { code: string } }).error.code).toBe("unexpected_body");
  });

  it("freezes a page, hides a later correction, then resumes after the checkpoint", async () => {
    const store = new MemoryExportStore();
    store.records = [
      sampleRecord({ sequence: "1", recordId: "sms-sale-1", revision: 1, amount: "10" }),
      sampleRecord({ sequence: "2", recordId: "sms-sale-2", revision: 1, amount: "4" }),
    ];
    const { deps } = harness(store);
    const first = await handleBusinessOs(
      signed(`/api/business-os/v1/finance/records?from=${FROM}&to=${TO}&limit=1`, "nonce-page-00000001"),
      deps,
    );
    const page = await first.json();
    expect(page.records).toHaveLength(1);
    expect(page.page.has_more).toBe(true);
    expect(page.high_watermark).toBe("2");
    const cursor = page.page.next_cursor as string;
    store.records.push(sampleRecord({ sequence: "3", recordId: "sms-sale-1", revision: 2, amount: "12" }));
    const second = await handleBusinessOs(
      signed(`/api/business-os/v1/finance/records?from=${FROM}&to=${TO}&limit=1&cursor=${encodeURIComponent(cursor)}`, "nonce-page-00000002"),
      deps,
    );
    const rest = await second.json();
    expect(rest.records.map((row: { record_id: string; revision: number }) => `${row.record_id}:${row.revision}`)).toEqual(["sms-sale-2:1"]);
    expect(rest.high_watermark).toBe("2");
    const checkpoint = rest.page.next_sync_checkpoint as string;
    const advanced = await handleBusinessOs(
      signed(
        `/api/business-os/v1/finance/records?from=${FROM}&to=${TO}&limit=10&cursor=${encodeURIComponent(checkpoint)}`,
        "nonce-page-00000003",
      ),
      deps,
    );
    const next = await advanced.json();
    expect(next.high_watermark).toBe("3");
    expect(next.records.map((row: { revision: number }) => row.revision)).toContain(2);
    expect(decodeCursor(checkpoint)?.after_change_sequence).toBe("2");
  });

  it("returns the same frozen page to two concurrent callers", async () => {
    const { deps } = harness();
    const path = `/api/business-os/v1/finance/records?from=${FROM}&to=${TO}`;
    const [left, right] = await Promise.all([
      handleBusinessOs(signed(path, "nonce-conc-00000001"), deps),
      handleBusinessOs(signed(path, "nonce-conc-00000002"), deps),
    ]);
    const a = await left.json();
    const b = await right.json();
    expect(a.high_watermark).toBe(b.high_watermark);
    expect(a.snapshot_id).not.toBe(b.snapshot_id);
    const again = await handleBusinessOs(
      signed(`${path}&snapshot_id=${a.snapshot_id}`, "nonce-conc-00000003"),
      deps,
    );
    const frozen = await again.json();
    expect(frozen.snapshot_id).toBe(a.snapshot_id);
    expect(frozen.records).toEqual(a.records);
  });

  it("returns 410 for an expired cursor and 503 when one revision has two hashes", async () => {
    const { deps, store } = harness();
    const expiredCursor = encodeCursor({
      v: 1,
      project_id: "smscode",
      environment: "production",
      endpoint: "/api/business-os/v1/finance/records",
      query_sha256: "0".repeat(64),
      snapshot_id: "snap-old",
      high_watermark: "1",
      after_change_sequence: "0",
      expires_at: "2020-01-01T00:00:00Z",
    });
    const expired = await handleBusinessOs(
      signed(`/api/business-os/v1/finance/records?cursor=${encodeURIComponent(expiredCursor)}`, "nonce-expired-00001"),
      deps,
    );
    expect(expired.status).toBe(410);
    const expiredBody = await expired.json();
    expect(expiredBody.error.code).toBe("cursor_expired");
    expect(expiredBody.error.resync.drop_cursor).toBe(true);
    expect(expiredBody.records).toBeUndefined();

    store.records = [
      sampleRecord({ sequence: "1", contentHash: "a".repeat(64) }),
      sampleRecord({ sequence: "2", contentHash: "b".repeat(64) }),
    ];
    store.conflict = false;
    store.records[0] = sampleRecord({ sequence: "1", contentHash: "a".repeat(64) });
    store.records.push(sampleRecord({ sequence: "2", revision: 1, contentHash: "c".repeat(64) }));
    const conflict = await handleBusinessOs(
      signed(`/api/business-os/v1/finance/records?from=${FROM}&to=${TO}`, "nonce-conflict-0001"),
      deps,
    );
    expect(conflict.status).toBe(503);
    const conflictBody = await conflict.json();
    expect(conflictBody.error.code).toBe("temporary_unavailable");
    expect(conflictBody.records).toBeUndefined();
  });

  it("strips email and phone fields", async () => {
    const store = new MemoryExportStore();
    store.records = [sampleRecord({ sequence: "1" })];
    store.records[0]?.document && (store.records[0].document.customer_email = "person@example.com");
    store.records[0]?.document && (store.records[0].document.phone = "+15551212");
    const { deps } = harness(store);
    const response = await handleBusinessOs(signed("/api/business-os/v1/finance/records", "nonce-redact-000001"), deps);
    const body = await response.json();
    expect(JSON.stringify(body)).not.toContain("example.com");
    expect(JSON.stringify(body)).not.toContain("+15551212");
  });

  it("rate limits a key and keeps the native USD gross", async () => {
    const { deps } = harness();
    deps.rateLimit = 1;
    const first = await handleBusinessOs(signed("/api/business-os/v1/health", "nonce-rate-00000001"), deps);
    expect(first.status).toBe(200);
    const limited = await handleBusinessOs(signed("/api/business-os/v1/health", "nonce-rate-00000002"), deps);
    expect(limited.status).toBe(429);
    expect(limited.headers.get("retry-after")).toBe("60");
    const summary = await handleBusinessOs(
      signed(`/api/business-os/v1/finance/summary?from=${FROM}&to=${TO}&basis=sms_legacy`, "nonce-usd-gross-0001"),
      { ...deps, rateLimit: 60, nonceStore: new MemoryNonceStore() },
    );
    const body = await summary.json();
    expect(body.native_currency_subtotals[0].metrics.gross_customer_sales.amount).toBe("12.50");
    expect(body.native_currency_subtotals[0].currency).toBe("USD");
    expect(body.metrics.gross_customer_sales.amount).toBeNull();
  });
});
