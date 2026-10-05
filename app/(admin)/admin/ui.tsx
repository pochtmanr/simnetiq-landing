"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { isAdminDenied, isMigrationMissing } from "../../../lib/admin/rpc";
import { DeniedBody } from "./AuthGate";
import { MigrationNotice, SkeletonRows } from "./components/States";

/* ---------------------------------------------------------------------------
 * Pieces shared by the dashboard screens. The newer building blocks live in
 * ./components and are re-exported here so every screen imports from one
 * place.
 * ------------------------------------------------------------------------ */

export { Card, Facts, PageHeader, RefreshButton, Section } from "./components/Card";
export { Stat, StatGrid, type Tone } from "./components/Stat";
export { Badge, ProviderChip, RiskBadge, RoleBadge, SeverityDot, StatusBadge, type BadgeTone } from "./components/Badge";
export { DataTable, DaySeparator, type Column } from "./components/DataTable";
export { CopyButton, CopyRow, CopyText, EntityLink, ShortId, comboHref, entityHref, isUuid, shortId } from "./components/EntityLink";
export { EmptyState, MigrationNotice, PageSkeleton, Reveal, SkeletonRows, SkeletonStats } from "./components/States";
export { Explained, SourceLine } from "./components/Help";
export { When, useNow } from "./components/When";

export const TH = "py-[7px] pr-[14px] text-left font-medium";
export const TD = "py-[7px] pr-[14px]";
export const THEAD_ROW = "border-b border-border text-caption uppercase tracking-[0.07em] text-muted";
/** The panel's one alarm colour; the marketing palette has none. */
export const ALERT = "font-semibold text-bad";

export function Figure({
  label,
  value,
  alert = false,
  note,
}: {
  label: string;
  value: string;
  alert?: boolean;
  note?: string;
}) {
  return (
    <div className="border-t border-border pt-[9px]">
      <dt className="text-caption uppercase tracking-[0.07em] text-muted">
        {label}
      </dt>
      <dd
        className={`mt-[2px] font-sans text-subheading tabular-nums ${
          alert ? ALERT : "text-ink"
        }`}
      >
        {value}
      </dd>
      {note ? <p className="mt-[2px] text-caption text-muted">{note}</p> : null}
    </div>
  );
}

export type Loadable<T> =
  | { phase: "loading" }
  | { phase: "ready"; data: T }
  | { phase: "denied" }
  /** The RPC does not exist yet: a migration has not been applied. */
  | { phase: "missing"; fn: string }
  | { phase: "error"; message: string };

/**
 * Runs `load` on mount and whenever `retry` is called (or `key` changes).
 * A 42501 anywhere becomes `denied`; any other failure an inline error.
 */
export function useAdminData<T>(load: () => Promise<T>, key: string = "") {
  const [status, setStatus] = useState<Loadable<T>>({ phase: "loading" });
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const data = await load();
        if (!cancelled) setStatus({ phase: "ready", data });
      } catch (err) {
        if (cancelled) return;
        if (isAdminDenied(err)) {
          setStatus({ phase: "denied" });
          return;
        }
        if (isMigrationMissing(err)) {
          setStatus({ phase: "missing", fn: err.fn });
          return;
        }
        console.error("Admin screen failed to load.", err);
        setStatus({
          phase: "error",
          message: err instanceof Error && err.message ? err.message : "The request did not complete.",
        });
      }
    })();
    return () => {
      cancelled = true;
    };
    // `load` is recreated every render; `key` and `attempt` are what matter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt, key]);

  return { status, retry };
}

export function LoadError({ title, message, retry }: { title: string; message: string; retry: () => void }) {
  return (
    <div role="alert" className="max-w-[560px]">
      <h2 className="font-sans text-subheading">{title}</h2>
      <p className="mt-[6px] text-body text-ink-muted">{message}</p>
      <button type="button" onClick={retry} className="cta cta--sm mt-[14px]">
        Try again
      </button>
    </div>
  );
}

