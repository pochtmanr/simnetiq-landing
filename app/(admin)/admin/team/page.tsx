"use client";

import { useState, type FormEvent } from "react";
import AuthGate from "../AuthGate";
import { AuditId, Confirm, describeFailure, Failure, Hint, INPUT, Label, MIN_REASON, Panel } from "../components/RevealSms";
import { useMe } from "../components/Me";
import { formatWhen } from "../../../../lib/admin/format";
import { rpc, isAdminDenied, type TeamMember, type TeamRole } from "../../../../lib/admin/rpc";
import { inviteMember, type InviteResult } from "../../../../lib/admin/teamFunction";
import {
  Card,
  DataTable,
  EmptyState,
  Loaded,
  MigrationNotice,
  PageHeader,
  RefreshButton,
  RoleBadge,
  SkeletonRows,
  StatusBadge,
  useAdminData,
  type Column,
} from "../ui";

/* ---------------------------------------------------------------------------
 * Team: who can use this panel, and as what. Main admins (owners) only.
 *
 * Every rule that matters is in Postgres (sms-expo 20260846000000_admin_team.sql):
 * owner_assert() on every call, the two-owner ceiling and the last-owner floor
 * in a trigger. The checks on this page mirror them so the operator sees the
 * rule before pressing a button — they are guidance, and the copy says so.
 *
 * Each change is review → confirm → receipt, like granting coins: a typed
 * reason of at least eight characters, a sentence naming exactly what will
 * happen, and the audit id back at the end.
 * ------------------------------------------------------------------------ */

const MAX_OWNERS = 2;

type Action = { kind: "role"; to: TeamRole } | { kind: "revoke" } | { kind: "restore" };

function liveOwners(rows: TeamMember[]): number {
  return rows.filter((r) => r.role === "owner" && r.status !== "revoked").length;
}

/* ---------------------------------------------------------------------------
 * Invite
 * ------------------------------------------------------------------------ */

function Invite({ owners, onDone }: { owners: number; onDone: () => void }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<TeamRole>("worker");
  const [note, setNote] = useState("");
  const [pending, setPending] = useState<{ email: string; role: TeamRole; note: string | null } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<(InviteResult & { email: string }) | null>(null);

  const ownersFull = owners >= MAX_OWNERS;
  const trimmed = email.trim().toLowerCase();
  const valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmed);
  const ready = valid && !(role === "owner" && ownersFull) && !busy;

  function review(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ready) return;
    setError(null);
    setReceipt(null);
    setPending({ email: trimmed, role, note: note.trim() || null });
  }

  async function commit() {
    if (!pending || busy) return;
    setBusy(true);
    setError(null);
    try {
      const out = await inviteMember(pending.email, pending.role, pending.note);
      setReceipt({ ...out, email: pending.email });
      setPending(null);
      setEmail("");
      setNote("");
      setRole("worker");
      onDone();
    } catch (err) {
      setError(describeFailure(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Panel
      title="Invite someone"
      note="They get an email with a link back to /admin, choose a password, then set up an authenticator app. Nothing here can skip the authenticator."
    >
      <form onSubmit={review} noValidate>
        <div className="grid grid-cols-1 gap-[10px] sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <Label text="Email">
            <input
              className={INPUT}
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setPending(null);
              }}
              autoComplete="off"
              placeholder="name@example.com"
              disabled={busy}
            />
          </Label>
          <Label text="Role">
            <select
              className={INPUT}
              value={role}
              onChange={(e) => {
                setRole(e.target.value as TeamRole);
                setPending(null);
              }}
              disabled={busy}
            >
              <option value="worker">Worker</option>
              <option value="owner" disabled={ownersFull}>
                Main admin{ownersFull ? " (2 already)" : ""}
              </option>
            </select>
          </Label>
        </div>
        <div className="mt-[10px]">
          <Label text="Note (optional)">
            <input
              className={INPUT}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              autoComplete="off"
              placeholder="e.g. support shifts, weekends"
              maxLength={200}
              disabled={busy}
            />
          </Label>
        </div>
        {ownersFull ? (
          <Hint>
            There are already {MAX_OWNERS} main admins, the most the database allows. To invite another, first make
            one of them a worker.
          </Hint>
        ) : (
          <Hint>
            A worker can use every screen except this one, and cannot delete customer accounts. A main admin can do
            both; at most {MAX_OWNERS}.
          </Hint>
        )}
        {email !== "" && !valid ? <Hint>That does not look like an email address.</Hint> : null}
        <button type="submit" className="cta cta--sm mt-[12px] disabled:opacity-60" disabled={!ready}>
          Review invitation
        </button>
      </form>

      {pending ? (
        <Confirm action="Send invitation" busy={busy} onConfirm={() => void commit()} onCancel={() => setPending(null)}>
          Invite <strong className="break-all font-medium">{pending.email}</strong> as{" "}
          <strong className="font-medium">{pending.role === "owner" ? "a main admin" : "a worker"}</strong>? If the
          address already has an app account, they get a password set-up link instead of an invitation.
        </Confirm>
      ) : null}
      {error ? <Failure message={error} /> : null}
      {receipt ? (
        <p className="mt-[12px] rounded-[10px] border border-border bg-panel px-[12px] py-[10px] text-label text-ink">
          {receipt.mode === "invited"
            ? `Invitation sent to ${receipt.email}.`
            : receipt.email_sent
              ? `${receipt.email} already had an account (probably from the app), so they were sent a link to set a password.`
              : `${receipt.email} was added, but the set-up email did not go out. They can use “Forgot password?” on the sign-in page.`}{" "}
          {receipt.audit_id !== null ? (
            <>
              <AuditId id={receipt.audit_id} />.
            </>
          ) : null}
        </p>
      ) : null}
    </Panel>
  );
}

