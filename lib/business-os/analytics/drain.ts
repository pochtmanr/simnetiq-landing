import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import type { AnalyticsWriter } from "./writer";
import { distinctVisitors, storeDrainEvents, type DrainEvent } from "./semantics";

export function drainBodySignature(raw: Buffer, secret: string): string {
  return createHmac("sha1", secret).update(raw).digest("hex");
}

export function drainSignatureMatches(raw: Buffer, secret: string, header: string | null): boolean {
  if (!header) return false;
  const expected = Buffer.from(drainBodySignature(raw, secret));
  const actual = Buffer.from(header);
  if (expected.length !== actual.length) return false;
  return timingSafeEqual(expected, actual);
}

export function parseDrainBody(raw: string): DrainEvent[] {
  const trimmed = raw.trim();
  if (!trimmed) return [];
  if (trimmed.startsWith("[")) {
    const parsed = JSON.parse(trimmed) as unknown;
    if (!Array.isArray(parsed)) throw new Error("drain body was not an array");
    return parsed.filter((item): item is DrainEvent => !!item && typeof item === "object");
  }
  return trimmed.split("\n").filter((line) => line.trim().length > 0).map((line) => JSON.parse(line) as DrainEvent);
}

export async function acceptDrain(input: {
  raw: string;
  sampledHeader: string | null;
  retryAttempt: number | null;
  deliveryId: string | null;
  receivedAt: string;
  writer: AnalyticsWriter;
}): Promise<{ stored: number; visitors: number | null }> {
  const events = parseDrainBody(input.raw);
  const headerSampled = input.sampledHeader !== null && input.sampledHeader !== "1" && input.sampledHeader !== "100";
  const stored = storeDrainEvents(events).map((event) => ({
    ...event,
    sampled: event.sampled || headerSampled,
  }));
  for (const [index, event] of stored.entries()) {
    const hash = createHash("sha256").update(`${index}:${input.raw}`, "utf8").digest("hex");
    await input.writer.recordDrain({
      receivedAt: input.receivedAt,
      path: event.path,
      eventTimestamp: event.eventTimestamp,
      eventType: event.eventType,
      sampled: event.sampled,
      retryAttempt: input.retryAttempt,
      deliveryId: input.deliveryId,
      visitorId: event.visitorId,
      payloadHash: hash,
      metadata: event.metadata,
    });
  }
  return { stored: stored.length, visitors: distinctVisitors(stored) };
}
