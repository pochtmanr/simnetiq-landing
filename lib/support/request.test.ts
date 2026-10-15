import { describe, expect, it } from "vitest";
import { meaningfulMessage, parseSupportRequest, storedMessage, type SupportPayload } from "./request";

const base = {
  name: "Alex",
  email: "alex@example.com",
  topic: "sms",
  message: "No SMS arrived for Telegram in Indonesia.",
};

const parse = (extra: Record<string, unknown> = {}) => parseSupportRequest({ ...base, ...extra }, "en");

describe("meaningfulMessage", () => {
  it("rejects blank, short and symbol-only messages", () => {
    expect(meaningfulMessage("")).toBe(false);
    expect(meaningfulMessage("help me")).toBe(false);
    expect(meaningfulMessage("??????????!!!!")).toBe(false);
    expect(meaningfulMessage("---\n\n\n---\n---")).toBe(false);
  });

  it("rejects a placeholder pasted back, in any locale and casing", () => {
    expect(meaningfulMessage("Tell us what happened.")).toBe(false);
    expect(meaningfulMessage("  tell us what happened  ")).toBe(false);
  });

  it("accepts a real message", () => {
    expect(meaningfulMessage("The code never came for WhatsApp.")).toBe(true);
    expect(meaningfulMessage("Код не пришёл для Telegram")).toBe(true);
  });
});

describe("parseSupportRequest", () => {
  it("maps a topic id to the English label and keeps the id", () => {
    const r = parse() as SupportPayload;
    expect(r.topicId).toBe("sms");
    expect(r.topic).toBe("SMS didn't arrive");
  });

  it("passes a legacy free-text topic through as 'other'", () => {
    const r = parse({ topic: "Billing & coins" }) as SupportPayload;
    expect(r.topicId).toBe("other");
    expect(r.topic).toBe("Billing & coins");
  });

  it("returns the localized error for an empty message", () => {
    expect(parse({ message: "   " })).toMatch(/at least 10 characters/);
  });

  it("keeps a valid account id and drops a forged one", () => {
    const ok = parse({ accountId: "12091425-68EC-4624-8eec-a320ff815e14" }) as SupportPayload;
    expect(ok.context.accountId).toBe("12091425-68ec-4624-8eec-a320ff815e14");
    const bad = parse({ accountId: "<script>" }) as SupportPayload;
    expect(bad.context.accountId).toBeUndefined();
  });

  it("drops an invalid app version and trims long fields", () => {
    const r = parse({ appVersion: "1.0.3 (6)\nX-Injected: 1", service: "x".repeat(200) }) as SupportPayload;
    expect(r.context.appVersion).toBeUndefined();
    expect(r.context.service).toHaveLength(80);
  });
});

describe("storedMessage", () => {
  it("adds a footer only when there is context", () => {
    const plain = parse() as SupportPayload;
    expect(storedMessage(plain)).toBe(base.message);
    const withCtx = parse({
      accountId: "12091425-68ec-4624-8eec-a320ff815e14",
      appVersion: "1.0.4 (7)",
      orderId: "MABC123",
    }) as SupportPayload;
    expect(storedMessage(withCtx)).toBe(
      `${base.message}\n\n---\nAccount ID: 12091425-68ec-4624-8eec-a320ff815e14\nApp: 1.0.4 (7)\nApple order ID: MABC123`,
    );
  });
});
