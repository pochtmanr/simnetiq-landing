"use client";

import { useCallback, useEffect, useState } from "react";
import { isTelegramSession } from "../../../../lib/admin/client";
import { formatWhen } from "../../../../lib/admin/format";
import { isMigrationMissing, rpc, type TgLinkRow } from "../../../../lib/admin/rpc";
import { TG_BOT, openTelegramUrl } from "../../../../lib/admin/telegram";
import { MigrationNotice } from "../ui";

/* ---------------------------------------------------------------------------
 * Link Telegram: lets this admin open the panel as a Telegram Mini App.
 *
 * Linking starts here, on a password + TOTP session, and finishes in a
 * private chat with the ops bot: the button opens t.me/<bot>?start=link_<token>
 * (one use, 10 minutes), the bot binds the Telegram account that pressed Start
 * and puts a "Panel" button in that chat. From then on Telegram's signature
 * stands in for the code (see sms-expo functions/_shared/tgMiniApp.ts).
 * ------------------------------------------------------------------------ */

type Phase =
  | { phase: "loading" }
  | { phase: "missing" }
  | { phase: "ready"; link: TgLinkRow | null }
  | { phase: "error"; message: string };

export function LinkTelegram() {
  const [s, setS] = useState<Phase>({ phase: "loading" });
  const [busy, setBusy] = useState(false);
  const [opened, setOpened] = useState(false);

  const [nonce, setNonce] = useState(0);
  const load = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const rows = await rpc.tgLinkStatus();
        if (!cancelled) setS({ phase: "ready", link: rows[0] ?? null });
      } catch (err) {
        if (cancelled) return;
        if (isMigrationMissing(err)) setS({ phase: "missing" });
        else setS({ phase: "error", message: err instanceof Error ? err.message : String(err) });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [nonce]);

  /* Coming back from Telegram after pressing Start: show the new link. */
  useEffect(() => {
    if (!opened) return;
    const onFocus = () => load();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [opened, load]);

  async function link() {
    setBusy(true);
    try {
      const token = await rpc.tgLinkStart();
      openTelegramUrl(`https://t.me/${TG_BOT}?start=link_${token}`);
      setOpened(true);
    } catch (err) {
      setS({ phase: "error", message: err instanceof Error ? err.message : String(err) });
    } finally {
      setBusy(false);
    }
  }

  async function unlink() {
    if (!window.confirm("Unlink Telegram? The Mini App will stop signing you in.")) return;
    setBusy(true);
    try {
      await rpc.tgUnlink();
      load();
    } finally {
      setBusy(false);
    }
  }

  if (s.phase === "loading") return <p className="text-label text-muted">Loading…</p>;
  if (s.phase === "missing") return <MigrationNotice fn="admin_tg_link_status" />;
  if (s.phase === "error") return <p role="alert" className="text-label text-bad">{s.message}</p>;

  if (s.link) {
    return (
      <div>
        <p className="text-body">
          Linked to <b>{s.link.telegram_username ? `@${s.link.telegram_username}` : `Telegram ID ${s.link.telegram_user_id}`}</b>
        </p>
        <p className="mt-[4px] text-caption text-muted">
          Since {formatWhen(s.link.linked_at)}
          {s.link.last_auth_at ? ` · last opened ${formatWhen(s.link.last_auth_at)}` : ""}
        </p>
        {!isTelegramSession() ? (
          <div className="mt-[12px] flex flex-wrap gap-[8px]">
            <button type="button" onClick={link} disabled={busy} className="rounded-button border border-border bg-card px-[14px] py-[7px] text-label">
              Link a different account
            </button>
            <button type="button" onClick={unlink} disabled={busy} className="rounded-button border border-border bg-card px-[14px] py-[7px] text-label text-bad">
              Unlink
            </button>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div>
      <p className="text-body text-ink-muted">
        Open this panel inside Telegram, signed in by your Telegram account, with live updates.
      </p>
      <button type="button" onClick={link} disabled={busy} className="cta mt-[12px]">
        {busy ? "Opening…" : "Link Telegram"}
      </button>
      {opened ? (
        <p className="mt-[10px] text-caption text-muted">
          In Telegram, press <b>Start</b>. Then the <b>Panel</b> button in that chat opens the app. The link works once, for 10 minutes.
        </p>
      ) : null}
    </div>
  );
}
