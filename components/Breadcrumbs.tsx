import Link from "next/link";
import { localePath, type Locale } from "../lib/i18n";
import { breadcrumbList } from "../lib/seo";
import { JsonLd } from "./JsonLd";

/** Visible breadcrumb trail + matching BreadcrumbList JSON-LD, so the two can
 *  never diverge. `path` values are bare (EN) site-relative paths; the last
 *  crumb renders as plain text. */
export function Breadcrumbs({
  locale,
  crumbs,
}: {
  locale: Locale;
  crumbs: ReadonlyArray<{ name: string; path: string }>;
}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <JsonLd data={breadcrumbList(locale, crumbs)} />
      <ol className="flex flex-wrap items-center gap-2 text-label text-muted">
        {crumbs.map(({ name, path }, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={path} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className="text-ink-muted">
                  {name}
                </span>
              ) : (
                <>
                  <Link
                    href={localePath(locale, path)}
                    className="transition-colors hover:text-accent-deep"
                  >
                    {name}
                  </Link>
                  <span aria-hidden="true">/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
