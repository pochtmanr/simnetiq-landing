"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { isAdminDenied, isMigrationMissing, rpc, type AdminMe } from "../../../../lib/admin/rpc";

/* ---------------------------------------------------------------------------
 * Who the signed-in operator is, for the whole panel.
 *
 * Loaded once per page by AuthGate's `ready` branch, so the nav can decide
 * whether to show Team and a page can tell an owner from a worker without a
 * second round trip.
 *
 * This is presentation, never permission. Hiding the Team link from a worker
 * is courtesy; the refusal is `owner_assert()` in Postgres, which raises 42501
 * whatever the browser thinks the role is. Anything that reads `isOwner` to
 * decide what to SHOW is fine; nothing may read it to decide what is ALLOWED.
 * ------------------------------------------------------------------------ */

export type MeState =
  | { phase: "loading" }
  | { phase: "ready"; me: AdminMe }
  /** admin_me is not in the database yet (20260846 not applied). The panel
   *  still works; team features are simply absent. */
  | { phase: "missing" }
  /** 42501: not an admin. The page's own RPCs will render the denied screen. */
  | { phase: "denied" }
  | { phase: "error"; message: string };

type MeContext = { state: MeState; isOwner: boolean; reload: () => void };

const Ctx = createContext<MeContext>({ state: { phase: "loading" }, isOwner: false, reload: () => {} });

export function MeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MeState>({ phase: "loading" });
  const [nonce, setNonce] = useState(0);
  const reload = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const me = await rpc.me();
        if (!cancelled) setState({ phase: "ready", me });
      } catch (err) {
        if (cancelled) return;
        if (isAdminDenied(err)) setState({ phase: "denied" });
        else if (isMigrationMissing(err)) setState({ phase: "missing" });
        else setState({ phase: "error", message: err instanceof Error ? err.message : String(err) });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [nonce]);

  const isOwner = state.phase === "ready" && state.me.role === "owner";
  return <Ctx.Provider value={{ state, isOwner, reload }}>{children}</Ctx.Provider>;
}

export function useMe(): MeContext {
  return useContext(Ctx);
}
