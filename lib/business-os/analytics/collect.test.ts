import { createHash, generateKeyPairSync } from "node:crypto";
import { describe, expect, it } from "vitest";
import { collectAnalytics, type CollectEnv } from "./collect";
import { googleAccessToken } from "./google";
import { acceptDrain, drainBodySignature } from "./drain";
import { handleAnalyticsCollect, handleAnalyticsDrain } from "./http";
import type { AnalyticsWriter, CommitRowInput, SourceUpdate } from "./writer";

function writer(): AnalyticsWriter & { sources: SourceUpdate[]; rows: CommitRowInput[]; drains: number } {
  const sources: SourceUpdate[] = [];
  const rows: CommitRowInput[] = [];
  let drains = 0;
  let queued = false;
  return {
    sources,
    rows,
    get drains() { return drains; },
    async setSource(input) { sources.push(input); },
    async enqueue() { queued = true; return "job-1"; },
    async lease() {
      if (!queued) return null;
      queued = false;
      return {
        jobId: "job-1",
        provider: "ga4",
        report: "ga4_overview_daily",
        windowFrom: "2026-09-21",
        windowTo: "2026-09-28",
        attempts: 1,
        overlapDays: 7,
      };
    },
    async complete() {},
    async fail() {},
    async commitRow(input) { rows.push(input); return rows.length; },
    async recordDrain() { drains += 1; return drains; },
    async rollupVercel() { return 1; },
  };
}

const NOW = new Date("2026-09-28T12:00:00Z");

