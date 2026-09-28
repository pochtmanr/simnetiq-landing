import { timingSafeEqual } from "node:crypto";
import { collectAnalytics, collectEnvFromProcess, type CollectEnv } from "./collect";
import { acceptDrain, drainSignatureMatches, parseDrainBody } from "./drain";
import { gaScopes, googleAccessToken, gscScopes, querySearchAnalytics, runGaReport, type GaReportRequest, type GscQueryRequest } from "./google";
import { sourceToday } from "./semantics";
import { analyticsWriterFromEnv, type AnalyticsWriter } from "./writer";

function bearer(request: Request): string {
  const header = request.headers.get("authorization") ?? "";
  return header.startsWith("Bearer ") ? header.slice("Bearer ".length) : "";
}

function secretMatches(token: string, secret: string): boolean {
  const left = Buffer.from(token);
  const right = Buffer.from(secret);
  if (left.length !== right.length || left.length === 0) return false;
  return timingSafeEqual(left, right);
}

export async function handleAnalyticsCollect(request: Request, input: {
  now: Date;
  env: CollectEnv;
  writer: AnalyticsWriter | null;
  cronSecret: string | null;
  collect?: typeof collectAnalytics;
}): Promise<Response> {
  if (!input.cronSecret) {
    return Response.json({ code: "collector_not_configured" }, { status: 503, headers: { "cache-control": "private, no-store" } });
  }
  if (!secretMatches(bearer(request), input.cronSecret)) {
    return Response.json({ code: "invalid_signature" }, { status: 403, headers: { "cache-control": "private, no-store" } });
  }
  if (!input.writer) {
    return Response.json({ code: "writer_unconfigured" }, { status: 503, headers: { "cache-control": "private, no-store" } });
  }
  const result = await (input.collect ?? collectAnalytics)({
    now: input.now,
    env: input.env,
    writer: input.writer,
    clients: liveClients(input.env, input.now),
  });
  return Response.json(result, { status: 200, headers: { "cache-control": "private, no-store" } });
}

function liveClients(env: CollectEnv, now: Date): {
  ga?: (request: GaReportRequest) => ReturnType<typeof runGaReport>;
  gsc?: (request: GscQueryRequest) => ReturnType<typeof querySearchAnalytics>;
} {
  const email = env.gaClientEmail;
  const privateKey = env.gaPrivateKey;
  return {
    ga: env.gaPropertyId && env.gaPropertyTimezone && email && privateKey
      ? async (request) => runGaReport({
          ...request,
          accessToken: await googleAccessToken({ clientEmail: email, privateKey, scopes: gaScopes(), now }),
        })
      : undefined,
    gsc: env.gscProperty && email && privateKey
      ? async (request) => querySearchAnalytics({
          ...request,
          accessToken: await googleAccessToken({ clientEmail: email, privateKey, scopes: gscScopes(), now }),
        })
      : undefined,
  };
}

export async function handleAnalyticsDrain(request: Request, input: {
  now: Date;
  secret: string | null;
  writer: AnalyticsWriter | null;
}): Promise<Response> {
  const verify = request.headers.get("x-vercel-verify");
  if (!input.secret || !input.writer) {
    return Response.json({ code: "drain_not_configured" }, { status: 503, headers: { "cache-control": "private, no-store" } });
  }
  if (verify && !request.headers.get("x-vercel-signature")) {
    return new Response(null, { status: 200, headers: { "x-vercel-verify": verify, "cache-control": "private, no-store" } });
  }
  const raw = await request.text();
  if (!drainSignatureMatches(Buffer.from(raw), input.secret, request.headers.get("x-vercel-signature"))) {
    return Response.json({ code: "invalid_signature" }, { status: 403, headers: { "cache-control": "private, no-store" } });
  }
  const receivedAt = input.now.toISOString().replace(/\.\d{3}Z$/, "Z");
  const retry = Number(request.headers.get("x-vercel-delivery-attempt"));
  const accepted = await acceptDrain({
    raw,
    sampledHeader: request.headers.get("x-vercel-sampling-rate"),
    retryAttempt: Number.isInteger(retry) ? retry : null,
    deliveryId: request.headers.get("x-vercel-id"),
    receivedAt,
    writer: input.writer,
  });
  const days = new Set(parseDrainBody(raw).map((event) => (
    typeof event.timestamp === "number" ? sourceToday(new Date(event.timestamp), "Europe/London") : null
  )).filter((day): day is string => !!day));
  for (const day of days) await input.writer.rollupVercel(day, "Europe/London", receivedAt);
  await input.writer.setSource({
    provider: "vercel",
    configured: true,
    syncStatus: "ok",
    reason: null,
    timezone: "Europe/London",
    syncedAt: receivedAt,
    coveredThrough: receivedAt,
  });
  return Response.json(
    { stored: accepted.stored, visitors: accepted.visitors },
    { status: 200, headers: { "cache-control": "private, no-store" } },
  );
}

export function collectHandlerDeps(): {
  now: Date;
  env: CollectEnv;
  writer: AnalyticsWriter | null;
  cronSecret: string | null;
} {
  return {
    now: new Date(),
    env: collectEnvFromProcess(),
    writer: analyticsWriterFromEnv(),
    cronSecret: process.env.BOS_ANALYTICS_CRON_SECRET || process.env.CRON_SECRET || null,
  };
}

export function drainHandlerDeps(): { now: Date; secret: string | null; writer: AnalyticsWriter | null } {
  return {
    now: new Date(),
    secret: process.env.VERCEL_WEB_ANALYTICS_DRAIN_SECRET || null,
    writer: analyticsWriterFromEnv(),
  };
}
