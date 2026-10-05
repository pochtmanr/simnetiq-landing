"use client";

import { useState } from "react";
import { formatWhen } from "../../../../lib/admin/format";
import { rpc, type TeamMember, type TeamTgLinkRow } from "../../../../lib/admin/rpc";
import { TG_BOT, openTelegramUrl } from "../../../../lib/admin/telegram";
import { CopyText } from "../ui";

/* ---------------------------------------------------------------------------
 * A main admin links a teammate's Telegram for them (admin_tg_link_for).
 *
 * The link is a credential: whoever presses Start on it gets this member's
 * panel. So it is made on demand, works once, for 24 hours, a new one voids
 * the old, and the Team list shows which Telegram account ended up linked.
 * ------------------------------------------------------------------------ */

export function telegramCell(link: TeamTgLinkRow | undefined) {
  if (link?.telegram_user_id) {
    return <span className="text-ink">{link.telegram_username ? `@${link.telegram_username}` : `ID ${link.telegram_user_id}`}</span>;
  }
  if (link?.pending_until) return <span className="text-ink-muted">link sent, until {formatWhen(link.pending_until)}</span>;
  return <span className="text-muted">not linked</span>;
}

export function TelegramInvite({
  member,
  link,
  onDone,
  onClose,
}: {
  member: TeamMember;
  link: TeamTgLinkRow | undefined;
  onDone: () => void;
  onClose: () => void;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const linked = !!link?.telegram_user_id;
  const who = member.email ?? "this member";

  async function create() {
    setBusy(true);
    setError(null);
    try {
      const token = await rpc.tgLinkFor(member.user_id);
      setUrl(`https://t.me/${TG_BOT}?start=link_${token}`);
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  async function unlink() {
    if (!window.confirm(`Unlink Telegram for ${who}? They can no longer open the panel from Telegram.`)) return;
    setBusy(true);
    try {
      await rpc.tgUnlinkFor(member.user_id);
      onDone();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  function send() {
    if (!url) return;
    const text = "Your SIMNETIQ admin panel: tap the link, then press Start. It works once, for 24 hours.";
    openTelegramUrl(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`);
  }

  return (
    <div className="rounded-card border border-border bg-card p-[16px]">
      <div className="flex items-start justify-between gap-[10px]">
        <h3 className="text-body font-semibold">Telegram for {who}</h3>
        <button type="button" onClick={onClose} className="text-label text-muted" aria-label="Close">
          ✕
        </button>
      </div>
      {linked ? (
        <p className="mt-[6px] text-label text-ink-muted">
          Linked to {telegramCell(link)} since {formatWhen(link!.linked_at)}. A new link moves it to whoever presses Start.
        </p>
      ) : (
        <p className="mt-[6px] text-label text-ink-muted">
          Make a link and send it to them in Telegram. They tap it and press Start, and the bot gives them the Panel button. No password or
          authenticator needed for the Mini App.
        </p>
      )}

      {url ? (
        <div className="mt-[12px]">
          <p className="break-all rounded-[8px] bg-panel px-[10px] py-[8px] font-mono text-caption">{url}</p>
          <div className="mt-[10px] flex flex-wrap items-center gap-[8px]">
            <button type="button" onClick={send} className="cta">
              Send in Telegram
            </button>
            <CopyText text={url} label="Copy link" />
          </div>
          <p className="mt-[8px] text-caption text-muted">
            Send it only to {who}: whoever presses Start first gets their access. Works once, for 24 hours.
          </p>
        </div>
      ) : (
        <div className="mt-[12px] flex flex-wrap gap-[8px]">
          <button type="button" onClick={create} disabled={busy} className="cta">
            {busy ? "Making…" : linked ? "Make a new link" : "Make link"}
          </button>
          {linked ? (
            <button type="button" onClick={unlink} disabled={busy} className="rounded-button border border-border bg-card px-[14px] py-[7px] text-label text-bad">
              Unlink
            </button>
          ) : null}
        </div>
      )}
      {error ? <p role="alert" className="mt-[8px] text-label text-bad">{error}</p> : null}
    </div>
  );
}
