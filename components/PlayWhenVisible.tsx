"use client";

import { useEffect, useRef, type ReactNode } from "react";

/*
 * Sets data-play on its wrapper while it is on screen and the tab is visible.
 * Decorative CSS loops (.ambient, .price-art) are paused unless an ancestor
 * carries [data-play], so a page full of them only animates what is in view.
 * Reduced motion never gets the attribute.
 */
export function PlayWhenVisible({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let onScreen = false;
    const sync = () => {
      if (onScreen && !document.hidden) el.dataset.play = "";
      else delete el.dataset.play;
    };
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
