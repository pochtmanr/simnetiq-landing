"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatCoins, formatWhen } from "../../../../lib/admin/format";
import { rpc } from "../../../../lib/admin/rpc";
import { Figure, LoadError, TD, TH, THEAD_ROW, useAdminData, WindowPicker } from "../ui";

/* ---------------------------------------------------------------------------
 * What the Users page shows before any search: accounts that became
 * registered (non-anonymous) in the window, newest first, plus the counts the
 * ops bot's /users posts. Emails are masked in SQL.
 * ------------------------------------------------------------------------ */

const LIMIT = 100;

export function RecentSignups({ onDenied }: { onDenied: () => void }) {
  const [hours, setHours] = useState(168);
  const { status, retry } = useAdminData(
    async () => {
      const [summary, rows] = await Promise.all([rpc.usersSummary(hours), rpc.recentSignups(hours, LIMIT)]);
      return { summary, rows };
    },
    String(hours),
  );

  const denied = status.phase === "denied";
  useEffect(() => {
    if (denied) onDenied();
  }, [denied, onDenied]);
  if (denied) return null;

  return (
    <section>
      <div className="flex flex-wrap items-baseline justify-between gap-[10px]">
        <h2 className="font-sans text-subheading">Recent sign-ups</h2>
        <WindowPicker hours={hours} onChange={setHours} />
      </div>

      {status.phase === "loading" ? (
        <p className="mt-[12px] text-label text-muted" role="status">Loading…</p>
      ) : status.phase === "error" ? (
        <div className="mt-[12px]">
          <LoadError title="Could not load sign-ups" message={status.message} retry={retry} />
        </div>
      ) : (
        <>
          <dl className="mt-[12px] grid max-w-[560px] grid-cols-3 gap-x-[20px]">
            <Figure label="Sign-ups" value={formatCoins(status.data.summary.signups)} />
            <Figure label="Anon installs" value={formatCoins(status.data.summary.anon_installs)} />
            <Figure label="First purchases" value={formatCoins(status.data.summary.first_purchases)} />
          </dl>
          <div className="mt-[16px] overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-label">
              <thead>
                <tr className={THEAD_ROW}>
                  <th scope="col" className={TH}>Registered</th>
                  <th scope="col" className={TH}>Account</th>
                  <th scope="col" className={TH}>Via</th>
                  <th scope="col" className={TH}>Paid</th>
                  <th scope="col" className={`${TH} text-right`}>Balance</th>
                </tr>
              </thead>
              <tbody>
                {status.data.rows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-[14px] text-body text-ink-muted">No sign-ups in this window.</td>
                  </tr>
                ) : (
                  status.data.rows.map((r) => (
                    <tr key={r.user_id} className="border-b border-border hover:bg-panel">
                      <td className={`${TD} whitespace-nowrap tabular-nums text-ink-muted`}>{formatWhen(r.registered_at)}</td>
                      <td className={TD}>
                        <Link href={`/admin/users/${r.user_id}`} className="ghost-link">
                          {r.email_masked ?? r.user_id.slice(0, 8)}
                        </Link>
                      </td>
                      <td className={`${TD} text-ink-muted`}>{r.provider}</td>
                      <td className={TD}>{r.purchased ? "yes" : "—"}</td>
                      <td className={`${TD} text-right tabular-nums`}>{formatCoins(r.balance_coins)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {status.data.rows.length === LIMIT ? (
            <p className="mt-[8px] text-caption text-muted">Showing the newest {LIMIT}.</p>
          ) : null}
        </>
      )}
    </section>
  );
}
