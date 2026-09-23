/* ---------------------------------------------------------------------------
 * Where to look when a job on the System page is late or failing.
 *
 * One file, one table, so adding a job is one line here and nothing anywhere
 * else. Job names are the `job_name` values in `public.job_heartbeats`, which
 * the jobs write themselves — the list in ops_jobs()
 * (sms-expo 20260842000000_ops_bot_p0.sql) is the canonical set.
 *
 * Two kinds of job, and they are debugged in different places:
 *   - edge functions called by pg_cron (via invoke_scheduled_function): the
 *     function's own logs in the Supabase dashboard, its folder on GitHub
 *   - SQL functions run by pg_cron directly: the Postgres logs, and the
 *     migration that defines the function
 *
 * n8n workflows are not cron jobs and write no heartbeat, so they never appear
 * in admin_jobs(). They are listed separately (workflows()) so the System page
 * can still link to them; the link is hidden when NEXT_PUBLIC_N8N_BASE_URL is
 * not set, rather than pointing at a guessed host.
 * ------------------------------------------------------------------------ */

export type JobLinks = {
  supabaseLogs?: string;
  n8n?: string;
  github?: string;
};

const GITHUB = "https://github.com/pochtmanr/smscode/tree/main/supabase";
const GITHUB_FILE = "https://github.com/pochtmanr/smscode/blob/main/supabase";

/** `https://<ref>.supabase.co` → `<ref>`. Null for anything else (a local
 *  stack, the fake URL the screenshot harness uses), so no link is drawn to a
 *  dashboard project that does not exist. */
export function projectRef(url: string | undefined = process.env.NEXT_PUBLIC_SUPABASE_URL): string | null {
  if (!url) return null;
  const m = /^https:\/\/([a-z0-9]{20})\.supabase\.co\/?$/.exec(url.trim());
  return m ? m[1] : null;
}

function n8nBase(): string | null {
  /* Literal member expression: Next inlines NEXT_PUBLIC_* at build time only
     when it is written out like this. */
  const raw = process.env.NEXT_PUBLIC_N8N_BASE_URL;
  if (!raw || !/^https?:\/\//.test(raw)) return null;
  return raw.replace(/\/+$/, "");
}

type Source =
  | { kind: "function"; fn: string }
  | { kind: "sql"; migration: string };

/* job_name → where its code lives. */
const JOBS: Record<string, Source> = {
  "ops-notify": { kind: "function", fn: "ops-notify" },
  "activation-release": { kind: "function", fn: "activation-release" },
  "pricing-sync": { kind: "function", fn: "pricing-sync" },
  /* SQL since 20260838; the edge function of the same name remains only for
     hand backfills, so its logs would show nothing for the nightly run. */
  "pricing-rollup": { kind: "sql", migration: "20260838000000_price_events_diet.sql" },
  "activation-sweep": { kind: "sql", migration: "20260834000000_admin.sql" },
  "activation-pii-purge": { kind: "sql", migration: "20260835000000_abuse_shortfalls.sql" },
  "ops-prune": { kind: "sql", migration: "20260839000000_ops_monitoring.sql" },
  "ops-deadman": { kind: "sql", migration: "20260842000000_ops_bot_p0.sql" },
};

/** Links for one job. Unknown jobs get none — better than a wrong guess. */
export function jobLinks(jobName: string): JobLinks {
  const src = JOBS[jobName];
  if (!src) return {};
  const ref = projectRef();
  if (src.kind === "function") {
    return {
      supabaseLogs: ref ? `https://supabase.com/dashboard/project/${ref}/functions/${src.fn}/logs` : undefined,
      github: `${GITHUB}/functions/${src.fn}`,
    };
  }
  return {
    supabaseLogs: ref ? `https://supabase.com/dashboard/project/${ref}/logs/postgres-logs` : undefined,
    github: `${GITHUB_FILE}/migrations/${src.migration}`,
  };
}

export type Workflow = { name: string; what: string; links: JobLinks };

/** The n8n workflows (landing/n8n/). Empty when no n8n base URL is configured. */
export function workflows(): Workflow[] {
  const base = n8nBase();
  if (!base) return [];
  /* Workflow ids are assigned by n8n on import, so they cannot be known here;
     the workflow list is the stable page to land on. */
  const list = `${base}/home/workflows`;
  return [
    { name: "SIMNETIQ Support", what: "support form → email to the team", links: { n8n: list } },
    { name: "SIMNETIQ support reply", what: "panel reply → email to the customer", links: { n8n: list } },
  ];
}
