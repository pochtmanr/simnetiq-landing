"use client";

import { useState, useSyncExternalStore } from "react";
import { formatAgo, formatDayLabel, formatLocalTime, formatWhen, localDayKey } from "../../../../lib/admin/format";

/* ---------------------------------------------------------------------------
 * A timestamp that reads like a person would say it — "5m ago", "yesterday
 * 14:05" — and keeps itself current. Tap for the full local date and time;
 * hover (desktop) shows the UTC value the SQL editor and logs use.
 *
 * Every <When> on screen shares one 30-second ticker rather than each row
 * running its own interval.
 * ------------------------------------------------------------------------ */

let now = Date.now();
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | null = null;

function subscribe(cb: () => void) {
  listeners.add(cb);
  if (!timer) {
    timer = setInterval(() => {
      now = Date.now();
      listeners.forEach((l) => l());
    }, 30_000);
  }
  return () => {
    listeners.delete(cb);
    if (!listeners.size && timer) {
      clearInterval(timer);
      timer = null;
    }
  };
}

export function useNow(): number {
  return useSyncExternalStore(
    subscribe,
    () => now,
    () => now,
  );
}

export function When({
  iso,
  timeOnly = false,
  className = "",
}: {
  iso: string | null | undefined;
  /** Inside a day group the date is already in the separator: today still
   *  reads "3h ago", any other day just "14:05". */
  timeOnly?: boolean;
  className?: string;
}) {
  const current = useNow();
  const [exact, setExact] = useState(false);
  if (!iso) return <span className={className}>—</span>;
  const utc = formatWhen(iso);
  /* Tapped: the full local date and time; the UTC value is in the tooltip. */
  const full = `${formatDayLabel(iso, current)} ${formatLocalTime(iso)}`;
  const today = localDayKey(iso) === localDayKey(new Date(current).toISOString());
  const short = timeOnly && !today ? formatLocalTime(iso) : formatAgo(iso, current);
  return (
    <button
      type="button"
      title={utc}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        setExact((v) => !v);
      }}
      className={`inline cursor-pointer whitespace-nowrap rounded-[4px] text-left tabular-nums decoration-dotted underline-offset-2 hover:underline ${className}`}
    >
      {exact ? full : short}
    </button>
  );
}
