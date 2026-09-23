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
          <h2 className="font-sans text-subheading">{title}</h2>
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
      <div className="flex flex-wrap items-end justify-between gap-x-[16px] gap-y-[10px]">
        <div className="min-w-0">
          <h1 className="break-words font-sans text-heading-sm font-semibold">{title}</h1>
          {subtitle ? <p className="mt-[2px] text-label text-ink-muted">{subtitle}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-[8px]">{actions}</div> : null}
      </div>
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

export function RefreshButton({ onClick, busy = false }: { onClick: () => void; busy?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className="rounded-[8px] border border-border bg-card px-[12px] py-[6px] text-label text-ink-muted hover:text-ink disabled:opacity-60"
    >
      {busy ? "Loading…" : "Refresh"}
    </button>
  );
}
