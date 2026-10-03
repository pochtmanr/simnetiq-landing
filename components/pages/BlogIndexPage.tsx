import Link from "next/link";
import { Breadcrumbs } from "../Breadcrumbs";
import { getPosts } from "../../lib/content/blog";
import { blogUi } from "../../lib/content/ui";
import { formatDate, localePath, type Locale } from "../../lib/i18n";
import { Arrow } from "../Arrow";

/** /blog — card grid, newest first. Tags are non-linked chips (no thin
 *  tag-archive pages in v1). */
export function BlogIndexPage({ locale }: { locale: Locale }) {
  const t = blogUi(locale);
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
        <p className="mt-[22px] max-w-xl text-subheading text-ink-muted">
          {t.sub}
        </p>
      </section>

      <section className="grid gap-[22px] pb-[94px] md:grid-cols-2 lg:grid-cols-3">
        {getPosts(locale).map((post) => {
          const c = post.copy;
          return (
            <Link
              key={post.slug}
              href={localePath(locale, `/blog/${post.slug}`)}
              className="card group flex flex-col transition-colors hover:bg-panel"
            >
              <div className="flex flex-wrap items-center gap-[10px]">
                {post.tags.map((tag) => (
                  <span key={tag} className="tag-chip">
                    {t.tags[tag as keyof typeof t.tags] ?? tag}
                  </span>
                ))}
              </div>
              <h2 className="mt-[22px] text-subheading">{c.title}</h2>
              <p className="mt-[10px] flex-1 text-label text-ink-muted">
                {c.excerpt}
              </p>
              <div className="mt-[22px] flex items-center justify-between">
                <span className="text-caption text-muted">
                  {formatDate(post.publishedAt, locale)}
                </span>
                <span className="blue-link text-label">{t.readMore} <Arrow /></span>
              </div>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
