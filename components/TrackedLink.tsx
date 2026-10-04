"use client";

import { trackEvent } from "../lib/consent";

/** An outbound link that records an event (via trackEvent) on click. The only
 *  client-side piece of the store CTAs, so their copy stays server-rendered. */
export function TrackedLink({
  href,
  event,
  placement,
  className,
  children,
}: {
  href: string;
  event: string;
  placement: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a href={href} onClick={() => trackEvent(event, { placement })} className={className}>
      {children}
    </a>
  );
}
