"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localeFromPath, localePath, type Locale } from "../lib/i18n";
import type { UiDict } from "../lib/content/ui";

/* not-found.tsx receives no params, so the locale comes from the URL. Only
   the 404 strings travel to the client, not the full dictionaries. */
export function NotFoundView({
  strings,
}: {
  strings: Record<Locale, UiDict["notFound"]>;
}) {
  const locale = localeFromPath(usePathname());
  const t = strings[locale];
  return (
    <div className="mx-auto flex w-full max-w-[820px] flex-col items-center px-[clamp(20px,4vw,34px)] py-[113px] text-center">
      <span className="tag-chip">404</span>
      <h1 className="mt-[22px] text-heading">{t.title}</h1>
      <p className="mt-[10px] max-w-md text-body text-ink-muted">{t.body}</p>
      <Link href={localePath(locale, "/")} className="cta mt-[30px]">
        {t.back}
      </Link>
    </div>
  );
}
