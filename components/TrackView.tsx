"use client";

import { useEffect } from "react";
import { trackView } from "../lib/consent";

/** Reports that this page is about one thing (Meta ViewContent). Renders
 *  nothing; does nothing without marketing consent. */
export function TrackView({ type, name }: { type: string; name: string }) {
  useEffect(() => trackView(type, name), [type, name]);
  return null;
}
