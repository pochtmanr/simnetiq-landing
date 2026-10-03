import { Fragment } from "react";
import type { LegalDict } from "../lib/content/ui";
import { formatDate, type Locale } from "../lib/i18n";
import {
  COMPANY_NUMBER,
  COMPANY_REGISTERED_OFFICE,
  SUPPORT_EMAIL,
} from "../lib/site";

/** Shared shell + prose primitives for the legal pages. */

export function LegalShell({
  label,
  title,
  updated,
  updatedLabel,
  children,
}: {
  label: string;
  title: string;
  updated: string;
  updatedLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-[820px] px-[clamp(20px,4vw,34px)]">
      <section className="pb-[34px] pt-[69px]">
        <span className="section-label">{label}</span>
        <h1 className="text-heading">{title}</h1>
        <p className="mt-[10px] text-caption text-muted">
          {updatedLabel} {updated}
        </p>
      </section>
      <div className="card">{children}</div>
    </div>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-border pt-[30px] first:border-t-0 first:pt-0 [&+&]:mt-[30px]">
      <h2 className="font-sans text-subheading font-medium">{title}</h2>
      <div className="mt-[10px] flex flex-col gap-[10px] text-label text-ink-muted [&_li]:ms-[18px] [&_li]:list-disc [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-[6px]">
        {children}
      </div>
    </section>
  );
}

/* Inline markup in legal copy: **term**, *emphasis*, [label](https://…) and
   {supportEmail} / {companyNumber} / {registeredOffice}. Deliberately tiny —
   translators keep the markers, the check script verifies they survived. */
const TOKEN = /\*\*(.+?)\*\*|\*(.+?)\*|\[(.+?)\]\((.+?)\)|\{(supportEmail|companyNumber|registeredOffice)\}/g;

export function RichText({ text }: { text: string }) {
  const out: React.ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(TOKEN)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const [, strong, em, label, href, placeholder] = m;
    if (strong) out.push(<strong className="font-normal text-ink">{strong}</strong>);
    else if (em) out.push(<em>{em}</em>);
    else if (label)
      out.push(
        <a href={href} className="blue-link">
          {label}
        </a>,
      );
    else if (placeholder === "supportEmail")
      out.push(
        <a href={`mailto:${SUPPORT_EMAIL}`} className="blue-link">
          {SUPPORT_EMAIL}
        </a>,
      );
    else if (placeholder === "companyNumber") out.push(COMPANY_NUMBER);
    else out.push(COMPANY_REGISTERED_OFFICE);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return (
    <>
      {out.map((node, i) => (
        <Fragment key={i}>{node}</Fragment>
      ))}
    </>
  );
}

/** A full legal document (privacy-policy.json / terms.json). */
export function LegalDocument({
  doc,
  locale,
  updatedAt,
  translated,
}: {
  doc: LegalDict;
  locale: Locale;
  updatedAt: string;
  /** Show the "English version prevails" notice. */
  translated: boolean;
}) {
  return (
    <LegalShell
      label={doc.label}
      title={doc.title}
      updated={formatDate(updatedAt, locale)}
      updatedLabel={doc.updatedLabel}
    >
      {translated && (
        <p className="mb-[30px] text-caption text-muted">{doc.prevailingNotice}</p>
      )}
      {doc.sections.map((section) => (
        <LegalSection key={section.title} title={section.title}>
          {section.blocks.map((block, i) =>
            block.type === "p" ? (
              <p key={i}>
                <RichText text={block.text!} />
              </p>
            ) : (
              <ul key={i}>
                {block.items!.map((item, j) => (
                  <li key={j}>
                    <RichText text={item} />
                  </li>
                ))}
              </ul>
            ),
          )}
        </LegalSection>
      ))}
    </LegalShell>
  );
}
