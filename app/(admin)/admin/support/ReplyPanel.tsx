"use client";

import { useEffect, useState } from "react";
import { getAdminClient } from "../../../../lib/admin/client";
import { formatWhen } from "../../../../lib/admin/format";
import {
  isAdminDenied,
  rpc,
  type SupportReplyRow,
  type SupportRow,
} from "../../../../lib/admin/rpc";

/* ---------------------------------------------------------------------------
 * The reply thread under one support ticket.
 *
 * Sending goes through /api/admin/support/reply, which forwards this
 * operator's own access token to `admin_support_reply` (so Postgres decides,
 * as for every other admin action) and then asks n8n to email the customer.
 * The reply is stored even if the email fails; the panel says so and offers
 * the operator's own mail client as the fallback.
 *
 * Replies are rendered as text, never markup, like everything on this page.
 * ------------------------------------------------------------------------ */

type SendState =
  | { phase: "idle" }
  | { phase: "sending" }
  | { phase: "sent" }
  | { phase: "unsent"; message: string }
  | { phase: "failed"; message: string };

function mailto(row: SupportRow): string {
  const subject = row.topic ? `Re: ${row.topic}` : "SMS Code support";
  return `mailto:${encodeURIComponent(row.email)}?subject=${encodeURIComponent(subject)}`;
}

export function ReplyPanel({
  row,
  onSent,
  onDenied,
}: {
  row: SupportRow;
  /** The ticket's new status and reply count, for the table row. */
  onSent: (status: "open" | "resolved") => void;
  onDenied: () => void;
}) {
  const [thread, setThread] = useState<SupportReplyRow[] | null>(null);
  const [threadError, setThreadError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [send, setSend] = useState<SendState>({ phase: "idle" });
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const data = await rpc.supportThread(row.id);
        if (!cancelled) {
          setThread(data);
          setThreadError(null);
        }
      } catch (err) {
        if (cancelled) return;
        if (isAdminDenied(err)) {
          onDenied();
          return;
        }
        setThreadError(err instanceof Error ? err.message : String(err));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [row.id, nonce, onDenied]);

  async function submit(status: "open" | "resolved") {
    const body = draft.trim();
    if (!body || send.phase === "sending") return;
    setSend({ phase: "sending" });
    try {
      const { data } = await getAdminClient().auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        setSend({ phase: "failed", message: "Session expired. Reload and sign in again." });
        return;
      }
      const res = await fetch("/api/admin/support/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: row.id, body, status }),
      });
      const out = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        sent?: boolean;
        error?: string | null;
      };
      if (res.status === 403) {
        onDenied();
        return;
      }
      if (!res.ok || !out.ok) {
        setSend({ phase: "failed", message: out.error ?? `Request failed (${res.status}).` });
        return;
      }
      setDraft("");
      setSend(
        out.sent
          ? { phase: "sent" }
          : { phase: "unsent", message: out.error ?? "The email was not sent." },
      );
      onSent(status);
      setNonce((n) => n + 1);
    } catch (err) {
      setSend({ phase: "failed", message: err instanceof Error ? err.message : String(err) });
    }
  }

  const busy = send.phase === "sending";

  return (
    <div className="mt-[10px] rounded-[10px] border border-border bg-panel p-[12px]">
      {threadError ? (
        <p role="alert" className="text-caption text-[#a32b20]">
          Could not load replies. {threadError}
        </p>
      ) : thread === null ? (
        <p className="text-caption text-muted">Loading replies…</p>
      ) : thread.length === 0 ? (
        <p className="text-caption text-muted">No replies yet.</p>
      ) : (
        <ol className="flex flex-col gap-[8px]">
          {thread.map((r) => (
            <li key={r.id} className="rounded-[8px] border border-border bg-card p-[10px]">
              <div className="text-caption text-muted">
                {formatWhen(r.created_at)} · {r.admin_email ?? "operator"} ·{" "}
                {r.sent_at ? (
                  "emailed"
                ) : (
                  <span className="text-[#a32b20]">
                    not emailed{r.send_error ? ` (${r.send_error})` : ""}
                  </span>
                )}
              </div>
              <p className="mt-[4px] whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-label text-ink">
                {r.body}
              </p>
            </li>
          ))}
        </ol>
      )}

      <textarea
        className="field mt-[10px] min-h-[110px] w-full resize-y"
        value={draft}
        onChange={(e) => setDraft(e.target.value.slice(0, 5000))}
        placeholder={row.locale === "ru" ? "Ответ клиенту (по-русски)…" : "Reply to the customer…"}
        aria-label="Reply"
        disabled={busy}
      />
      <div className="mt-[8px] flex flex-wrap items-center gap-[8px]">
        <button
          type="button"
          className="cta cta--sm disabled:opacity-60"
          disabled={busy || !draft.trim()}
          onClick={() => void submit("resolved")}
        >
          {busy ? "Sending…" : "Send & resolve"}
        </button>
        <button
          type="button"
          className="rounded-[8px] border border-border bg-card px-[12px] py-[6px] text-label text-ink disabled:opacity-60"
          disabled={busy || !draft.trim()}
          onClick={() => void submit("open")}
        >
          Send, keep open
        </button>
        <a href={mailto(row)} className="ml-auto text-caption text-muted underline underline-offset-2">
          Reply from my mail app
        </a>
      </div>
      {send.phase === "sent" ? (
        <p className="mt-[6px] text-caption text-muted">Sent.</p>
      ) : send.phase === "unsent" ? (
        <p role="alert" className="mt-[6px] text-caption text-[#a32b20]">
          Reply saved, but the email was not sent: {send.message}. Use “Reply from my mail app”.
        </p>
      ) : send.phase === "failed" ? (
        <p role="alert" className="mt-[6px] text-caption text-[#a32b20]">
          Not sent. {send.message}
        </p>
      ) : null}
    </div>
  );
}
