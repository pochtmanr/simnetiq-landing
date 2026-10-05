"use client";

import { useEffect, useState } from "react";
import { formatCoins } from "../../../../lib/admin/format";
import { rpc, type SignupRow } from "../../../../lib/admin/rpc";
import {
  Badge,
  DataTable,
  EmptyState,
  FetchLimit,
  LimitNote,
  Loaded,
  ProviderChip,
  Section,
  SkeletonRows,
  SkeletonStats,
  Stat,
  StatGrid,
  useAdminData,
  useFetchLimit,
  When,
  WindowPicker,
  type Column,
} from "../ui";

/* ---------------------------------------------------------------------------
 * What the Users page shows before any search: accounts that became
 * registered (non-anonymous) in the window, newest first, plus the counts the
 * ops bot's /users posts. Emails are masked in SQL.
 * ------------------------------------------------------------------------ */

/* ops_signup_rows caps at 500. */
const LIMITS = [50, 100, 200, 500] as const;

const PaidBadge = ({ paid }: { paid: boolean }) => (paid ? <Badge tone="good">paid</Badge> : <Badge>not yet</Badge>);

/* On a phone the card is: account on top, balance on the right, and one row
   underneath with when they registered on the left and how they sign in +
   whether they paid on the right. On desktop the same pieces are columns.
   The account cell is plain text: the row is already the link to the user. */
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
    key: "row",
    header: "Registered",
    mobile: "footer",
    desktop: false,
    cell: (r) => (
      <span className="flex w-full items-center justify-between gap-[8px]">
        <When iso={r.registered_at} timeOnly className="text-label text-ink-muted" />
        <span className="flex items-center gap-[6px]">
          <ProviderChip provider={r.provider} />
          <PaidBadge paid={r.purchased} />
        </span>
      </span>
    ),
  },
  {
    key: "registered",
    header: "Registered",
    mobile: "hide",
    className: "whitespace-nowrap text-ink-muted",
    cell: (r) => <When iso={r.registered_at} timeOnly />,
  },
  { key: "via", header: "Via", mobile: "hide", cell: (r) => <ProviderChip provider={r.provider} /> },
  { key: "paid", header: "Paid", mobile: "hide", cell: (r) => <PaidBadge paid={r.purchased} /> },
];

export function RecentSignups({ onDenied }: { onDenied: () => void }) {
  const [hours, setHours] = useState(168);
  const [limit, setLimit] = useFetchLimit("signups", LIMITS, 100);
  const { status, retry } = useAdminData(
    async () => {
      const [summary, rows] = await Promise.all([rpc.usersSummary(hours), rpc.recentSignups(hours, limit)]);
      return { summary, rows };
    },
    `${hours}:${limit}`,
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
            <div className="mt-[16px] flex justify-end">
              <FetchLimit value={limit} options={LIMITS} onChange={setLimit} />
            </div>
            <div className="mt-[10px]">
              <DataTable
                rows={rows}
                columns={COLUMNS}
                rowKey={(r) => r.user_id}
                rowHref={(r) => `/admin/users/${r.user_id}`}
                groupByDay={(r) => r.registered_at}
                empty={<EmptyState title="No sign-ups in this window." hint="Try a longer window above." />}
              />
              <LimitNote count={rows.length} limit={limit} noun="sign-ups" />
            </div>
          </>
        )}
      </Loaded>
    </Section>
  );
}