/** 24h / 7d / 30d switch. */
export const WINDOWS = [
  { hours: 24, label: "24h" },
  { hours: 168, label: "7 days" },
  { hours: 720, label: "30 days" },
] as const;

export function WindowPicker({ hours, onChange }: { hours: number; onChange: (h: number) => void }) {
  return (
    <div className="flex flex-wrap gap-[6px]">
      {WINDOWS.map((w) => {
        const active = w.hours === hours;
        return (
          <button
            key={w.hours}
            type="button"
            onClick={() => onChange(w.hours)}
            aria-pressed={active}
            className={`rounded-pill border px-[14px] py-[6px] text-label transition-colors ${
              active
                ? "border-transparent bg-ink text-white"
                : "border-border bg-card text-ink-muted hover:text-ink"
            }`}
          >
            {w.label}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Renders a Loadable: a skeleton while loading, the denied body, the
 * migration notice, or an inline error — and `children(data)` once ready.
 */
export function Loaded<T>({
  status,
  retry,
  title = "Could not load this",
  skeleton,
  children,
}: {
  status: Loadable<T>;
  retry: () => void;
  title?: string;
  skeleton?: ReactNode;
  children: (data: T) => ReactNode;
}) {
  switch (status.phase) {
    case "loading":
      /* Held open at most of a screen so the page doesn't render short,
         then jump when the data lands. */
      return (
        <div className="min-h-[70vh]" aria-busy="true">
          {skeleton ?? <SkeletonRows n={8} />}
        </div>
      );
    case "denied":
      return <DeniedBody />;
    case "missing":
      return <MigrationNotice fn={status.fn} />;
    case "error":
      return <LoadError title={title} message={status.message} retry={retry} />;
    case "ready":
      return <div className="animate-[admin-fade-in_180ms_ease-out]">{children(status.data)}</div>;
  }
}

/* ---------------------------------------------------------------------------
 * How many rows a list fetches. The chosen number is the RPC's p_limit, so a
 * bigger number is a real refetch, not a client page; every fetched row is
 * then shown and the list scrolls. Remembered per list on this device.
 * ------------------------------------------------------------------------ */

export function useFetchLimit(id: string, options: readonly number[], fallback: number = options[0]) {
  const storeKey = `admin:limit:${id}`;
  const [limit, setLimitState] = useState<number>(() => {
    try {
      const saved = Number(localStorage.getItem(storeKey));
      return options.includes(saved) ? saved : fallback;
    } catch {
      return fallback;
    }
  });
  const setLimit = useCallback(
    (n: number) => {
      setLimitState(n);
      try {
        localStorage.setItem(storeKey, String(n));
      } catch {
        /* private mode: the choice just isn't remembered */
      }
    },
    [storeKey],
  );
  return [limit, setLimit] as const;
}

export function FetchLimit({
  value,
  options,
  onChange,
}: {
  value: number;
  options: readonly number[];
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex items-center gap-[6px]" role="group" aria-label="Rows to load">
      <span className="text-caption uppercase tracking-[0.07em] text-muted">Rows</span>
      <div className="flex gap-[2px] rounded-pill border border-border bg-card p-[2px]">
        {options.map((n) => {
          const active = n === value;
          return (
            <button
              key={n}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(n)}
              className={`min-w-[38px] rounded-pill px-[8px] py-[5px] text-label tabular-nums transition-colors ${
                active ? "bg-ink text-white" : "text-ink-muted hover:text-ink"
              }`}
            >
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Under a list: how many rows came back, and whether that was the cap. */
export function LimitNote({ count, limit, noun = "rows" }: { count: number; limit: number; noun?: string }) {
  if (!count) return null;
  return (
    <p className="mt-[10px] text-caption text-muted">
      {count >= limit ? `Showing the newest ${count} — the limit. Pick a bigger number above to load more.` : `${count} ${noun}.`}
    </p>
  );
}
