"use client";

import AuthGate, { DeniedBody } from "../AuthGate";
import { formatCoins, formatWhen } from "../../../../lib/admin/format";
import { rpc, type JobRow, type OrphanRow } from "../../../../lib/admin/rpc";
import { ALERT, LoadError, Section, TD, TH, THEAD_ROW, useAdminData } from "../ui";

/* ---------------------------------------------------------------------------
 * System: are the background jobs running, and is OnlineSim holding numbers
 * we never closed?
 *
 * Jobs come from admin_jobs (ops_jobs(): job_heartbeats plus each job's
 * expected cadence). A job is stale after missing three beats, with a
 * five-minute floor — the same rule ops-notify uses for its job_stale card.
 * ------------------------------------------------------------------------ */

function every(s: number | null): string {
  if (!s) return "—";
  if (s % 86400 === 0) return `${s / 86400}d`;
  if (s % 3600 === 0) return `${s / 3600}h`;
  if (s % 60 === 0) return `${s / 60}m`;
  return `${s}s`;
}

/** Mirrors staleAfterMs() in sms-expo/supabase/functions/_shared/opsQueue.ts. */
function isStale(j: JobRow, now: number): boolean {
  if (!j.expected_every_s) return false;
  const limit = Math.max(3 * j.expected_every_s * 1000, 5 * 60_000);
  if (j.last_ok_at) return now - Date.parse(j.last_ok_at) > limit;
  // Never succeeded: failing on every run, or seeded and never run.
  if ((j.runs ?? 0) >= 3 && j.failures === j.runs) return true;
  return !!j.last_run_at && (j.runs ?? 0) === 0 && now - Date.parse(j.last_run_at) > limit;
}

function Jobs({ rows, now }: { rows: JobRow[]; now: number }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] border-collapse text-label">
        <thead>
          <tr className={THEAD_ROW}>
            <th scope="col" className={TH}>Job</th>
            <th scope="col" className={TH}>State</th>
            <th scope="col" className={TH}>Last OK</th>
            <th scope="col" className={TH}>Last run</th>
            <th scope="col" className={TH}>Every</th>
            <th scope="col" className={`${TH} text-right`}>Runs / failed</th>
            <th scope="col" className="py-[7px] text-left font-medium">Last error</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-[14px] text-body text-ink-muted">No heartbeats recorded.</td>
            </tr>
          ) : (
            rows.map((j) => {
              const stale = isStale(j, now);
              return (
                <tr key={j.job_name} className="border-b border-border align-top">
                  <td className={`${TD} font-medium`}>{j.job_name}</td>
                  <td className={`${TD} ${stale ? ALERT : "text-ink-muted"}`}>{stale ? "stale" : "ok"}</td>
                  <td className={`${TD} whitespace-nowrap tabular-nums text-ink-muted`}>{formatWhen(j.last_ok_at)}</td>
                  <td className={`${TD} whitespace-nowrap tabular-nums text-ink-muted`}>{formatWhen(j.last_run_at)}</td>
                  <td className={`${TD} tabular-nums text-ink-muted`}>{every(j.expected_every_s)}</td>
                  <td className={`${TD} text-right tabular-nums`}>
                    {formatCoins(j.runs)} / {formatCoins(j.failures)}
                  </td>
                  <td className="max-w-[320px] break-words py-[7px] font-mono text-caption text-ink-muted [overflow-wrap:anywhere]">
                    {j.last_error ?? "—"}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

function Orphans({ rows }: { rows: OrphanRow[] }) {
  if (!rows.length) return <p className="text-body text-ink-muted">No open orphans. Every OnlineSim operation is accounted for.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-label">
        <thead>
          <tr className={THEAD_ROW}>
            <th scope="col" className={TH}>tzid</th>
            <th scope="col" className={TH}>Service</th>
            <th scope="col" className={TH}>Country</th>
            <th scope="col" className={TH}>First seen</th>
            <th scope="col" className={`${TH} text-right`}>Close attempts</th>
            <th scope="col" className="py-[7px] text-left font-medium">Last error</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((o) => (
            <tr key={o.tzid} className="border-b border-border align-top">
              <td className={`${TD} font-mono text-caption`}>{o.tzid}</td>
              <td className={TD}>{o.service ?? "—"}</td>
              <td className={`${TD} text-ink-muted`}>{o.country ?? "—"}</td>
              <td className={`${TD} whitespace-nowrap tabular-nums text-ink-muted`}>{formatWhen(o.first_seen_at)}</td>
              <td className={`${TD} text-right tabular-nums`}>{formatCoins(o.attempts)}</td>
              <td className="py-[7px] font-mono text-caption text-ink-muted">{o.last_error ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function System() {
  const { status, retry } = useAdminData(async () => {
    const [jobs, orphans] = await Promise.all([rpc.jobs(), rpc.openOrphans()]);
    return { jobs, orphans, now: Date.now() };
  });

  if (status.phase === "denied") return <DeniedBody />;

  return (
    <>
      <div className="flex items-start justify-between gap-[16px]">
        <div>
          <h1 className="font-sans text-heading-sm">System</h1>
          <p className="mt-[2px] text-caption text-muted">Background jobs and OnlineSim orphans</p>
        </div>
        <button type="button" onClick={retry} className="cta cta--sm">
          Refresh
        </button>
      </div>

      {status.phase === "loading" ? (
        <p className="mt-[20px] text-body text-ink-muted" role="status">Loading…</p>
      ) : status.phase === "error" ? (
        <div className="mt-[20px]">
          <LoadError title="Could not load system status" message={status.message} retry={retry} />
        </div>
      ) : (
        <>
          <Section title="Jobs" note="stale = three beats missed (at least 5 minutes)">
            <Jobs rows={status.data.jobs} now={status.data.now} />
          </Section>
          <Section title="Open OnlineSim orphans" note="numbers OnlineSim holds that no activation owns · activation-release closes them">
            <Orphans rows={status.data.orphans} />
          </Section>
        </>
      )}
    </>
  );
}

export default function AdminSystemPage() {
  return (
    <AuthGate>
      <System />
    </AuthGate>
  );
}
