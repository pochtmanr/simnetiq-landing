"use client";

import { useMemo, useState } from "react";
import type { SupportDict } from "../lib/content/ui";
import type { Locale } from "../lib/i18n";
import type { DeliveryTier, DeliveryTierRow } from "../lib/support/deliveryTiers";

type Labels = SupportDict["help"]["tiers"];

const TIER_ORDER: Record<DeliveryTier, number> = { high: 0, medium: 1, low: 2 };
const TIER_CLASS: Record<DeliveryTier, string> = {
  high: "bg-good-soft text-good",
  medium: "bg-warn-soft text-warn",
  low: "bg-bad-soft text-bad",
};

function flag(iso2: string | null): string {
  if (!iso2 || !/^[A-Za-z]{2}$/.test(iso2)) return "";
  const [a, b] = iso2.toUpperCase();
  return String.fromCodePoint(0x1f1e6 + a.charCodeAt(0) - 65, 0x1f1e6 + b.charCodeAt(0) - 65);
}

/** Pick a service, see where an SMS for it has actually been arriving.
 *  Tiers only — the RPC never exposes raw rates. */
export function DeliveryTiers({
  rows,
  labels,
  locale,
  initialService,
}: {
  rows: DeliveryTierRow[];
  labels: Labels;
  locale: Locale;
  initialService?: string;
}) {
  const services = useMemo(() => {
    const seen = new Map<string, string>();
    for (const r of rows) if (!seen.has(r.service)) seen.set(r.service, r.serviceName);
    return [...seen].sort((a, b) => a[1].localeCompare(b[1], locale));
  }, [rows, locale]);

  const [service, setService] = useState(
    initialService && services.some(([s]) => s === initialService) ? initialService : "",
  );

  const regionName = useMemo(() => {
    let names: Intl.DisplayNames | null = null;
    try {
      names = new Intl.DisplayNames([locale], { type: "region" });
    } catch {}
    return (r: DeliveryTierRow) => {
      const localised = r.iso2 && names ? names.of(r.iso2.toUpperCase()) : undefined;
      return localised && localised !== r.iso2 ? localised : r.countryName;
    };
  }, [locale]);

  const list = useMemo(
    () =>
      rows
        .filter((r) => r.service === service)
        .sort(
          (a, b) =>
            Number(b.available) - Number(a.available) ||
            TIER_ORDER[a.tier] - TIER_ORDER[b.tier] ||
            regionName(a).localeCompare(regionName(b), locale),
        ),
    [rows, service, regionName, locale],
  );

  if (services.length === 0) return null;

  return (
    <div className="flex flex-col gap-[14px]">
      <label className="flex flex-col gap-[6px]">
        <span className="text-caption text-ink-muted">{labels.service}</span>
        <select
          className="field"
          value={service}
          onChange={(e) => setService(e.target.value)}
        >
          <option value="">{labels.pick}</option>
          {services.map(([slug, name]) => (
            <option key={slug} value={slug}>
              {name}
            </option>
          ))}
        </select>
      </label>

      {service && list.length > 0 && (
        <ul className="flex flex-col divide-y divide-border rounded-[14px] border border-border" role="list">
          {list.map((r) => (
            <li key={r.dial} className="flex items-center justify-between gap-[12px] px-[16px] py-[10px] !ms-0 !list-none">
              <span className="text-label text-ink">
                <span aria-hidden className="me-[8px]">{flag(r.iso2)}</span>
                {regionName(r)}
                {!r.available && <span className="ms-[8px] text-caption text-muted">· {labels.unavailable}</span>}
              </span>
              <span className={`shrink-0 rounded-full px-[10px] py-[3px] text-caption font-medium ${TIER_CLASS[r.tier]}`}>
                {labels[r.tier]}
              </span>
            </li>
          ))}
        </ul>
      )}
      <p className="text-caption text-muted">{labels.note}</p>
    </div>
  );
}
