import Link from "next/link";
import type { ReactNode } from "react";

/* ---------------------------------------------------------------------------
 * Containers: the white card, the titled section, and the page header.
 * ------------------------------------------------------------------------ */

export function Card({
  title,
  note,
  actions,
  children,
  className = "",
  pad = true,
}: {
  title?: ReactNode;
  note?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  /** False for a card whose body (a list) runs edge to edge. */
  pad?: boolean;
}) {
  return (
    <section className={`rounded-card border border-border bg-card ${className}`}>
      {title || actions ? (
        <header className="flex flex-wrap items-center justify-between gap-x-[12px] gap-y-[6px] border-b border-border px-[16px] py-[12px]">
          <div className="min-w-0">
            {title ? <h3 className="text-body font-semibold">{title}</h3> : null}
            {note ? <p className="mt-[1px] text-caption text-muted">{note}</p> : null}
          </div>
          {actions ? <div className="flex flex-wrap items-center gap-[8px]">{actions}</div> : null}
        </header>
      ) : null}
      <div className={pad ? "p-[16px]" : ""}>{children}</div>
    </section>
  );
}

export function Section({
  title,
  note,
  actions,
  children,
}: {
  title: string;
  note?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="mt-[30px]">
      <div className="flex flex-wrap items-end justify-between gap-x-[12px] gap-y-[6px]">
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-[10px]">
          <h2 className="font-display text-[17px] font-medium tracking-[-0.01em]">{title}</h2>
          {note ? <span className="text-caption text-muted">{note}</span> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-[8px]">{actions}</div> : null}
      </div>
      <div className="mt-[10px]">{children}</div>
    </section>
  );
}

export type Crumb = { href: string; label: string };

/** Title row of every screen: breadcrumb, heading, one-line explanation, and
 *  controls that wrap under the title on a phone instead of crowding it. */
export function PageHeader({
  title,
  subtitle,
  crumbs,
  actions,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  crumbs?: Crumb[];
  actions?: ReactNode;
}) {
  return (
    <div className="mb-[18px]">
      {crumbs && crumbs.length ? (
        <nav aria-label="Breadcrumb" className="mb-[6px] flex flex-wrap items-center gap-x-[6px] text-label text-muted">
          {crumbs.map((c) => (
            <span key={c.href} className="flex items-center gap-x-[6px]">
              <Link href={c.href} className="hover:text-accent-deep hover:underline">
                {c.label}
              </Link>
              <span aria-hidden>›</span>
            </span>
          ))}
        </nav>
      ) : null}
      {/* The title and its controls share a line; a short control (the refresh
          icon) always fits beside the title, a wide one wraps under it. The
          subtitle runs full width below either way. */}
      <div className="flex flex-wrap items-center justify-between gap-x-[12px] gap-y-[10px]">
        <h1 className="min-w-0 flex-[1_1_auto] break-words font-display text-heading-sm font-medium">{title}</h1>
        {actions ? <div className="flex flex-wrap items-center gap-[8px]">{actions}</div> : null}
      </div>
      {subtitle ? <p className="mt-[2px] text-label text-ink-muted">{subtitle}</p> : null}
    </div>
  );
}

/** A small `label: value` grid for detail pages. Two columns on a phone. */
export function Facts({ items }: { items: { label: string; value: ReactNode; wide?: boolean }[] }) {
  return (
    <dl className="grid grid-cols-2 gap-x-[16px] gap-y-[12px] sm:grid-cols-3 lg:grid-cols-4">
      {items.map((it) => (
        <div key={it.label} className={`min-w-0 ${it.wide ? "col-span-2" : ""}`}>
          <dt className="text-caption uppercase tracking-[0.07em] text-muted">{it.label}</dt>
          <dd className="mt-[2px] break-words text-body">{it.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** A round icon button that stays on the title's line; spins while loading. */
export function RefreshButton({ onClick, busy = false }: { onClick: () => void; busy?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      aria-label={busy ? "Loading" : "Refresh"}
      title="Refresh"
      className="inline-flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full border border-border bg-card text-ink-muted transition-colors hover:text-ink active:bg-panel disabled:opacity-70"
    >
      <svg
        viewBox="0 0 24 24"
        className={`h-[17px] w-[17px] ${busy ? "animate-spin" : ""}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M20 12a8 8 0 1 1-2.34-5.66" />
        <path d="M20 4v5h-5" />
      </svg>
    </button>
  );
}
