"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import type { Factor } from "@supabase/supabase-js";
import AuthGate from "../AuthGate";
import { Failure, Hint, INPUT, Label } from "../components/RevealSms";
import { useMe } from "../components/Me";
import { getAdminClient } from "../../../../lib/admin/client";
import { verifyPassword } from "../../../../lib/admin/account";
import { formatWhen } from "../../../../lib/admin/format";
import { Badge, Card, Facts, MigrationNotice, PageHeader, RoleBadge, SkeletonStats } from "../ui";

/* ---------------------------------------------------------------------------
 * Settings: the operator's own account. Everyone gets this page.
 *
 * Two sources, and they answer different questions:
 *   - admin_me()  (Postgres) — the team membership: role, who invited them.
 *   - GoTrue      (the browser session) — how this browser is signed in:
 *                 factors, assurance level, last sign-in, token expiry.
 *
 * Nothing on this page can change a role; that is the Team page, and only
 * for a main admin. What it can change is the operator's own password and
 * authenticator, and it can end every session they have.
 * ------------------------------------------------------------------------ */

const MIN_PASSWORD = 12;

/* ---------------------------------------------------------------------------
 * My account
 * ------------------------------------------------------------------------ */

function MyAccount() {
  const { state } = useMe();
  if (state.phase === "loading") return <SkeletonStats n={4} />;
  if (state.phase === "missing") return <MigrationNotice fn="admin_me" />;
  if (state.phase !== "ready") {
    return <p className="text-label text-muted">Could not load your team record{state.phase === "error" ? `: ${state.message}` : "."}</p>;
  }
  const me = state.me;
  return (
    <Facts
      items={[
        { label: "Email", value: <span className="break-all">{me.email ?? "—"}</span>, wide: true },
        { label: "Role", value: <RoleBadge role={me.role} /> },
        { label: "Member since", value: formatWhen(me.added_at) },
        {
          label: "Invited by",
          /* Rows created before the team page existed were added by hand in
             the SQL editor; say so rather than showing a blank. */
          value: me.invited_by_email ?? (me.invited_by ? "a former team member" : "added by hand"),
          wide: true,
        },
      ]}
    />
  );
}

/* ---------------------------------------------------------------------------
 * How I'm connected
 * ------------------------------------------------------------------------ */

type Connection = {
  aal: string | null;
  methods: string[];
  lastSignIn: string | null;
  expiresAt: number | null;
  factors: Factor[];
};

function methodLabel(m: string): string {
  if (m === "password") return "password";
  if (m === "totp") return "authenticator app";
  if (m === "recovery" || m === "otp" || m === "magiclink") return "email link";
  return m;
}

async function loadConnection(): Promise<Connection> {
  const auth = getAdminClient().auth;
  const [{ data: userData }, { data: sessionData }, { data: aal }, { data: factors }] = await Promise.all([
    auth.getUser(),
    auth.getSession(),
    auth.mfa.getAuthenticatorAssuranceLevel(),
    auth.mfa.listFactors(),
  ]);
  return {
    aal: aal?.currentLevel ?? null,
    methods: (aal?.currentAuthenticationMethods ?? []).map((m) => (typeof m === "string" ? m : m.method)),
    lastSignIn: userData.user?.last_sign_in_at ?? null,
    expiresAt: sessionData.session?.expires_at ?? null,
    factors: factors?.totp ?? [],
  };
}

