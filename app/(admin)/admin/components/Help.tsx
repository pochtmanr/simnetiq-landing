"use client";

import { useId, useState, type ReactNode } from "react";

/* ---------------------------------------------------------------------------
 * "What does this number mean?"
 *
 * The explanation unfolds *inline* under the label rather than floating in a
 * popover: a floating bubble next to a card on the right edge of a 375px
 * screen clips off-canvas, and a tap target that opens something you then
 * have to dismiss is worse on a phone than one that simply toggles.
 * ------------------------------------------------------------------------ */

export function useHelp() {
  const [open, setOpen] = useState(false);
  const id = useId();
  return { open, toggle: () => setOpen((o) => !o), id };
}

export function HelpButton({
  open,
  toggle,
  id,
  label,
}: {
  open: boolean;
  toggle: () => void;
  id: string;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        /* Inside a linked card the tap must explain, not navigate. */
        e.preventDefault();
        e.stopPropagation();
        toggle();
      }}
      aria-expanded={open}
      aria-controls={id}
      aria-label={`What is ${label}?`}
      className={`inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold leading-none ${
        open ? "border-accent-deep bg-accent-deep text-white" : "border-border text-muted hover:border-accent-deep hover:text-accent-deep"
      }`}
    >
      i
    </button>
  );
}

export function HelpText({ open, id, children }: { open: boolean; id: string; children: ReactNode }) {
  if (!open) return null;
  return (
    <div id={id} className="mt-[8px] rounded-[8px] bg-panel px-[10px] py-[8px] text-caption leading-[1.5] text-ink-muted">
      {children}
    </div>
  );
}

/** A heading-level explanation: a title with an (i) that unfolds a note. */
export function Explained({ title, children }: { title: ReactNode; children: ReactNode }) {
  const h = useHelp();
  return (
    <div>
      <div className="flex items-center gap-[6px]">
        <span>{title}</span>
        <HelpButton {...h} label={typeof title === "string" ? title : "this"} />
      </div>
      <HelpText open={h.open} id={h.id}>
        {children}
      </HelpText>
    </div>
  );
}

/** "Source: … · How: …" — one muted line under a figure or a table. */
export function SourceLine({ children }: { children: ReactNode }) {
  return <p className="mt-[6px] text-caption text-muted">{children}</p>;
}
