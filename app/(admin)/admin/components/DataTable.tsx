"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, type MouseEvent, type ReactNode } from "react";
import { formatDayLabel, localDayKey } from "../../../../lib/admin/format";
import { useNow } from "./When";

/* ---------------------------------------------------------------------------
 * One table, two shapes.
 *
 * From `md` up it is a real <table>. Below `md` each row becomes a card: the
 * `title` column(s) on top, an optional `aside` (usually an amount or a badge)
 * on the right, and the remaining columns as a two-column label/value grid.
 * Nothing scrolls sideways on a phone.
 *
 * `rowHref` makes the whole row (or card) open a page. Links and buttons
 * inside cells keep working: a click that lands on one is left alone.
 *
 * `groupByDay` sorts the rows newest first and puts a separator at every day
 * change — "Today", "Yesterday", "Monday, Oct 4" — sticky under the navbar on
 * a phone. There is no client-side paging: the screen decides how many rows
 * to fetch (see FetchLimit in ui.tsx) and every fetched row is shown.
 * ------------------------------------------------------------------------ */

export type Column<T> = {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  align?: "left" | "right";
  /** Where the column goes on a phone. Default: a labelled field.
   *  `footer` is one full-width, unlabelled row at the bottom of the card. */
  mobile?: "title" | "aside" | "field" | "footer" | "hide";
  /** False for a column that only exists to shape the phone card. */
  desktop?: boolean;
  /** Extra classes on the desktop cell (widths, truncation). */
  className?: string;
  /** The cell renders its own link, so a phone card must not wrap it in the
   *  row link too — an <a> inside an <a> is invalid HTML and a hydration
   *  error. */
  linksItself?: boolean;
};

