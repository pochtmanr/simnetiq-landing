import Link from "next/link";
import { Breadcrumbs } from "../Breadcrumbs";
import { BLOG_POSTS } from "../../lib/content/blog";
import { BLOG_UI } from "../../lib/content/blogUi";
import { localePath, type Locale } from "../../lib/i18n";

function formatDate(iso: string, locale: Locale): string {
  return new Date(iso).toLocaleDateString(
    locale === "ru" ? "ru-RU" : "en-GB",
    { year: "numeric", month: "long", day: "numeric" },
  );
}

/** /blog — card grid, newest first. Tags are non-linked chips (no thin
 *  tag-archive pages in v1). */
export function BlogIndexPage({ locale }: { locale: Locale }) {
  const t = BLOG_UI[locale];
  return (
    <div className="mx-auto w-full max-w-[1200px] px-[clamp(20px,4vw,34px)]">
      <div className="pt-[40px]">
        <Breadcrumbs
          locale={locale}
          crumbs={[
            { name: t.breadcrumbHome, path: "/" },
            { name: t.breadcrumb, path: "/blog" },
          ]}
        />
      </div>

      <section className="pb-[60px] pt-[10px]">
        <span className="section-label">{t.label}</span>
        <h1 className="max-w-3xl text-[clamp(32px,4.2vw,50px)] leading-[1.08] tracking-[-0.02em]">
          {t.title}
        </h1>
        <p className="mt-[22px] max-w-xl text-subheading text-steel-gray">
          {t.sub}
        </p>
      </section>

      <section className="grid gap-[22px] pb-[94px] md:grid-cols-2 lg:grid-cols-3">
        {BLOG_POSTS.map((post) => {
          const c = post[locale];
          return (
            <Link
              key={post.slug}
              href={localePath(locale, `/blog/${post.slug}`)}
              className="card group flex flex-col transition-colors hover:!border-signal-blue"
            >
              <div className="flex flex-wrap items-center gap-[10px]">
                {post.tags.map((tag) => (
                  <span key={tag} className="tag-chip">
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="mt-[22px] text-subheading">{c.title}</h2>
              <p className="mt-[10px] flex-1 text-label text-steel-gray">
                {c.excerpt}
              </p>
              <div className="mt-[22px] flex items-center justify-between">
                <span className="text-caption text-ash-gray">
                  {formatDate(post.publishedAt, locale)}
                </span>
                <span className="blue-link text-label">{t.readMore} →</span>
              </div>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