function Connected({ conn }: { conn: Connection | null }) {
  if (!conn) return <SkeletonStats n={4} />;
  const methods = [...new Set(conn.methods.map(methodLabel))];
  return (
    <>
      <Facts
        items={[
          { label: "Sign-in method", value: "Password + authenticator app", wide: true },
          {
            label: "Assurance level",
            value: (
              <span className="inline-flex items-center gap-[6px]">
                <Badge tone={conn.aal === "aal2" ? "good" : "warn"}>{conn.aal ?? "—"}</Badge>
                <span className="text-caption text-muted">{conn.aal === "aal2" ? "code checked" : "code not checked"}</span>
              </span>
            ),
          },
          { label: "This session used", value: methods.length ? methods.join(" + ") : "—" },
          { label: "Last sign-in", value: formatWhen(conn.lastSignIn) },
          {
            label: "Access token expires",
            value: conn.expiresAt ? formatWhen(new Date(conn.expiresAt * 1000).toISOString()) : "—",
          },
        ]}
      />
      <p className="mt-[10px] text-caption text-muted">
        The access token renews itself while this tab is open. The session ends when you sign out, when you sign
        out of all devices below, or when a main admin removes you from the team (that takes effect on the next
        request, whatever the token says).
      </p>
      <h4 className="mt-[16px] text-caption uppercase tracking-[0.07em] text-muted">Authenticators</h4>
      {conn.factors.length === 0 ? (
        <p className="mt-[4px] text-label text-muted">None verified.</p>
      ) : (
        <ul className="mt-[4px] flex flex-col gap-[4px]">
          {conn.factors.map((f) => (
            <li key={f.id} className="flex flex-wrap items-center gap-x-[10px] gap-y-[2px] text-label">
              <Badge tone="good">{f.factor_type}</Badge>
              <span className="tabular-nums text-ink-muted">added {formatWhen(f.created_at)}</span>
              <span className="font-mono text-caption text-muted">{f.id.slice(0, 8)}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

/* ---------------------------------------------------------------------------
 * Change password
 * ------------------------------------------------------------------------ */

function ChangePassword({ email }: { email: string | null }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const tooShort = next.length > 0 && next.length < MIN_PASSWORD;
  const mismatch = confirm.length > 0 && next !== confirm;
  const ready = !!email && current.length > 0 && next.length >= MIN_PASSWORD && next === confirm && !busy;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ready || !email) return;
    setBusy(true);
    setError(null);
    setDone(false);
    try {
      /* Proven on a throwaway client first, so a wrong current password is
         caught without touching this aal2 session (lib/admin/account.ts). */
      if (!(await verifyPassword(email, current))) {
        setError("The current password is not right.");
        return;
      }
      if (current === next) {
        setError("The new password is the same as the current one.");
        return;
      }
      const { error: updateError } = await getAdminClient().auth.updateUser({ password: next, current_password: current });
      if (updateError) {
        setError(updateError.message || "The password was not changed.");
        return;
      }
      setCurrent("");
      setNext("");
      setConfirm("");
      setDone(true);
    } catch {
      setError("The password was not changed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate>
      {/* The username field lets a password manager file the new password
          under the right account; it is not editable. */}
      <input type="email" value={email ?? ""} autoComplete="username" readOnly hidden />
      <div className="grid grid-cols-1 gap-[10px] sm:grid-cols-3">
        <Label text="Current password">
          <input
            className={INPUT}
            type="password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            autoComplete="current-password"
            disabled={busy}
          />
        </Label>
        <Label text="New password">
          <input
            className={INPUT}
            type="password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            autoComplete="new-password"
            disabled={busy}
          />
        </Label>
        <Label text="Repeat new password">
          <input
            className={INPUT}
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            disabled={busy}
          />
        </Label>
      </div>
      {tooShort ? <Hint>At least {MIN_PASSWORD} characters — {next.length} so far.</Hint> : null}
      {mismatch ? <Hint>The two new passwords do not match.</Hint> : null}
      <button type="submit" className="cta cta--sm mt-[12px] disabled:opacity-60" disabled={!ready}>
        {busy ? "Saving…" : "Change password"}
      </button>
      {error ? <Failure message={error} /> : null}
      {done ? <p className="mt-[12px] text-label text-good">Password changed. Other sessions keep working until they sign in again.</p> : null}
    </form>
  );
}

/* ---------------------------------------------------------------------------
 * Reset link and sign-out everywhere
 * ------------------------------------------------------------------------ */

function ResetLink({ email }: { email: string | null }) {
  const [state, setState] = useState<"idle" | "busy" | "sent" | "failed">("idle");
  async function send() {
    if (!email) return;
    setState("busy");
    try {
      const { error } = await getAdminClient().auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin`,
      });
      setState(error ? "failed" : "sent");
    } catch {
      setState("failed");
    }
  }
  return (
    <div>
      <button type="button" onClick={() => void send()} disabled={!email || state === "busy"} className="cta cta--sm disabled:opacity-60">
        {state === "busy" ? "Sending…" : "Email me a reset link"}
      </button>
      {state === "sent" ? <p className="mt-[8px] text-label text-ink-muted">Sent to {email}. Open it in this browser.</p> : null}
      {state === "failed" ? <Failure message="The link was not sent. Wait a minute and try again — Supabase limits how often it emails." /> : null}
    </div>
  );
}

function SignOutEverywhere() {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  async function go() {
    setBusy(true);
    try {
      /* Revokes every refresh token for this account, this browser's
         included. Access tokens already issued live out their hour, but
         nothing can renew them. */
      await getAdminClient().auth.signOut({ scope: "global" });
    } catch {
      /* The local session is cleared either way. */
    }
    window.location.assign("/admin");
  }
  return (
    <div>
      {confirming ? (
        <div className="rounded-[10px] border border-warn/30 bg-warn-soft px-[12px] py-[10px]">
          <p className="text-label text-ink">
            Sign out on every device, including this one? You will need your password and authenticator again.
          </p>
          <div className="mt-[10px] flex flex-wrap items-center gap-[12px]">
            <button type="button" onClick={() => void go()} disabled={busy} className="cta cta--sm disabled:opacity-60">
              {busy ? "Signing out…" : "Sign out everywhere"}
            </button>
            <button type="button" onClick={() => setConfirming(false)} disabled={busy} className="text-label text-muted underline underline-offset-2">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => setConfirming(true)} className="cta cta--sm">
          Sign out of all devices
        </button>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Replace authenticator
 *
 * Only after a FRESH code from the current authenticator: an unattended aal2
 * tab must not be enough to move someone's second factor to a new phone. The
 * old factor is removed only once the new one has verified, so a failed setup
 * never leaves the account without one.
 * ------------------------------------------------------------------------ */

type Swap =
  | { step: "idle" }
  | { step: "challenge" }
  | { step: "enrol"; factorId: string; qr: string; secret: string }
  | { step: "done" };

function qrSrc(qr: string): string {
  return qr.startsWith("data:") ? qr : `data:image/svg+xml;utf-8,${encodeURIComponent(qr)}`;
}

function sixDigits(v: string): string {
  return v.replace(/\D/g, "").slice(0, 6);
}

function ReplaceAuthenticator({ factors, onChanged }: { factors: Factor[]; onChanged: () => void }) {
  const [swap, setSwap] = useState<Swap>({ step: "idle" });
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const oldIds = useRef<string[]>([]);

  async function challengeOld(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const current = factors[0];
    if (!current || code.length !== 6 || busy) return;
    setBusy(true);
    setError(null);
    try {
      const mfa = getAdminClient().auth.mfa;
      const { error: verifyError } = await mfa.challengeAndVerify({ factorId: current.id, code });
      if (verifyError) {
        setCode("");
        setError("That code was not accepted. Try the next one.");
        return;
      }
      oldIds.current = factors.map((f) => f.id);
      const suffix = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now());
      const { data, error: enrolError } = await mfa.enroll({
        factorType: "totp",
        friendlyName: `authenticator ${suffix}`,
        issuer: "SMS Code",
      });
      if (enrolError || !data) {
        setError("Could not start the new authenticator. Nothing was changed.");
        return;
      }
      setCode("");
      setSwap({ step: "enrol", factorId: data.id, qr: data.totp.qr_code, secret: data.totp.secret });
    } catch {
      setError("That did not work. Nothing was changed.");
    } finally {
      setBusy(false);
    }
  }

  async function verifyNew(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (swap.step !== "enrol" || code.length !== 6 || busy) return;
    setBusy(true);
    setError(null);
    try {
      const mfa = getAdminClient().auth.mfa;
      const { error: verifyError } = await mfa.challengeAndVerify({ factorId: swap.factorId, code });
      if (verifyError) {
        setCode("");
        setError("That code was not accepted. Check the new app's clock and try the next one.");
        return;
      }
      /* The new factor works; only now do the old ones go. */
      for (const id of oldIds.current) {
        await mfa.unenroll({ factorId: id });
      }
      setSwap({ step: "done" });
      onChanged();
    } catch {
      setError("The new authenticator is set up, but removing the old one failed. Reload to see both.");
    } finally {
      setBusy(false);
    }
  }

  function cancel() {
    /* An enrolled-but-unverified factor is harmless (listFactors ignores it)
       but untidy; try to remove it. */
    if (swap.step === "enrol") void getAdminClient().auth.mfa.unenroll({ factorId: swap.factorId }).catch(() => undefined);
    setSwap({ step: "idle" });
    setCode("");
    setError(null);
  }

  if (swap.step === "done") {
    return <p className="text-label text-good">New authenticator in place; the old one was removed.</p>;
  }
  if (swap.step === "idle") {
    return (
      <button type="button" onClick={() => setSwap({ step: "challenge" })} disabled={factors.length === 0} className="cta cta--sm disabled:opacity-60">
        Move to a new authenticator
      </button>
    );
  }
  return (
    <div>
      {swap.step === "challenge" ? (
        <form onSubmit={challengeOld} className="max-w-[320px]">
          <Label text="Code from your current authenticator">
            <input
              className={`${INPUT} text-center tracking-[0.4em]`}
              value={code}
              onChange={(e) => setCode(sixDigits(e.target.value))}
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="000000"
              disabled={busy}
            />
          </Label>
          <div className="mt-[10px] flex flex-wrap items-center gap-[12px]">
            <button type="submit" className="cta cta--sm disabled:opacity-60" disabled={busy || code.length !== 6}>
              {busy ? "Checking…" : "Continue"}
            </button>
            <button type="button" onClick={cancel} className="text-label text-muted underline underline-offset-2">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={verifyNew} className="max-w-[360px]">
          <p className="text-label text-ink-muted">Scan this with the new authenticator app, then enter the code it shows.</p>
          <div className="mt-[10px] flex justify-center rounded-[14px] border border-border bg-card p-[12px]">
            {/* eslint-disable-next-line @next/next/no-img-element -- a data-URI SVG from GoTrue. */}
            <img src={qrSrc(swap.qr)} alt="Authenticator setup QR code" width={160} height={160} className="h-[160px] w-[160px]" />
          </div>
          <code className="mt-[8px] block select-all break-all rounded-[10px] bg-panel px-[12px] py-[8px] text-caption">{swap.secret}</code>
          <div className="mt-[10px]">
            <Label text="Code from the new app">
              <input
                className={`${INPUT} text-center tracking-[0.4em]`}
                value={code}
                onChange={(e) => setCode(sixDigits(e.target.value))}
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="000000"
                disabled={busy}
              />
            </Label>
          </div>
          <div className="mt-[10px] flex flex-wrap items-center gap-[12px]">
            <button type="submit" className="cta cta--sm disabled:opacity-60" disabled={busy || code.length !== 6}>
              {busy ? "Checking…" : "Confirm new authenticator"}
            </button>
            <button type="button" onClick={cancel} className="text-label text-muted underline underline-offset-2">
              Cancel
            </button>
          </div>
        </form>
      )}
      {error ? <Failure message={error} /> : null}
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * The screen
 * ------------------------------------------------------------------------ */

function Settings() {
  const { state } = useMe();
  const [conn, setConn] = useState<Connection | null>(null);
  const [nonce, setNonce] = useState(0);
  const reload = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    let cancelled = false;
    void loadConnection()
      .then((c) => {
        if (!cancelled) setConn(c);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [nonce]);

  /* The address comes from admin_me when it is there, else from the session —
     so the password and reset forms still work before 20260846 is applied. */
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  useEffect(() => {
    void getAdminClient()
      .auth.getSession()
      .then(({ data }) => setSessionEmail(data.session?.user.email ?? null))
      .catch(() => undefined);
  }, []);
  const email = (state.phase === "ready" ? state.me.email : null) ?? sessionEmail;

  return (
    <>
      <PageHeader title="Settings" subtitle="Your own account: who you are here, how you are signed in, and your password." />
      <div className="grid grid-cols-1 gap-[12px] lg:grid-cols-2">
        <Card title="My account">
          <MyAccount />
        </Card>
        <Card title="How I'm connected">
          <Connected conn={conn} />
        </Card>
      </div>
      <div className="mt-[12px] grid grid-cols-1 gap-[12px]">
        <Card title="Change password" note={`At least ${MIN_PASSWORD} characters. Your current password is checked first.`}>
          <ChangePassword email={email} />
        </Card>
        <div className="grid grid-cols-1 gap-[12px] lg:grid-cols-3">
          <Card title="Forgot it?" note="A reset link to your own address.">
            <ResetLink email={email} />
          </Card>
          <Card title="Sign out everywhere" note="Ends every session on every device.">
            <SignOutEverywhere />
          </Card>
          <Card title="Authenticator" note="Needs a fresh code from the current one.">
            <ReplaceAuthenticator factors={conn?.factors ?? []} onChanged={reload} />
          </Card>
        </div>
      </div>
    </>
  );
}

export default function AdminSettingsPage() {
  return (
    <AuthGate>
      <Settings />
    </AuthGate>
  );
}
