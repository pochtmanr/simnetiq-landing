import { describe, expect, it } from "vitest";
import {
  clicksImpressionsCtr,
  distinctVisitors,
  gscDataState,
  mapGscRow,
  periodUniqueActiveUsers,
  sourceDayBounds,
  storeDrainEvents,
} from "./semantics";

describe("analytics semantics", () => {
  it("recomputes CTR and keeps each row position", () => {
    expect(clicksImpressionsCtr(10, 40)).toBe("0.25");
    expect(clicksImpressionsCtr(12, 40)).toBe("0.3");
    expect(clicksImpressionsCtr(2, 20)).toBe("0.1");
    expect(clicksImpressionsCtr(1, 0)).toBeNull();
    const rows = [
      mapGscRow({ date: "2099-01-15", clicks: 10, impressions: 40, position: 1, searchType: "web", aggregationType: "byProperty" }),
      mapGscRow({ date: "2099-01-15", clicks: 1, impressions: 10, position: 9, searchType: "web", aggregationType: "byProperty" }),
    ];
    expect(rows.map((row) => row?.ctr)).toEqual(["0.25", "0.1"]);
    expect(rows.map((row) => row?.position)).toEqual(["1", "9"]);
  });

  it("does not sum daily active users into a period unique", () => {
    const daily = [10, 11];
    expect(daily.reduce((sum, value) => sum + value, 0)).toBe(21);
    expect(periodUniqueActiveUsers(15)).toBe(15);
    expect(periodUniqueActiveUsers(null)).toBeNull();
  });

  it("keeps Pacific days off London midnights and uses the incomplete-date signal", () => {
    expect(sourceDayBounds("2099-01-15", "America/Los_Angeles")).toEqual({
      start: "2099-01-15T08:00:00Z",
      end: "2099-01-16T08:00:00Z",
    });
    expect(sourceDayBounds("2026-09-27", "America/Los_Angeles").start).toBe("2026-09-27T07:00:00Z");
    expect(sourceDayBounds("2026-09-27", "Europe/London").start).toBe("2026-09-26T23:00:00Z");
    expect(gscDataState({
      sourceDate: "2099-01-15",
      firstIncompleteDate: "2099-01-14",
      overlapStart: "2099-01-01",
    })).toBe("partial");
    expect(gscDataState({
      sourceDate: "2099-01-13",
      firstIncompleteDate: "2099-01-14",
      overlapStart: "2099-01-01",
    })).toBe("final");
    expect(gscDataState({
      sourceDate: "2099-01-10",
      firstIncompleteDate: null,
      overlapStart: "2099-01-08",
    })).toBe("partial");
    expect(gscDataState({
      sourceDate: "2099-01-07",
      firstIncompleteDate: null,
      overlapStart: "2099-01-08",
    })).toBe("final");
  });

  it("keeps identical drain events and omits visitors when sampling or identity is missing", () => {
    const stored = storeDrainEvents([
      { path: "/pricing", timestamp: Date.parse("2099-06-10T12:00:00Z"), eventType: "pageview", deviceId: 7, sampled: true },
      { path: "/pricing", timestamp: Date.parse("2099-06-10T12:00:00Z"), eventType: "pageview", deviceId: 7, sampled: true },
    ]);
    expect(stored).toHaveLength(2);
    expect(stored[0]?.visitorId).toBeNull();
    expect(distinctVisitors(stored)).toBeNull();
    const identified = storeDrainEvents([
      { path: "/a", timestamp: Date.parse("2099-06-10T12:00:00Z"), eventType: "pageview", visitorId: "visitor-a" },
      { path: "/a", timestamp: Date.parse("2099-06-10T12:00:00Z"), eventType: "pageview", visitorId: "visitor-a" },
    ]);
    expect(distinctVisitors(identified)).toBe(1);
  });
});
