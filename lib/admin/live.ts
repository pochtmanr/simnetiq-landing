"use client";

import { useEffect, useRef, useState } from "react";
import { getAdminClient } from "./client";

/* ---------------------------------------------------------------------------
 * Live signals for the panel: the private Realtime topic 'admin:live'.
 *
 * Postgres broadcasts a small signal (kind + id, never a phone number, code
 * or email) whenever an ops_events row is written — purchase, refund,
 * sign-up, ticket, delivered or failed SMS, alert — and whenever an
 * activation changes status (sms-expo migration 20261005000100_tg_miniapp).
 * Only is_admin() sessions may receive the topic (a realtime.messages
 * policy), so screens treat a signal as "refetch through the audited RPCs",
 * not as data.
 * ------------------------------------------------------------------------ */

export type LiveEvent =
  | { event: "ops_event"; payload: { id: number; kind: string; severity: string; at: string } }
  | { event: "activation"; payload: { id: string; status: string; service: string; country: number; at: string } };

export type LiveState = "connecting" | "live" | "offline";

/**
 * Subscribes while mounted. `onEvent` may change between renders; the latest
 * one is called. Reconnects are handled by realtime-js.
 */
export function useAdminLive(onEvent: (e: LiveEvent) => void): LiveState {
  const [state, setState] = useState<LiveState>("connecting");
  const handler = useRef(onEvent);
  useEffect(() => {
    handler.current = onEvent;
  });

  useEffect(() => {
    const client = getAdminClient();
    let cancelled = false;
    const channel = client.channel("admin:live", { config: { private: true } });
    channel.on("broadcast", { event: "*" }, (msg) => {
      handler.current({ event: msg.event, payload: msg.payload } as LiveEvent);
    });
    void (async () => {
      /* A private channel joins with the current token; set it first. */
      await client.realtime.setAuth().catch(() => undefined);
      if (cancelled) return;
      channel.subscribe((status) => {
        if (cancelled) return;
        setState(status === "SUBSCRIBED" ? "live" : status === "CLOSED" || status === "CHANNEL_ERROR" || status === "TIMED_OUT" ? "offline" : "connecting");
      });
    })();
    return () => {
      cancelled = true;
      void client.removeChannel(channel);
    };
  }, []);

  return state;
}

/** A small "Live" pill for page headers. */
export const LIVE_LABEL: Record<LiveState, string> = {
  connecting: "Connecting…",
  live: "Live",
  offline: "Offline",
};
