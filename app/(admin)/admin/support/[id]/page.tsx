"use client";

import Link from "next/link";
import { use, useCallback, useState } from "react";
import { AuthGate, DeniedBody } from "../../AuthGate";
import { ReplyPanel } from "../ReplyPanel";
import { StatusSelect } from "../StatusSelect";
import {
  Badge,
  Card,
  EmptyState,
  EntityLink,
  Facts,
  isUuid,
  Loaded,
  PageHeader,
  RefreshButton,
  shortId,
  SkeletonRows,
  SourceLine,
  StatusBadge,
  useAdminData,
} from "../../ui";
import { formatRelative, formatWhen } from "../../../../../lib/admin/format";
import { isMigrationMissing, rpc, type SupportRow } from "../../../../../lib/admin/rpc";

/* ---------------------------------------------------------------------------
 * One support ticket, in full.
 *
 * The inbox clamps a message to two lines so the list stays scannable; this
 * page is where it is read whole and answered. The message is customer text,
 * so it is rendered as text (never markup), with pre-wrap to keep their line
 * breaks and overflow-wrap:anywhere so a pasted URL or log line cannot push a
 * 375px screen sideways.
 * ------------------------------------------------------------------------ */

type Found = { row: SupportRow; viaList: boolean } | null;

/* admin_support_get ships in 20260845000000_admin_money.sql. Until the owner
   applies it, the ticket is looked up in the inbox list instead — the same row
   shape, just fetched wholesale. 500 covers the inbox several times over; a
   ticket older than that is reported as not found rather than guessed at. */
const FALLBACK_LIMIT = 500;

async function loadTicket(id: string): Promise<Found> {
  if (!isUuid(id)) return null;
  try {
    return { row: await rpc.supportGet(id), viaList: false };
  } catch (err) {
    if (isMigrationMissing(err)) {
      const rows = await rpc.supportList(null, FALLBACK_LIMIT);
      const row = rows.find((r) => r.id === id);
      return row ? { row, viaList: true } : null;
    }
    // callRow's "no such row" is a not-found page, not an error box.
    if (err instanceof Error && /returned no row/.test(err.message)) return null;
    throw err;
  }
}

function Ticket({ found, onDenied }: { found: NonNullable<Found>; onDenied: () => void }) {
  const { row, viaList } = found;
  /* StatusSelect and ReplyPanel both change the status; this is the one copy
     the badge and the select read, so they cannot disagree. */
  const [status, setStatus] = useState(row.status);
  const current: SupportRow = { ...row, status };

  return (
    <div className="flex flex-col gap-[14px]">
      <div className="grid grid-cols-1 gap-[14px] lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card title="Message" note={`Sent ${formatWhen(row.created_at)}`}>
          <p className="whitespace-pre-wrap text-body text-ink [overflow-wrap:anywhere]">{row.message}</p>
        </Card>
        <Card title="Ticket">
          <Facts
            items={[
              { label: "From", value: row.name || "—", wide: true },
              {
                label: "Email",
                value: (
                  <a href={`mailto:${encodeURIComponent(row.email)}`} className="break-all text-accent-deep hover:underline">
                    {row.email}
                  </a>
                ),
                wide: true,
              },
              {
                label: "Account",
                value: row.user_id ? (
                  <EntityLink type="user" id={row.user_id}>
                    Open user →
                  </EntityLink>
                ) : (
                  <span className="text-muted">No single account with this email</span>
                ),
                wide: true,
              },
              { label: "Topic", value: row.topic || "—" },
              { label: "Locale", value: row.locale || "—" },
              { label: "Replies", value: String(row.reply_count ?? 0) },
              { label: "Last reply", value: row.last_reply_at ? formatRelative(row.last_reply_at) : "—" },
            ]}
          />
          <div className="mt-[14px] border-t border-border pt-[12px]">
            {/* The badge lives here, not in the page header, so it follows the
                select's optimistic value instead of the loaded row. */}
            <div className="mb-[6px] flex items-center gap-[8px]">
              <span className="text-caption uppercase tracking-[0.07em] text-muted">Status</span>
              <StatusBadge status={status} />
            </div>
            <StatusSelect id={row.id} status={status} onChange={setStatus} onDenied={onDenied} />
          </div>
        </Card>
      </div>

      <Card title="Replies" note="Sent by email through n8n and stored on the ticket. Plain text only.">
        <ReplyPanel row={current} onSent={setStatus} onDenied={onDenied} />
      </Card>

      {viaList ? (
        <SourceLine>
          Loaded from the inbox list: admin_support_get is not in the database yet (migration 20260845000000_admin_money.sql).
        </SourceLine>
      ) : null}
    </div>
  );
}

function TicketScreen({ id }: { id: string }) {
  const { status, retry } = useAdminData(() => loadTicket(id), id);
  const [denied, setDenied] = useState(false);
  const onDenied = useCallback(() => setDenied(true), []);
  const found = status.phase === "ready" ? status.data : null;

  /* A 42501 from a write replaces the whole screen, as everywhere else. */
  if (denied) return <DeniedBody />;

  return (
    <div>
      <PageHeader
        crumbs={[{ href: "/admin/support", label: "Support" }]}
        title={found ? found.row.topic || "Support request" : "Support request"}
        subtitle={
          found ? (
            <span className="inline-flex flex-wrap items-center gap-[8px]">
              {found.row.stale ? <Badge tone="bad">waiting over 24h</Badge> : null}
              <span className="break-all">{found.row.name || found.row.email}</span>
              <span className="text-muted">{formatRelative(found.row.created_at)}</span>
            </span>
          ) : (
            <span className="font-mono">{shortId(id)}</span>
          )
        }
        actions={<RefreshButton onClick={retry} busy={status.phase === "loading"} />}
      />
      <Loaded status={status} retry={retry} title="Could not load this request" skeleton={<SkeletonRows n={5} />}>
        {(data) =>
          data ? (
            /* Keyed so a refresh re-seeds the local status from the database. */
            <Ticket key={`${data.row.id}:${data.row.status}:${data.row.reply_count}`} found={data} onDenied={onDenied} />
          ) : (
            <EmptyState
              title="No such support request"
              hint="The id is not valid, the request was deleted, or (before the migration) it is older than the newest 500."
              action={
                <Link href="/admin/support" className="text-label text-accent-deep hover:underline">
                  Back to the inbox →
                </Link>
              }
            />
          )
        }
      </Loaded>
    </div>
  );
}

/** Same shape as users/[id]: a client page unwraps the params Promise with
 *  use() (Next 16, dynamic routes). */
export default function SupportTicketRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <AuthGate>
      <TicketScreen id={id} />
    </AuthGate>
  );
}
