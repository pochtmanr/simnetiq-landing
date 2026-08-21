import Link from "next/link";
import { NOT_FOUND } from "../../lib/content/common";

export default function NotFound() {
  const t = NOT_FOUND.ru;
  return (
    <div className="mx-auto flex w-full max-w-[820px] flex-col items-center px-[clamp(20px,4vw,34px)] py-[113px] text-center">
      <span className="tag-chip">404</span>
      <h1 className="mt-[22px] text-heading">{t.title}</h1>
      <p className="mt-[10px] max-w-md text-body text-ink-muted">{t.body}</p>
      <Link href="/ru" className="cta mt-[30px]">
        {t.back}
      </Link>
    </div>
  );
}
