"use client";

import { track } from "@vercel/analytics";

/** An outbound link that records a Vercel Analytics event on click. The only
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
    <a href={href} onClick={() => track(event, { placement })} className={className}>
      {children}
    </a>
  );
}
