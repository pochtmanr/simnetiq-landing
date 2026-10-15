/* Delivery tiers for /support/sms-not-received, from public_delivery_tiers()
 * (sms-expo/supabase/migrations/20261015000000_public_delivery_tiers.sql).
 *
 * Anon key, hourly revalidation. Every failure — env not set, RPC not applied
 * yet, network — returns [] and the page simply leaves the lookup out: the
 * article must read correctly without it. */

export type DeliveryTier = "high" | "medium" | "low";

export interface DeliveryTierRow {
  service: string;
  serviceName: string;
  dial: number;
  iso2: string | null;
  countryName: string;
  tier: DeliveryTier;
  available: boolean;
}

const TIERS = new Set<DeliveryTier>(["high", "medium", "low"]);

export async function getDeliveryTiers(): Promise<DeliveryTierRow[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  try {
    const res = await fetch(`${url}/rest/v1/rpc/public_delivery_tiers`, {
      method: "POST",
      headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: "{}",
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(8_000),
    });
    if (!res.ok) return [];
    const rows = (await res.json()) as Array<Record<string, unknown>>;
    if (!Array.isArray(rows)) return [];
    return rows.flatMap((r) => {
      const tier = r.tier as DeliveryTier;
      if (typeof r.service_slug !== "string" || typeof r.country_dial !== "number" || !TIERS.has(tier)) return [];
      return [{
        service: r.service_slug,
        serviceName: typeof r.service_name === "string" ? r.service_name : r.service_slug,
        dial: r.country_dial,
        iso2: typeof r.country_iso2 === "string" ? r.country_iso2 : null,
        countryName: typeof r.country_name === "string" ? r.country_name : `+${r.country_dial}`,
        tier,
        available: r.available === true,
      }];
    });
  } catch {
    return [];
  }
}