/* ---------------------------------------------------------------------------
 * Change one member
 * ------------------------------------------------------------------------ */

function describe(action: Action): string {
  if (action.kind === "role") return action.to === "owner" ? "Make main admin" : "Make worker";
  return action.kind === "revoke" ? "Remove access" : "Restore access";
}

function MemberChange({
  member,
  action,
  me,
  owners,
  onDone,
  onClose,
}: {
  member: TeamMember;
  action: Action;
  me: string | null;
  owners: number;
  onDone: () => void;
  onClose: () => void;
}) {
  const [reason, setReason] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [auditId, setAuditId] = useState<number | null>(null);

  const self = member.user_id === me;
  const who = member.email ?? member.user_id;
  const trimmed = reason.trim();

  /* Mirrors of the trigger, so the button explains itself. */
  const blocked =
    action.kind === "role" && action.to === "owner" && owners >= MAX_OWNERS
      ? `There are already ${MAX_OWNERS} main admins.`
      : (action.kind === "revoke" || (action.kind === "role" && action.to === "worker")) &&
          member.role === "owner" &&
          owners <= 1
        ? "This is the last main admin. Make someone else a main admin first."
        : action.kind === "restore" && member.role === "owner" && owners >= MAX_OWNERS
          ? `Restoring would make a third main admin; there are already ${MAX_OWNERS}.`
          : null;
  const ready = trimmed.length >= MIN_REASON && !blocked && !busy;

  async function commit() {
    if (!ready) return;
    setBusy(true);
    setError(null);
    try {
      const id =
        action.kind === "role"
          ? await rpc.teamSetRole(member.user_id, action.to, trimmed)
          : action.kind === "revoke"
            ? await rpc.teamRevoke(member.user_id, trimmed)
            : await rpc.teamRestore(member.user_id, trimmed);
      setAuditId(id);
      setConfirming(false);
      onDone();
    } catch (err) {
      setError(isAdminDenied(err) ? "Only a main admin can change the team." : describeFailure(err));
    } finally {
      setBusy(false);
    }
  }

  const sentence =
    action.kind === "role"
      ? action.to === "owner"
        ? "They will be able to manage the team and delete customer accounts."
        : self
          ? "You will lose access to this page and to customer deletion straight away."
          : "They lose team management and customer deletion; the rest of the panel stays."
      : action.kind === "revoke"
        ? self
          ? "You will be signed out of the panel on your next click."
          : "Every screen refuses them from their next click. Their account itself is not deleted."
        : `They get their access back as ${member.role === "owner" ? "a main admin" : "a worker"}.`;

  return (
    <Card
      title={
        <span className="break-all">
          {describe(action)}: {who}
        </span>
      }
      actions={
        <button type="button" onClick={onClose} className="text-label text-muted underline underline-offset-2">
          Close
        </button>
      }
    >
      {auditId !== null ? (
        <p className="text-label text-ink">
          Done. <AuditId id={auditId} />.
        </p>
      ) : (
        <>
          <p className="text-label text-ink-muted">{sentence}</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (ready) setConfirming(true);
            }}
            noValidate
            className="mt-[10px]"
          >
            <Label text="Reason">
              <input
                className={INPUT}
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  setConfirming(false);
                }}
                autoComplete="off"
                placeholder="Why this change is being made"
                disabled={busy}
              />
            </Label>
            {reason !== "" && trimmed.length < MIN_REASON ? (
              <Hint>
                {MIN_REASON} characters minimum — {trimmed.length} so far. It goes into the audit trail.
              </Hint>
            ) : null}
            {blocked ? <Hint>{blocked}</Hint> : null}
            <button type="submit" className="cta cta--sm mt-[12px] disabled:opacity-60" disabled={!ready}>
              Review
            </button>
          </form>
          {confirming ? (
            <Confirm action={describe(action)} busy={busy} onConfirm={() => void commit()} onCancel={() => setConfirming(false)}>
              {describe(action)} for <strong className="break-all font-medium">{who}</strong>
              {self ? " (you)" : ""}? {sentence} An audit row naming you and the reason is written first.
            </Confirm>
          ) : null}
          {error ? <Failure message={error} /> : null}
        </>
      )}
    </Card>
  );
}

