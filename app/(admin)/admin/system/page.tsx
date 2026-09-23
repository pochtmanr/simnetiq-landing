"use client";

import AuthGate from "../AuthGate";
import { formatCoins, formatWhen } from "../../../../lib/admin/format";
import { jobLinks, workflows, type JobLinks } from "../../../../lib/admin/jobLinks";
import { rpc, type JobRow, type OrphanRow } from "../../../../lib/admin/rpc";
import {
  DataTable,
  EmptyState,
  Loaded,
  PageHeader,
  RefreshButton,
  Section,
  ShortId,
  SkeletonRows,
  StatusBadge,
  useAdminData,
  type Column,
} from "../ui";

/* ---------------------------------------------------------------------------
 * System: are the background jobs running, and is OnlineSim holding numbers
 * we never closed?
 *
 * Jobs come from admin_jobs (ops_jobs(): job_heartbeats plus each job's
 * expected cadence). A job is stale after missing three beats, with a
 * five-minute floor — the same rule ops-notify uses for its job_stale card.
 *
 * Each job links to where it can be debugged (lib/admin/jobLinks.ts): its
 * Supabase logs, its source on GitHub, and n8n for the workflows that live
 * there. The links open the dashboards; they grant nothing — each of those
 * sites asks for its own login.
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

/** Small labelled links. `noreferrer` so the admin URL never reaches the
 *  destination's logs (the panel also sends Referrer-Policy: no-referrer). */
function Links({ links }: { links: JobLinks }) {
  const items: [string, string | undefined][] = [
    ["Logs", links.supabaseLogs],
    ["n8n", links.n8n],
    ["Code", links.github],
  ];
  const shown = items.filter((i): i is [string, string] => !!i[1]);
  if (shown.length === 0) return <span className="text-muted">—</span>;
  return (
    <span className="flex flex-wrap gap-x-[10px] gap-y-[2px] text-caption">
      {shown.map(([label, href]) => (
        <a key={label} href={href} target="_blank" rel="noreferrer noopener" className="blue-link whitespace-nowrap">
          {label} ↗
        </a>
      ))}
    </span>
  );
}

function jobColumns(now: number): Column<JobRow>[] {
  return [
    { key: "job", header: "Job", mobile: "title", cell: (j) => <span className="font-medium">{j.job_name}</span> },
    { key: "state", header: "State", mobile: "aside", cell: (j) => <StatusBadge status={isStale(j, now) ? "stale" : "ok"} /> },
    { key: "ok", header: "Last OK", cell: (j) => <span className="whitespace-nowrap tabular-nums text-ink-muted">{formatWhen(j.last_ok_at)}</span> },
    { key: "run", header: "Last run", cell: (j) => <span className="whitespace-nowrap tabular-nums text-ink-muted">{formatWhen(j.last_run_at)}</span> },
    { key: "every", header: "Every", cell: (j) => <span className="tabular-nums text-ink-muted">{every(j.expected_every_s)}</span> },
    {
      key: "runs",
      header: "Runs / failed",
      align: "right",
      cell: (j) => (
        <>
          {formatCoins(j.runs)} / <span className={j.failures ? "text-bad" : ""}>{formatCoins(j.failures)}</span>
        </>
      ),
    },
    {
      key: "error",
      header: "Last error",
      className: "max-w-[320px]",
      cell: (j) => <span className="font-mono text-caption text-ink-muted [overflow-wrap:anywhere]">{j.last_error ?? "—"}</span>,
    },
    { key: "links", header: "Links", cell: (j) => <Links links={jobLinks(j.job_name)} /> },
  ];
}

const ORPHAN_COLUMNS: Column<OrphanRow>[] = [
  { key: "service", header: "Service", mobile: "title", cell: (o) => <span className="font-medium">{o.service ?? "—"}</span> },
  { key: "country", header: "Country", mobile: "title", cell: (o) => <span className="text-ink-muted">{o.country ?? "—"}</span> },
  { key: "attempts", header: "Close attempts", align: "right", mobile: "aside", cell: (o) => formatCoins(o.attempts) },
  { key: "tzid", header: "tzid", cell: (o) => <ShortId id={String(o.tzid)} /> },
  { key: "seen", header: "First seen", cell: (o) => <span className="whitespace-nowrap tabular-nums text-ink-muted">{formatWhen(o.first_seen_at)}</span> },
  {
    key: "error",
    header: "Last error",
    cell: (o) => <span className="font-mono text-caption text-ink-muted [overflow-wrap:anywhere]">{o.last_error ?? "—"}</span>,
  },
];

function System() {
  const { status, retry } = useAdminData(async () => {
    const [jobs, orphans] = await Promise.all([rpc.jobs(), rpc.openOrphans()]);
    return { jobs, orphans, now: Date.now() };
  });

  return (
    <>
      <PageHeader
        title="System"
        subtitle="Background jobs and OnlineSim orphans"
        actions={<RefreshButton onClick={retry} busy={status.phase === "loading"} />}
      />

      <Loaded status={status} retry={retry} title="Could not load system status" skeleton={<SkeletonRows />}>
        {(data) => (
          <>
            <Section title="Jobs" note="stale = three beats missed (at least 5 minutes)">
              <DataTable
                rows={data.jobs}
                columns={jobColumns(data.now)}
                rowKey={(j) => j.job_name}
                rowTone={(j) => (isStale(j, data.now) ? "bad" : null)}
                empty={<EmptyState title="No heartbeats recorded" hint="Jobs write a heartbeat each run; none has yet." />}
              />
            </Section>
            {workflows().length ? (
              <Section title="n8n workflows" note="not cron jobs, so no heartbeat — open n8n to see their executions">
                <ul className="flex flex-col gap-[8px]">
                  {workflows().map((w) => (
                    <li key={w.name} className="flex flex-wrap items-baseline justify-between gap-x-[12px] gap-y-[4px] rounded-card border border-border bg-card px-[12px] py-[10px]">
                      <span className="min-w-0">
                        <span className="text-body font-medium">{w.name}</span>
                        <span className="ml-[8px] text-caption text-muted">{w.what}</span>
                      </span>
                      <Links links={w.links} />
                    </li>
                  ))}
                </ul>
              </Section>
            ) : null}
            <Section title="Open OnlineSim orphans" note="numbers OnlineSim holds that no activation owns · activation-release closes them">
              <DataTable
                rows={data.orphans}
                columns={ORPHAN_COLUMNS}
                rowKey={(o) => String(o.tzid)}
                empty={<EmptyState title="No open orphans" hint="Every OnlineSim operation is accounted for." />}
              />
            </Section>
          </>
        )}
      </Loaded>
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
