"use client";

import Link from "next/link";
import {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { getAdminClient } from "../../../lib/admin/client";
import {
  isAdminDenied,
  resolveAdminState,
  type AdminState,
} from "../../../lib/admin/guard";
import { BottomNav, TopNav } from "./components/Nav";
import { SkeletonRows, SkeletonStats } from "./components/States";

/* ---------------------------------------------------------------------------
 * The gate every admin screen sits behind.
 *
 * <AuthGate> renders its children only for an `aal2` session. Everything else
 * it handles itself: the sign-in form, TOTP enrolment and the six-digit
 * challenge. It signs the operator in on the URL they opened, so a link from
 * the ops bot to /admin/users/<id> lands on that user after the code.
 *
 * It is a *router between screens*, not a permission check. Nothing here
 * decides who is an admin. `is_admin()` in Postgres does, on every single RPC,
 * and it demands allowlist membership as well as `aal2`. A stranger who signs
 * in with some other Supabase account can walk all the way through enrolment
 * to `ready` and will then be told 42501 by the first call the page makes —
 * which surfaces as `AdminDenied` and renders <DeniedBody>. See
 * lib/admin/guard.ts for why duplicating the check here would be worse than
 * useless.
 *
 * The route used to hide behind a 404 (proxy.ts plus an entry cookie). That
 * was dropped on 2026-09-23: Telegram's in-app browser never had the cookie,
 * so every link from the ops bot opened a 404. Sign-in still gives one error
 * string for every cause, so the form confirms nothing about accounts.
 * ------------------------------------------------------------------------ */

/* ---------------------------------------------------------------------------
 * The denied body
 * ------------------------------------------------------------------------ */

/**
 * What a signed-in account that is not on the allowlist sees. Rendered by the
 * boundary below and by every screen that catches `AdminDenied` itself.
 */
export function DeniedBody() {
  async function signOut() {
    try {
      await getAdminClient().auth.signOut();
    } catch {
      /* The local session is cleared either way. */
    }
    window.location.reload();
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <h1 className="text-subheading">This account has no access</h1>
      <p className="mt-[10px] max-w-md text-body text-ink-muted">
        Sign out and sign in with an operator account.
      </p>
      <div className="mt-[24px] flex items-center gap-[10px]">
        <button type="button" onClick={signOut} className="cta">
          Sign out
        </button>
        <Link href="/" className="ghost-link text-label">
          Home
        </Link>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Denial boundary
 * ------------------------------------------------------------------------ */

/**
 * Renders <DeniedBody> if a child throws `AdminDenied` while rendering, and
 * re-throws anything else so that a genuine bug still reaches Next's own error
 * handling instead of being disguised as a denial.
 *
 * Screens catch their own `AdminDenied` around each RPC call — an awaited
 * rejection in an event handler never reaches a boundary. This exists for the
 * render-phase case, so that denial renders the same way even when a screen
 * forgets.
 */
class DeniedBoundary extends Component<
  { children: ReactNode },
  { error: unknown }
> {
  state: { error: unknown } = { error: null };

  static getDerivedStateFromError(error: unknown): { error: unknown } {
    return { error };
  }

  render(): ReactNode {
    if (this.state.error !== null) {
      if (isAdminDenied(this.state.error)) return <DeniedBody />;
      /* Not ours. Hand it to the boundary above; React does not re-enter this
         one, so this is a hand-off, not a loop. */
      throw this.state.error;
    }
    return this.props.children;
  }
}

/* ---------------------------------------------------------------------------
 * Small shared pieces
 * ------------------------------------------------------------------------ */

/** A centred card. Every pre-`ready` screen is one of these. */
function Screen({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="card w-full max-w-[420px]">{children}</div>
    </div>
  );
}

function Notice({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="mt-[14px] text-label text-ink-muted">
      {children}
    </p>
  );
}

/** A six-digit TOTP field. Digits only, because a pasted code with a space in
 *  it is otherwise a mystifying rejection. */
function CodeField({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (next: string) => void;
  disabled: boolean;
}) {
  return (
    <input
      className="field text-center tracking-[0.4em]"
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
      inputMode="numeric"
      autoComplete="one-time-code"
      pattern="[0-9]*"
      maxLength={6}
      placeholder="000000"
      aria-label="Six-digit code"
      disabled={disabled}
      required
    />
  );
}

/** The way out of a half-finished session: sign out and start over. Without
 *  it, someone signed in as the wrong account is stuck on a screen that can
 *  never succeed. */
function SignOutLink({ onSignOut }: { onSignOut: () => void }) {
  return (
    <button
      type="button"
      onClick={onSignOut}
      className="mt-[18px] text-label text-muted underline underline-offset-2"
    >
      Start over
    </button>
  );
}

/* ---------------------------------------------------------------------------
 * Sign in
 * ------------------------------------------------------------------------ */

/**
 * Email + password.
 *
 * Every failure — unknown address, wrong password, rate limit, network — shows
 * the same four words. Distinguishing them turns this form into an oracle that
 * confirms whether an address has an account, which is exactly the question an
 * attacker who found this page would want answered.
 */
function SignIn({ onSignedIn }: { onSignedIn: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const [resetNote, setResetNote] = useState<string | null>(null);

  /* Same answer whether or not the address has an account, for the reason
     above. The link comes back to /admin, where AuthGate picks it up. */
  async function forgot() {
    if (!email.trim()) {
      setResetNote("Type your email above first.");
      return;
    }
    setResetNote(null);
    try {
      await getAdminClient().auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/admin`,
      });
    } catch {
      /* Ignored: the answer below is the same either way. */
    }
    setResetNote("If that address has an account, a reset link is on its way. Open it in this browser.");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setFailed(false);
    try {
      const { error } = await getAdminClient().auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setFailed(true);
        return;
      }
      onSignedIn();
    } catch {
      /* Thrown rather than returned — a missing env var, an offline browser.
         Same message; the operator retries, and nobody learns anything. */
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className="flex flex-col gap-[10px]">
        <input
          className="field"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          placeholder="Email"
          aria-label="Email"
          required
        />
        <input
          className="field"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          placeholder="Password"
          aria-label="Password"
          required
        />
      </div>
      <button type="submit" className="cta mt-[14px] w-full justify-center disabled:opacity-60" disabled={busy}>
        {busy ? "Checking…" : "Continue"}
      </button>
      {failed ? <Notice>Sign in failed.</Notice> : null}
      <button
        type="button"
        onClick={() => void forgot()}
        disabled={busy}
        className="mt-[14px] text-label text-muted underline underline-offset-2"
      >
        Forgot password?
      </button>
      {resetNote ? <Notice>{resetNote}</Notice> : null}
    </form>
  );
}

/* ---------------------------------------------------------------------------
 * Password reset
 * ------------------------------------------------------------------------ */

const MIN_PASSWORD = 12;

/**
 * Shown after a password-reset link. The link has already signed this browser
 * in (aal1 only), so all that is left is the new password; the gate then
 * continues to the authenticator step as usual.
 */
function SetPassword({ onDone, onSignOut }: { onDone: () => void; onSignOut: () => void }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    if (password.length < MIN_PASSWORD) {
      setMessage(`Use at least ${MIN_PASSWORD} characters.`);
      return;
    }
    if (password !== confirm) {
      setMessage("The two passwords do not match.");
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      const { error } = await getAdminClient().auth.updateUser({ password });
      if (error) {
        setMessage(error.message || "Could not set the password. Request a new link.");
        return;
      }
      onDone();
    } catch {
      setMessage("Could not set the password. Request a new link.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      <h1 className="font-sans text-subheading">Set a new password</h1>
      <form onSubmit={submit} className="mt-[18px] flex flex-col gap-[10px]">
        <input
          className="field"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          placeholder={`New password (${MIN_PASSWORD}+ characters)`}
          aria-label="New password"
          required
        />
        <input
          className="field"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          autoComplete="new-password"
          placeholder="Repeat it"
          aria-label="Repeat new password"
          required
        />
        <button type="submit" className="cta mt-[4px] w-full justify-center disabled:opacity-60" disabled={busy}>
          {busy ? "Saving…" : "Save password"}
        </button>
      </form>
      {message ? <Notice>{message}</Notice> : null}
      <SignOutLink onSignOut={onSignOut} />
    </Screen>
  );
}

/**
 * A reset link sent from the Supabase dashboard arrives as
 * `#access_token=…&refresh_token=…&type=recovery` (implicit flow). The panel's
 * client is PKCE, which ignores that shape, so the session is taken from the
 * hash by hand. The hash is wiped first either way: those tokens must not
 * survive in the address bar or history.
 */
async function consumeRecoveryHash(): Promise<boolean> {
  if (typeof window === "undefined" || !window.location.hash) return false;
  const params = new URLSearchParams(window.location.hash.slice(1));
  if (params.get("type") !== "recovery") return false;
  window.history.replaceState(null, "", window.location.pathname + window.location.search);
  const access_token = params.get("access_token");
  const refresh_token = params.get("refresh_token");
  if (!access_token || !refresh_token) return false;
  try {
    const { error } = await getAdminClient().auth.setSession({ access_token, refresh_token });
    return !error;
  } catch {
    return false;
  }
}

/* ---------------------------------------------------------------------------
 * Enrolment
 * ------------------------------------------------------------------------ */

type Enrolment = { factorId: string; qrCode: string; secret: string };

/**
 * A name no previous attempt can have used.
 *
 * This matters more than it looks. `listFactors()` files *verified* factors
 * under `data.totp`; an enrolment the operator abandons leaves an unverified
 * factor behind, invisible there but very much present in `auth.mfa_factors`.
 * A constant `friendlyName` collides with that leftover and GoTrue answers 422
 * — so the retry after one mistyped code fails forever, for a reason the
 * screen cannot see. A unique name per attempt makes every retry a fresh
 * factor. Only the one that gets verified is ever used.
 */
function uniqueFactorName(): string {
  const suffix =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `authenticator ${suffix}`;
}

/** GoTrue returns the QR as an SVG document, and documents that you make it
 *  usable by prefixing the data-URI header. Newer versions already return a
 *  data URI, so accept both rather than guessing. */
function qrSrc(qrCode: string): string {
  if (qrCode.startsWith("data:")) return qrCode;
  return `data:image/svg+xml;utf-8,${encodeURIComponent(qrCode)}`;
}

function Enrol({
  onVerified,
  onSignOut,
}: {
  onVerified: () => void;
  onSignOut: () => void;
}) {
  const [enrolment, setEnrolment] = useState<Enrolment | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  /* React runs effects twice in development. Without this, every page load
     would burn a second unverified factor — harmless, thanks to the unique
     name above, but it litters auth.mfa_factors. */
  const started = useRef(false);

  const start = useCallback(async () => {
    setBusy(true);
    setMessage(null);
    setCode("");
    setEnrolment(null);
    try {
      const { data, error } = await getAdminClient().auth.mfa.enroll({
        factorType: "totp",
        friendlyName: uniqueFactorName(),
        issuer: "SMS Code",
      });
      if (error || !data) {
        setMessage("Could not start setup. Reload and try again.");
        return;
      }
      setEnrolment({
        factorId: data.id,
        qrCode: data.totp.qr_code,
        secret: data.totp.secret,
      });
    } catch {
      setMessage("Could not start setup. Reload and try again.");
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void start();
  }, [start]);

  async function verify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || !enrolment) return;
    setBusy(true);
    setMessage(null);
    try {
      const { error } = await getAdminClient().auth.mfa.challengeAndVerify({
        factorId: enrolment.factorId,
        code,
      });
      if (error) {
        setCode("");
        setMessage(
          "That code was not accepted. Codes last 30 seconds — check your phone's clock and try the next one.",
        );
        return;
      }
      onVerified();
    } catch {
      setMessage("That code was not accepted. Try the next one.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      <h1 className="font-sans text-subheading">Set up your authenticator</h1>
      <p className="mt-[8px] text-body text-ink-muted">
        Scan this with an authenticator app, then enter the code it shows.{" "}
        <strong className="font-medium text-ink">
          This is shown once — it cannot be displayed again after setup
          finishes.
        </strong>{" "}
        Store the key somewhere safe.
      </p>

      {enrolment ? (
        <>
          <div className="mt-[18px] flex justify-center rounded-[14px] border border-border bg-card p-[14px]">
            {/* eslint-disable-next-line @next/next/no-img-element -- a data-URI
                SVG from GoTrue; next/image would only add a loader to it. */}
            <img
              src={qrSrc(enrolment.qrCode)}
              alt="Authenticator setup QR code"
              width={180}
              height={180}
              className="h-[180px] w-[180px]"
            />
          </div>

          <p className="mt-[14px] text-caption text-muted">
            If the QR will not scan, type this key in instead:
          </p>
          <code className="mt-[6px] block select-all break-all rounded-[10px] bg-panel px-[12px] py-[10px] text-label">
            {enrolment.secret}
          </code>

          <form onSubmit={verify} className="mt-[18px]">
            <CodeField value={code} onChange={setCode} disabled={busy} />
            <button
              type="submit"
              className="cta mt-[12px] w-full justify-center disabled:opacity-60"
              disabled={busy || code.length !== 6}
            >
              {busy ? "Checking…" : "Confirm"}
            </button>
          </form>
        </>
      ) : (
        <p className="mt-[18px] text-body text-ink-muted">
          {busy ? "Preparing…" : "Nothing to show."}
        </p>
      )}

      {message ? <Notice>{message}</Notice> : null}
      <SignOutLink onSignOut={onSignOut} />
    </Screen>
  );
}

/* ---------------------------------------------------------------------------
 * Challenge
 * ------------------------------------------------------------------------ */

function Challenge({
  onVerified,
  onSignOut,
}: {
  onVerified: () => void;
  onSignOut: () => void;
}) {
  const [factorId, setFactorId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const { data, error } = await getAdminClient().auth.mfa.listFactors();
        if (cancelled) return;
        /* `data.totp` is verified factors only, which is the whole reason this
           screen is showing rather than the enrolment one. */
        const factor = error ? undefined : data?.totp[0];
        if (!factor) {
          setMessage("Could not load your authenticator. Reload the page.");
          return;
        }
        setFactorId(factor.id);
      } catch {
        if (!cancelled) {
          setMessage("Could not load your authenticator. Reload the page.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function verify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || !factorId) return;
    setBusy(true);
    setMessage(null);
    try {
      const { error } = await getAdminClient().auth.mfa.challengeAndVerify({
        factorId,
        code,
      });
      if (error) {
        setCode("");
        setMessage("That code was not accepted. Try the next one.");
        return;
      }
      /* The session is aal2 from here. Re-resolve rather than assuming, so the
         panel only appears once the client agrees it did. */
      onVerified();
    } catch {
      setMessage("That code was not accepted. Try the next one.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      <h1 className="font-sans text-subheading">Enter your code</h1>
      <p className="mt-[8px] text-body text-ink-muted">
        Open your authenticator app and type the current six digits.
      </p>
      <form onSubmit={verify} className="mt-[18px]">
        <CodeField value={code} onChange={setCode} disabled={busy || !factorId} />
        <button
          type="submit"
          className="cta mt-[12px] w-full justify-center disabled:opacity-60"
          disabled={busy || !factorId || code.length !== 6}
        >
          {busy ? "Checking…" : "Continue"}
        </button>
      </form>
      {message ? <Notice>{message}</Notice> : null}
      <SignOutLink onSignOut={onSignOut} />
    </Screen>
  );
}

/* ---------------------------------------------------------------------------
 * Panel chrome
 * ------------------------------------------------------------------------ */

/**
 * The header. It lives here rather than in layout.tsx so that only a session
 * that already cleared password + TOTP ever sees the nav.
 */
function Chrome({
  children,
  onSignOut,
}: {
  children: ReactNode;
  onSignOut: () => void;
}) {
  return (
    <>
      <TopNav onSignOut={onSignOut} />
      <main className="mx-auto min-h-[calc(100dvh-49px)] w-full max-w-[1160px] flex-1 px-[clamp(16px,3vw,28px)] pt-[22px] pb-[calc(90px+env(safe-area-inset-bottom))] md:pt-[28px] md:pb-[40px]">
        {children}
      </main>
      <BottomNav onSignOut={onSignOut} />
    </>
  );
}

function GateSkeleton() {
  return (
    <div className="flex min-h-dvh flex-1 flex-col" aria-busy="true" aria-label="Loading">
      <div className="h-[49px] border-b border-border bg-card" />
      <main className="mx-auto min-h-[calc(100dvh-49px)] w-full max-w-[1160px] flex-1 px-[clamp(16px,3vw,28px)] pt-[22px] md:pt-[28px]">
        <div className="mb-[18px] h-[28px] w-[160px] animate-pulse rounded-[8px] bg-panel" />
        <SkeletonStats n={8} />
        <div className="mt-[24px]">
          <SkeletonRows n={8} />
        </div>
      </main>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * The gate
 * ------------------------------------------------------------------------ */

/** The session's state, or `anon` if it cannot be worked out at all.
 *
 *  resolveAdminState swallows its own auth errors, so a throw here means the
 *  client itself could not be built — a missing NEXT_PUBLIC_ variable on this
 *  deployment. That falls to `anon` deliberately: a misconfigured build fails
 *  shut, at the sign-in form. */
async function currentState(): Promise<AdminState> {
  try {
    return await resolveAdminState(getAdminClient());
  } catch {
    return "anon";
  }
}

export function AuthGate({ children }: { children: ReactNode }) {
  /* null while the first resolve is in flight. Rendering nothing until then
     avoids the sign-in form flashing in front of an operator who is signed
     in. */
  const [state, setState] = useState<AdminState | null>(null);
  /* True after a password-reset link: ask for the new password first. */
  const [recovering, setRecovering] = useState(false);

  const refresh = useCallback(async () => {
    setState(await currentState());
  }, []);

  useEffect(() => {
    let cancelled = false;
    /* A reset requested from the form comes back as ?code=… (PKCE); the
       client exchanges it on its own and announces PASSWORD_RECOVERY. */
    const { data: sub } = getAdminClient().auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" && !cancelled) setRecovering(true);
    });
    void (async () => {
      const fromHash = await consumeRecoveryHash();
      if (fromHash && !cancelled) setRecovering(true);
      const next = await currentState();
      if (!cancelled) setState(next);
    })();
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signOut = useCallback(async () => {
    setRecovering(false);
    try {
      await getAdminClient().auth.signOut();
    } catch {
      /* Ignored deliberately: the local session is cleared either way, and the
         re-resolve below is what decides which screen comes next. */
    }
    await refresh();
  }, [refresh]);

  /* While the session resolves, paint the panel's shape — header, cards, rows —
     rather than an empty page that then jumps into place. It shows no data and
     no nav links, so it tells a signed-out visitor nothing. */
  if (state === null) return <GateSkeleton />;

  /* With an authenticator already set up, Supabase refuses a password change
     on an aal1 session, so the code comes first (needsChallenge renders
     below) and the new password right after. */
  if (recovering && (state === "needsEnrol" || state === "ready")) {
    return (
      <SetPassword
        onDone={() => {
          setRecovering(false);
          void refresh();
        }}
        onSignOut={signOut}
      />
    );
  }

  if (state === "anon") {
    return (
      <Screen>
        <h1 className="font-sans text-subheading">Sign in</h1>
        <p className="mt-[8px] mb-[18px] text-body text-ink-muted">
          SMS Code operations. Password, then your authenticator code.
        </p>
        <SignIn onSignedIn={refresh} />
      </Screen>
    );
  }

  if (state === "needsEnrol") {
    return <Enrol onVerified={refresh} onSignOut={signOut} />;
  }

  if (state === "needsChallenge") {
    return <Challenge onVerified={refresh} onSignOut={signOut} />;
  }

  // The boundary sits OUTSIDE Chrome so a denied account never sees the nav
  // of a panel it cannot use.
  return (
    <DeniedBoundary>
      <Chrome onSignOut={signOut}>{children}</Chrome>
    </DeniedBoundary>
  );
}

export default AuthGate;