describe("analytics collection", () => {
  it("leaves GA and Search Console unconfigured without calling them", async () => {
    const store = writer();
    let gaCalls = 0;
    let gscCalls = 0;
    const result = await collectAnalytics({
      now: NOW,
      env: {},
      writer: store,
      clients: {
        ga: async () => { gaCalls += 1; return { rows: [], rowCount: 0, otherRow: false, sampled: false }; },
        gsc: async () => { gscCalls += 1; return { rows: [], responseAggregationType: null, firstIncompleteDate: null }; },
      },
    });
    expect(result).toMatchObject({ ga4: "unconfigured", gsc: "unconfigured", vercel: "unconfigured" });
    expect(gaCalls).toBe(0);
    expect(gscCalls).toBe(0);
    expect(store.sources.map((source) => source.reason)).toEqual([
      "provider_not_configured",
      "provider_not_configured",
      "provider_not_configured",
    ]);
  });

  it("does not call GA when the property timezone is missing", async () => {
    const store = writer();
    let gaCalls = 0;
    const env: CollectEnv = {
      gaPropertyId: "123",
      gaClientEmail: "collector@example.com",
      gaPrivateKey: "not-a-real-key",
    };
    const result = await collectAnalytics({
      now: NOW,
      env,
      writer: store,
      clients: { ga: async () => { gaCalls += 1; throw new Error("should not run"); } },
    });
    expect(result.ga4).toBe("property_timezone_unconfigured");
    expect(gaCalls).toBe(0);
  });

  it("stores a separate period unique and recomputed Search Console CTR", async () => {
    const store = writer();
    const env: CollectEnv = {
      gaPropertyId: "123",
      gaPropertyTimezone: "Europe/London",
      gaClientEmail: "collector@example.com",
      gaPrivateKey: "not-a-real-key",
      gscProperty: "sc-domain:example.test",
    };
    await collectAnalytics({
      now: NOW,
      env,
      writer: store,
      clients: {
        ga: async (request) => {
          if (request.dimensions.length === 0) {
            return { rows: [{ dimensions: [], metrics: ["15"] }], rowCount: 1, otherRow: false, sampled: false };
          }
          if (request.dimensions.length === 1) {
            return {
              rows: [
                { dimensions: ["20260926"], metrics: ["10", "1", "11", "12"] },
                { dimensions: ["20260927"], metrics: ["11", "1", "12", "13"] },
              ],
              rowCount: 2,
              otherRow: false,
              sampled: false,
            };
          }
          return {
            rows: [{ dimensions: ["20260927", "/pricing"], metrics: ["4", "5", "6"] }],
            rowCount: 1,
            otherRow: false,
            sampled: false,
          };
        },
        gsc: async (request) => ({
          rows: request.dimensions[0] === "date"
            ? [{ keys: ["2026-09-27"], clicks: 10, impressions: 40, position: 4.2 }]
            : [{ keys: ["sms"], clicks: 2, impressions: 20, position: 8 }],
          responseAggregationType: request.aggregationType,
          firstIncompleteDate: "2026-09-27",
        }),
      },
    });
    const period = store.rows.find((row) => row.report === "ga4_period_unique_users");
    const daily = store.rows.filter((row) => row.report === "ga4_overview_daily");
    expect(period?.payload).toMatchObject({ active_users: 15 });
    expect(daily.map((row) => row.payload.active_users)).toEqual([10, 11]);
    const total = store.rows.find((row) => row.report === "gsc_daily_totals");
    expect(total?.payload).toMatchObject({ ctr: "0.25", position: "4.2", date: "2026-09-27" });
    expect(total?.dataState).toBe("partial");
    expect(total?.complete).toBe(true);
    const dimension = store.rows.find((row) => row.report === "gsc_dimension_rows");
    expect(dimension?.complete).toBe(false);
  });

  it("signs a Google token without sending the private key back", async () => {
    const { privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
    const pem = privateKey.export({ type: "pkcs8", format: "pem" }).toString();
    let seen = "";
    const token = await googleAccessToken({
      clientEmail: "collector@example.com",
      privateKey: pem,
      scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
      now: NOW,
      fetchImpl: async (_url, init) => {
        seen = String(init?.body);
        return new Response(JSON.stringify({ access_token: "token-1" }), { status: 200 });
      },
    });
    expect(token).toBe("token-1");
    expect(decodeURIComponent(seen)).toContain("urn:ietf:params:oauth:grant-type:jwt-bearer");
    expect(seen).not.toContain("BEGIN PRIVATE KEY");
  });

  it("keeps two identical drain events and reports no visitors when sampled", async () => {
    const store = writer();
    const raw = JSON.stringify([
      { schema: "vercel.analytics.v2", eventType: "pageview", timestamp: Date.parse("2026-09-28T10:00:00Z"), path: "/pricing", deviceId: 7, sampled: true },
      { schema: "vercel.analytics.v2", eventType: "pageview", timestamp: Date.parse("2026-09-28T10:00:00Z"), path: "/pricing", deviceId: 7, sampled: true },
    ]);
    const secret = "drain-test-secret";
    expect(drainBodySignature(Buffer.from(raw), secret)).toHaveLength(40);
    const accepted = await acceptDrain({
      raw,
      sampledHeader: null,
      retryAttempt: 2,
      deliveryId: "delivery-1",
      receivedAt: "2026-09-28T12:00:00Z",
      writer: store,
    });
    expect(accepted.stored).toBe(2);
    expect(accepted.visitors).toBeNull();
    expect(store.drains).toBe(2);
    expect(createHash("sha256").update("x").digest("hex")).toHaveLength(64);
  });

  it("keeps the drain closed until its secret is configured", async () => {
    const closed = await handleAnalyticsDrain(new Request("https://sms.example/drain", { method: "POST", body: "[]" }), {
      now: NOW,
      secret: null,
      writer: writer(),
    });
    expect(closed.status).toBe(503);
    expect(await closed.json()).toMatchObject({ code: "drain_not_configured" });

    const denied = await handleAnalyticsCollect(new Request("https://sms.example/collect"), {
      now: NOW,
      env: {},
      writer: null,
      cronSecret: null,
    });
    expect(denied.status).toBe(503);
  });
});
