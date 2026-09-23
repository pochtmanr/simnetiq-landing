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
export { Badge, RiskBadge, SeverityDot, StatusBadge, type BadgeTone } from "./components/Badge";
export { DataTable, type Column } from "./components/DataTable";
export { EntityLink, ShortId, comboHref, entityHref, isUuid, shortId } from "./components/EntityLink";
export { EmptyState, MigrationNotice, SkeletonRows, SkeletonStats } from "./components/States";
export { Explained, SourceLine } from "./components/Help";

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
            className={`rounded-[8px] border px-[12px] py-[6px] text-label ${
              active
                ? "border-transparent bg-panel-strong text-accent-deep"
                : "border-border bg-card text-ink-muted"
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
      return <>{children(status.data)}</>;
  }
}
