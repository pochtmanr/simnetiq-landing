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

/** Shown where a screen needs an RPC that the database does not have yet. */
export function MigrationNotice({ fn }: { fn?: string }) {
  return (
    <div role="status" className="rounded-card border border-warn/30 bg-warn-soft px-[16px] py-[14px] text-label text-warn">
      <p className="font-semibold">This part needs a database update that has not been applied yet.</p>
      <p className="mt-[4px] text-ink-muted">
        Apply <code className="font-mono">sms-expo/supabase/migrations/20260845000000_admin_money.sql</code> to production
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