/* ---------------------------------------------------------------------------
 * The list
 * ------------------------------------------------------------------------ */

function actionsFor(m: TeamMember): Action[] {
  if (m.status === "revoked") return [{ kind: "restore" }];
  return [m.role === "owner" ? { kind: "role", to: "worker" } : { kind: "role", to: "owner" }, { kind: "revoke" }];
}

function columns(me: string | null, pick: (m: TeamMember, a: Action) => void): Column<TeamMember>[] {
  return [
    {
      key: "email",
      header: "Email",
      mobile: "title",
      cell: (m) => (
        <span className="break-all">
          {m.email ?? "—"}
          {m.user_id === me ? <span className="ml-[6px] text-caption text-muted">(you)</span> : null}
        </span>
      ),
    },
    {
      key: "role",
      header: "Role",
      mobile: "aside",
      cell: (m) => <RoleBadge role={m.role} />,
    },
    { key: "status", header: "Status", mobile: "aside", cell: (m) => <StatusBadge status={m.status} /> },
    { key: "added", header: "Added", cell: (m) => <span className="tabular-nums text-ink-muted md:whitespace-nowrap">{formatWhen(m.added_at)}</span> },
    {
      key: "by",
      header: "Invited by",
      cell: (m) => <span className="break-all text-ink-muted">{m.invited_by_email ?? (m.invited_by ? "former member" : "by hand")}</span>,
    },
    {
      key: "seen",
      header: "Last seen",
      cell: (m) => <span className="tabular-nums text-ink-muted md:whitespace-nowrap">{formatWhen(m.last_seen_at)}</span>,
    },
    {
      key: "actions",
      header: "Change",
      cell: (m) => (
        <span className="flex flex-wrap gap-[6px]">
          {actionsFor(m).map((a) => (
            <button
              key={describe(a)}
              type="button"
              onClick={() => pick(m, a)}
              className="rounded-[8px] border border-border bg-card px-[10px] py-[4px] text-caption text-ink-muted hover:text-ink"
            >
              {describe(a)}
            </button>
          ))}
        </span>
      ),
    },
  ];
}

function Team() {
  const { state: meState, isOwner } = useMe();
  const me = meState.phase === "ready" ? meState.me.user_id : null;
  const [selected, setSelected] = useState<{ member: TeamMember; action: Action } | null>(null);

  /* Workers never load the list: the RPC would refuse them anyway, and a
     42501 there would render the full "no access" screen for someone who
     does have access — just not to this page. */
  const { status, retry } = useAdminData(async () => (isOwner ? rpc.teamList() : []), isOwner ? "owner" : "none");

  if (meState.phase === "loading") return <SkeletonRows />;
  if (meState.phase === "missing") {
    return (
      <>
        <PageHeader title="Team" />
        <MigrationNotice fn="admin_me" />
      </>
    );
  }
  if (!isOwner) {
    return (
      <>
        <PageHeader title="Team" />
        <EmptyState
          title="Only a main admin can manage the team"
          hint="Ask a main admin if you need someone added, removed or promoted."
        />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Team"
        subtitle="Who can use this panel. Main admins manage this list and can delete customer accounts."
        actions={<RefreshButton onClick={retry} busy={status.phase === "loading"} />}
      />
      <Loaded status={status} retry={retry} title="Could not load the team" skeleton={<SkeletonRows n={4} />}>
        {(rows) => {
          const owners = liveOwners(rows);
          return (
            <>
              <DataTable
                rows={rows}
                columns={columns(me, (member, action) => setSelected({ member, action }))}
                rowKey={(m) => m.user_id}
                rowTone={(m) => (m.status === "revoked" ? "warn" : null)}
                empty={<EmptyState title="Nobody on the team" hint="Which should be impossible while you are reading this." />}
              />
              <p className="mt-[8px] text-caption text-muted">
                {owners} of {MAX_OWNERS} main admins. “Invited” means they have not set up an authenticator yet.
              </p>
              {selected ? (
                <div className="mt-[12px]">
                  <MemberChange
                    key={`${selected.member.user_id}:${describe(selected.action)}`}
                    member={selected.member}
                    action={selected.action}
                    me={me}
                    owners={owners}
                    onDone={retry}
                    onClose={() => setSelected(null)}
                  />
                </div>
              ) : null}
              <div className="mt-[30px]">
                <Invite owners={owners} onDone={retry} />
              </div>
            </>
          );
        }}
      </Loaded>
    </>
  );
}

export default function AdminTeamPage() {
  return (
    <AuthGate>
      <Team />
    </AuthGate>
  );
}
