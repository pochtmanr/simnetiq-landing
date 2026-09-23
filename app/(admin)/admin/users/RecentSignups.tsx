"use client";

import { useEffect, useState } from "react";
import { formatCoins, formatWhen } from "../../../../lib/admin/format";
import { rpc, type SignupRow } from "../../../../lib/admin/rpc";
import {
  Badge,
  DataTable,
  EmptyState,
  Loaded,
  ProviderChip,
  Section,
  SkeletonRows,
  SkeletonStats,
  Stat,
  StatGrid,
  useAdminData,
  WindowPicker,
  type Column,
} from "../ui";

/* ---------------------------------------------------------------------------
 * What the Users page shows before any search: accounts that became
 * registered (non-anonymous) in the window, newest first, plus the counts the
 * ops bot's /users posts. Emails are masked in SQL.
 * ------------------------------------------------------------------------ */

/* The RPC's own ceiling. Paged 50/100 on screen, so fetching all of it once
   keeps the pager instant. */
const LIMIT = 500;

/* The account cell is plain text: the row (and, on a phone, the card title)
   is already the link to the user, and an anchor inside it would nest. */
const COLUMNS: Column<SignupRow>[] = [
  {
    key: "account",
    header: "Account",
    mobile: "title",
    className: "break-all",
    cell: (r) => r.email_masked ?? <span className="font-mono">{r.user_id.slice(0, 8)}…</span>,
  },
  {
    key: "balance",
    header: "Balance",
    align: "right",
    mobile: "aside",
    cell: (r) => <span className="font-medium">{formatCoins(r.balance_coins)}</span>,
  },
  {
    key: "paid",
    header: "Paid",
    mobile: "aside",
    cell: (r) => (r.purchased ? <Badge tone="good">paid</Badge> : <span className="text-caption text-muted">not yet</span>),
  },
  {
    key: "registered",
    header: "Registered",
    className: "whitespace-nowrap tabular-nums text-ink-muted",
    cell: (r) => formatWhen(r.registered_at),
  },
  { key: "via", header: "Via", mobile: "aside", cell: (r) => <ProviderChip provider={r.provider} /> },
];

export function RecentSignups({ onDenied }: { onDenied: () => void }) {
  const [hours, setHours] = useState(168);
  const { status, retry } = useAdminData(
    async () => {
      const [summary, rows] = await Promise.all([rpc.usersSummary(hours), rpc.recentSignups(hours, LIMIT)]);
      return { summary, rows };
    },
    String(hours),
  );

  /* A denial replaces the whole Users screen, not just this section. */
  const denied = status.phase === "denied";
  useEffect(() => {
    if (denied) onDenied();
  }, [denied, onDenied]);
  if (denied) return null;

  return (
    <Section title="Recent sign-ups" actions={<WindowPicker hours={hours} onChange={setHours} />}>
      <Loaded
        status={status}
        retry={retry}
        title="Could not load sign-ups"
        skeleton={
          <div className="flex flex-col gap-[16px]">
            <SkeletonStats n={3} />
            <SkeletonRows n={4} />
          </div>
        }
      >
        {({ summary, rows }) => (
          <>
            <StatGrid wide={3}>
              <Stat
                label="Sign-ups"
                value={formatCoins(summary.signups)}
                help="Registered (non-anonymous, not deleted) accounts whose registration falls in the window. Counts up to 500."
                source="admin_users_summary → ops_signup_rows"
              />
              <Stat
                label="Anon installs"
                value={formatCoins(summary.anon_installs)}
                help="Accounts created in the window that are still anonymous — roughly, app installs that have not signed in yet. An install that later registers moves to Sign-ups."
                source="auth.users where is_anonymous"
              />
              <Stat
                label="First purchases"
                value={formatCoins(summary.first_purchases)}
                help="Purchases in the window that were the buyer's first ever. Sandbox (test) purchases are excluded."
                source="ops_purchase_rows, is_first and not sandbox"
              />
            </StatGrid>
            <div className="mt-[16px]">
              <DataTable
                rows={rows}
                columns={COLUMNS}
                rowKey={(r) => r.user_id}
                rowHref={(r) => `/admin/users/${r.user_id}`}
                pageSizes={[50, 100]}
                empty={<EmptyState title="No sign-ups in this window." hint="Try a longer window above." />}
                footer={
                  rows.length === LIMIT ? (
                    <p className="text-caption text-muted">Showing the newest {LIMIT}.</p>
                  ) : null
                }
              />
            </div>
          </>
        )}
      </Loaded>
    </Section>
  );
}
