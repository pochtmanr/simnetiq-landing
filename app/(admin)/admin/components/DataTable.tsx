"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";

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
 * ------------------------------------------------------------------------ */

export type Column<T> = {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  align?: "left" | "right";
  /** Where the column goes on a phone. Default: a labelled field. */
  mobile?: "title" | "aside" | "field" | "hide";
  /** Extra classes on the desktop cell (widths, truncation). */
  className?: string;
};

export function DataTable<T>({
  rows,
  columns,
  rowKey,
  rowHref,
  empty,
  footer,
  rowTone,
}: {
  rows: T[];
  columns: Column<T>[];
  rowKey: (row: T, index: number) => string;
  rowHref?: (row: T) => string | null | undefined;
  empty?: ReactNode;
  footer?: ReactNode;
  /** Tint a row that needs attention. */
  rowTone?: (row: T) => "bad" | "warn" | null | undefined;
}) {
  const router = useRouter();

  if (rows.length === 0) {
    return <div>{empty ?? <p className="py-[18px] text-center text-label text-muted">Nothing here yet.</p>}</div>;
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

  const toneBg = (row: T) => {
    const t = rowTone?.(row);
    return t === "bad" ? "bg-bad-soft/60" : t === "warn" ? "bg-warn-soft/60" : "";
  };

  return (
    <div>
      {/* Phone: cards */}
      <ul className="flex flex-col gap-[8px] md:hidden">
        {rows.map((row, i) => {
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
                      {j === 0 && href ? (
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
            </li>
          );
        })}
      </ul>

      {/* Tablet and up: table */}
      <div className="hidden overflow-x-auto rounded-card border border-border bg-card md:block">
        <table className="w-full border-collapse text-label">
          <thead>
            <tr className="border-b border-border bg-canvas/60 text-caption uppercase tracking-[0.07em] text-muted">
              {columns.map((c) => (
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
            {rows.map((row, i) => {
              const href = rowHref?.(row);
              return (
                <tr
                  key={rowKey(row, i)}
                  onClick={(e) => open(e, href)}
                  className={`border-b border-border last:border-b-0 align-top ${href ? "cursor-pointer hover:bg-canvas" : ""} ${toneBg(row)}`}
                >
                  {columns.map((c) => (
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
          </tbody>
        </table>
      </div>
      {footer ? <div className="mt-[10px]">{footer}</div> : null}
    </div>
  );
}
