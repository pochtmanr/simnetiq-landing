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

/* ---------------------------------------------------------------------------
 * The gate every admin screen sits behind.
 *
 * <AuthGate> renders its children only for an `aal2` session. Everything else
 * it handles itself: the sign-in form, TOTP enrolment, the six-digit
 * challenge, and — for anyone it cannot place — the site's ordinary 404.
 *
 * It is a *router between screens*, not a permission check. Nothing here
 * decides who is an admin. `is_admin()` in Postgres does, on every single RPC,
 * and it demands allowlist membership as well as `aal2`. A stranger who signs
 * in with some other Supabase account can walk all the way through enrolment
 * to `ready` and will then be told 42501 by the first call the page makes —
 * which surfaces as `AdminDenied` and renders as the same 404 an anonymous
 * visitor gets. See lib/admin/guard.ts for why duplicating the check here
 * would be worse than useless.
 *
 * Two concealment rules run through the whole file:
 *
 *   1. No screen below says "admin", "operator" or "panel" before the session
 *      is `aal2`. What a stranger can reach must not describe itself.
 *   2. No failure is ever explained. Sign-in has exactly one error string for
 *      every cause, and `AdminDenied` renders the 404 with no message at all.
 *      An explanation confirms the route exists, and that is the one thing
 *      worth hiding.
 * ------------------------------------------------------------------------ */

/* ---------------------------------------------------------------------------
 * The 404 body
 * ------------------------------------------------------------------------ */

/**
 * A copy of app/global-not-found.tsx's body, to the character.
 *
 * It is copied rather than imported because that file is a full document —
 * its own <html>, its own font — and this route group already has one of
 * those. If the wording there ever changes, change it here too: the whole
 * value of this component is that the two are indistinguishable.
 *
 * Exported so that Tasks 6–9 can render the identical body on `AdminDenied`
 * instead of each inventing their own.
 */
export function NotFoundBody() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <span className="tag-chip">404</span>
      <h1 className="mt-[22px] text-heading">This page doesn’t exist</h1>
      <p className="mt-[10px] max-w-md text-body text-ink-muted">
        Такой страницы нет. Everything about SMS Code lives on the home page.
      </p>
      <div className="mt-[30px] flex items-center gap-[10px]">
        <Link href="/" className="cta">
          Back to home
        </Link>
        <Link href="/ru" className="cta">
          На главную
        </Link>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Denial boundary
 * ------------------------------------------------------------------------ */

/**
 * Renders the 404 body if a child throws `AdminDenied` while rendering, and
 * re-throws anything else so that a genuine bug still reaches Next's own error
 * handling instead of being disguised as a missing page.
 *
 * Screens catch their own `AdminDenied` around each RPC call — an awaited
 * rejection in an event handler never reaches a boundary. This exists for the
 * render-phase case, so that "denied means 404" holds even when a screen
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
      if (isAdminDenied(this.state.error)) return <NotFoundBody />;
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
    </form>
  );
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
 * The header, and the only place in the app that admits what this is.
 *
 * It lives here rather than in layout.tsx on purpose: the layout wraps the 404
 * body too, and a 404 served under an "Operations" bar tells a visitor exactly
 * what they found. Rendering the chrome inside the `ready` branch means only a
 * session that already cleared password + TOTP ever sees it.
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
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex w-full max-w-[1160px] flex-wrap items-center gap-x-[20px] gap-y-[6px] px-[clamp(16px,3vw,28px)] py-[12px]">
          <span className="text-label font-semibold">Operations</span>
          <nav className="flex items-center gap-[16px] text-label text-ink-muted">
            <Link href="/admin" className="ghost-link">
              Overview
            </Link>
            <Link href="/admin/users" className="ghost-link">
              Users
            </Link>
            <Link href="/admin/support" className="ghost-link">
              Support
            </Link>
          </nav>
          <button
            type="button"
            onClick={onSignOut}
            className="ml-auto text-label text-muted underline underline-offset-2"
          >
            Sign out
          </button>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1160px] flex-1 px-[clamp(16px,3vw,28px)] py-[28px]">
        {children}
      </main>
    </>
  );
}

/* ---------------------------------------------------------------------------
 * The gate
 * ------------------------------------------------------------------------ */

/** The session's state, or `anon` if it cannot be worked out at all.
 *
 *  resolveAdminState swallows its own auth errors, so a throw here means the
 *  client itself could not be built — a missing NEXT_PUBLIC_ variable on this
 *  deployment. That falls to `anon` deliberately: a misconfigured build must
 *  fail shut and look like a missing page rather than print a diagnostic. */
async function currentState(): Promise<AdminState> {
  try {
    return await resolveAdminState(getAdminClient());
  } catch {
    return "anon";
  }
}

export function AuthGate({ children }: { children: ReactNode }) {
  /* null while the first resolve is in flight. Rendering nothing until then
     avoids a 404 flashing in front of an operator who is signed in. */
  const [state, setState] = useState<AdminState | null>(null);

  const refresh = useCallback(async () => {
    setState(await currentState());
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const next = await currentState();
      if (!cancelled) setState(next);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const signOut = useCallback(async () => {
    try {
      await getAdminClient().auth.signOut();
    } catch {
      /* Ignored deliberately: the local session is cleared either way, and the
         re-resolve below is what decides which screen comes next. */
    }
    await refresh();
  }, [refresh]);

  if (state === null) return <div className="flex-1" aria-hidden />;

  if (state === "anon") {
    /* The 404 body first, whole and unaltered, because that is what this URL
       is to everyone but one person. The sign-in form sits below it, past the
       fold, in no way announcing itself.
   
       Note this is not the concealment layer — middleware.ts is, and it has
       already answered 404 to anyone without the entry cookie. What this
       arrangement buys is that the page still says nothing about what it is
       even to someone holding that cookie, while leaving the operator a way
       in. A pure 404 here would have no way in at all: the sign-in form is at
       /admin, and you have no session until you have used it. */
    return (
      <>
        <NotFoundBody />
        <section className="border-t border-border px-6 py-[42px]">
          <div className="mx-auto w-full max-w-[360px]">
            <SignIn onSignedIn={refresh} />
          </div>
        </section>
      </>
    );
  }

  if (state === "needsEnrol") {
    return <Enrol onVerified={refresh} onSignOut={signOut} />;
  }

  if (state === "needsChallenge") {
    return <Challenge onVerified={refresh} onSignOut={signOut} />;
  }

  // The boundary sits OUTSIDE Chrome deliberately. Nested the other way, a
  // denial rendered the 404 body underneath the "Operations" header and nav —
  // a 404 with an admin console around it, which announces the route far more
  // loudly than a plain error would have. Outside, the boundary replaces the
  // whole shell, so denied looks exactly like a page that was never written.
  return (
    <DeniedBoundary>
      <Chrome onSignOut={signOut}>{children}</Chrome>
    </DeniedBoundary>
  );
}

export default AuthGate;
