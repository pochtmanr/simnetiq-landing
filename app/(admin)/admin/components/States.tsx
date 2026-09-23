import type { ReactNode } from "react";

/* ---------------------------------------------------------------------------
 * Loading, empty and "not deployed yet" states.
 * ------------------------------------------------------------------------ */

export function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-[8px] bg-panel ${className}`} aria-hidden />;
}

export function SkeletonStats({ n = 4 }: { n?: number }) {
  return (
    <div className="grid grid-cols-2 gap-[10px] sm:grid-cols-3 lg:grid-cols-4" aria-busy="true" aria-label="Loading">
      {Array.from({ length: n }, (_, i) => (
        <div key={i} className="rounded-card border border-border bg-card p-[14px]">
          <SkeletonBlock className="h-[10px] w-[50%]" />
          <SkeletonBlock className="mt-[10px] h-[22px] w-[70%]" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonRows({ n = 6 }: { n?: number }) {
  return (
    <div className="flex flex-col gap-[8px]" aria-busy="true" aria-label="Loading">
      {Array.from({ length: n }, (_, i) => (
        <SkeletonBlock key={i} className="h-[44px] w-full" />
      ))}
    </div>
  );
}

export function EmptyState({ title, hint, action }: { title: string; hint?: ReactNode; action?: ReactNode }) {
  return (
    <div className="rounded-card border border-dashed border-border bg-card px-[16px] py-[26px] text-center">
      <p className="text-body font-medium">{title}</p>
      {hint ? <p className="mx-auto mt-[4px] max-w-[440px] text-label text-muted">{hint}</p> : null}
      {action ? <div className="mt-[12px]">{action}</div> : null}
    </div>
  );
}

/** Which migration ships a function the panel may find missing. Anything
 *  unlisted falls back to the money migration, the one this notice was first
 *  written for. */
function migrationFor(fn?: string): string {
  if (fn && (fn === "admin_me" || fn.startsWith("admin_team_") || fn === "admin_user_delete_begin")) {
    return "20260846000000_admin_team.sql";
  }
  return "20260845000000_admin_money.sql";
}

/** Shown where a screen needs an RPC that the database does not have yet. */
export function MigrationNotice({ fn }: { fn?: string }) {
  return (
    <div role="status" className="rounded-card border border-warn/30 bg-warn-soft px-[16px] py-[14px] text-label text-warn">
      <p className="font-semibold">This part needs a database update that has not been applied yet.</p>
      <p className="mt-[4px] text-ink-muted">
        Apply <code className="font-mono">sms-expo/supabase/migrations/{migrationFor(fn)}</code> to production
        {fn ? (
          <>
            {" "}
            (missing function <code className="font-mono">{fn}</code>)
          </>
        ) : null}
        , then refresh.
      </p>
    </div>
  );
}

/**
 * Holds a screen behind its skeleton until *everything* on it has loaded, then
 * shows it in one go. The content is mounted (hidden) the whole time, so its
 * requests run in parallel rather than waiting for the reveal — it simply
 * isn't shown half-built, card by card.
 */
export function Reveal({ ready, skeleton, children }: { ready: boolean; skeleton: ReactNode; children: ReactNode }) {
  return (
    <div className="min-h-[70vh]">
      {ready ? null : (
        <div aria-busy="true" aria-label="Loading">
          {skeleton}
        </div>
      )}
      <div className={ready ? "animate-[admin-fade-in_180ms_ease-out]" : "invisible h-0 overflow-hidden"} aria-hidden={!ready}>
        {children}
      </div>
    </div>
  );
}

/** A whole page's worth of placeholder: header, cards, rows. */
export function PageSkeleton({ stats = 8, rows = 8 }: { stats?: number; rows?: number }) {
  return (
    <div>
      <SkeletonBlock className="mb-[6px] h-[28px] w-[180px]" />
      <SkeletonBlock className="mb-[18px] h-[14px] w-[280px] max-w-full" />
      {stats ? <SkeletonStats n={stats} /> : null}
      <div className="mt-[24px]">
        <SkeletonRows n={rows} />
      </div>
    </div>
  );
}