export function DataTable<T>({
  rows,
  columns,
  rowKey,
  rowHref,
  empty,
  footer,
  rowTone,
  groupByDay,
}: {
  rows: T[];
  columns: Column<T>[];
  rowKey: (row: T, index: number) => string;
  rowHref?: (row: T) => string | null | undefined;
  empty?: ReactNode;
  footer?: ReactNode;
  /** Tint a row that needs attention. */
  rowTone?: (row: T) => "bad" | "warn" | null | undefined;
  /** The row's timestamp (ISO). Sorts newest first and adds day separators. */
  groupByDay?: (row: T) => string | null | undefined;
}) {
  const router = useRouter();
  const now = useNow();

  if (rows.length === 0) {
    return <div>{empty ?? <p className="py-[18px] text-center text-label text-muted">Nothing here yet.</p>}</div>;
  }

  /* Day groups, in order. Without groupByDay it is one unlabeled group. */
  const groups: { key: string; label: string | null; rows: T[] }[] = [];
  if (groupByDay) {
    const time = (r: T) => {
      const t = new Date(groupByDay(r) ?? "").getTime();
      return Number.isNaN(t) ? -Infinity : t;
    };
    const sorted = [...rows].sort((a, b) => time(b) - time(a));
    for (const r of sorted) {
      const iso = groupByDay(r);
      const key = localDayKey(iso) ?? "none";
      const last = groups[groups.length - 1];
      if (last && last.key === key) last.rows.push(r);
      else groups.push({ key, label: formatDayLabel(iso, now), rows: [r] });
    }
  } else {
    groups.push({ key: "all", label: null, rows });
  }

  function open(e: MouseEvent, href: string | null | undefined) {
    if (!href) return;
    const target = e.target as HTMLElement;
    if (target.closest("a,button,input,select,textarea,label")) return;
    if (window.getSelection()?.toString()) return; // selecting text, not navigating
    if (e.metaKey || e.ctrlKey) window.open(href, "_blank");
    else router.push(href);
  }

  const titleCols = columns.filter((c) => c.mobile === "title");
  const asideCols = columns.filter((c) => c.mobile === "aside");
  const fieldCols = columns.filter((c) => !c.mobile || c.mobile === "field");
  const footerCols = columns.filter((c) => c.mobile === "footer");
  const tableCols = columns.filter((c) => c.desktop !== false);

  const toneBg = (row: T) => {
    const t = rowTone?.(row);
    return t === "bad" ? "bg-bad-soft/60" : t === "warn" ? "bg-warn-soft/60" : "";
  };

  return (
    <div>
      {/* Phone: cards */}
      <div className="md:hidden">
        {groups.map((g) => (
          <div key={g.key} className="mt-[14px] first:mt-0">
            {g.label ? <DaySeparator label={g.label} count={g.rows.length} /> : null}
            <ul className="flex flex-col gap-[8px]">
              {g.rows.map((row, i) => {
                const href = rowHref?.(row);
                return (
                  <li
                    key={rowKey(row, i)}
                    onClick={(e) => open(e, href)}
                    className={`rounded-card border border-border bg-card p-[12px] ${href ? "cursor-pointer active:bg-panel" : ""} ${toneBg(row)}`}
                  >
                    <div className="flex items-start justify-between gap-[10px]">
                      <div className="min-w-0 flex-1 text-body">
                        {titleCols.map((c, j) => (
                          <div key={c.key} className={j === 0 ? "break-words font-medium" : "mt-[2px] break-words text-label text-ink-muted"}>
                            {j === 0 && href && !c.linksItself ? (
                              <Link href={href} className="hover:text-accent-deep">
                                {c.cell(row)}
                              </Link>
                            ) : (
                              c.cell(row)
                            )}
                          </div>
                        ))}
                      </div>
                      {asideCols.length ? (
                        <div className="flex shrink-0 flex-col items-end gap-[4px] text-right text-body tabular-nums">
                          {asideCols.map((c) => (
                            <div key={c.key}>{c.cell(row)}</div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                    {fieldCols.length ? (
                      <dl className="mt-[8px] grid grid-cols-2 gap-x-[12px] gap-y-[6px] border-t border-border pt-[8px]">
                        {fieldCols.map((c) => (
                          <div key={c.key} className="min-w-0">
                            <dt className="text-caption uppercase tracking-[0.06em] text-muted">{c.header}</dt>
                            <dd className="break-words text-label">{c.cell(row)}</dd>
                          </div>
                        ))}
                      </dl>
                    ) : null}
                    {footerCols.map((c) => (
                      <div key={c.key} className="mt-[8px] flex items-center border-t border-border pt-[8px] text-label">
                        {c.cell(row)}
                      </div>
                    ))}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Tablet and up: table */}
      <div className="hidden overflow-x-auto rounded-card border border-border bg-card md:block">
        <table className="w-full border-collapse text-label">
          <thead>
            <tr className="border-b border-border bg-canvas/60 text-caption uppercase tracking-[0.07em] text-muted">
              {tableCols.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  className={`px-[12px] py-[9px] font-medium ${c.align === "right" ? "text-right" : "text-left"}`}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => (
              <Fragment key={g.key}>
                {g.label ? (
                  <tr className="border-b border-border bg-canvas/60">
                    <th colSpan={tableCols.length} scope="colgroup" className="px-[12px] py-[7px] text-left text-caption font-semibold text-ink">
                      {g.label}
                      <span className="ml-[8px] font-normal text-muted">{g.rows.length}</span>
                    </th>
                  </tr>
                ) : null}
                {g.rows.map((row, i) => {
                  const href = rowHref?.(row);
                  return (
                    <tr
                      key={rowKey(row, i)}
                      onClick={(e) => open(e, href)}
                      className={`border-b border-border last:border-b-0 align-top ${href ? "cursor-pointer hover:bg-canvas" : ""} ${toneBg(row)}`}
                    >
                      {tableCols.map((c) => (
                        <td
                          key={c.key}
                          className={`px-[12px] py-[9px] ${c.align === "right" ? "text-right tabular-nums" : ""} ${c.className ?? ""}`}
                        >
                          {c.cell(row)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {footer ? <div className="mt-[10px]">{footer}</div> : null}
    </div>
  );
}

/** A day heading between cards. Sticky just under the floating navbar while
 *  its own day's cards scroll past; each day is its own block, so the next
 *  day's heading pushes it away rather than stacking on it. */
export function DaySeparator({ label, count }: { label: string; count: number }) {
  return (
    <div className="sticky top-[66px] z-20 -mx-[4px] mb-[6px] flex items-center gap-[8px] bg-canvas/90 px-[4px] py-[6px] backdrop-blur">
      <span className="font-display text-[14px] font-medium tracking-[-0.01em] text-ink">{label}</span>
      <span className="rounded-pill bg-panel px-[7px] py-[1px] text-caption tabular-nums text-ink-muted">{count}</span>
      <span className="h-px flex-1 bg-border" aria-hidden />
    </div>
  );
}
