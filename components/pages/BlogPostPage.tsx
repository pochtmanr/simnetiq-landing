import { Breadcrumbs } from "../Breadcrumbs";
import { JsonLd } from "../JsonLd";
import { RelatedServices } from "../RelatedServices";
import { PostBody } from "../blog/PostBody";
import type { BlogPost } from "../../lib/content/blog/types";
import { blogUi } from "../../lib/content/ui";
import { formatDate, type Locale } from "../../lib/i18n";
import { article } from "../../lib/seo";

/** Template for /blog/[slug]. */
export function BlogPostPage({
  locale,
  post,
}: {
  locale: Locale;
  post: BlogPost;
}) {
  const t = blogUi(locale);
  const c = post.copy;
  return (
    <div className="mx-auto w-full max-w-[860px] px-[clamp(20px,4vw,34px)]">
      <JsonLd
        data={article({
          locale,
          path: `/blog/${post.slug}`,
          title: c.title,
          description: c.description,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt,
          image: post.cover,
        })}
      />
      <div className="pt-[40px]">
        <Breadcrumbs
          locale={locale}
          crumbs={[
            { name: t.breadcrumbHome, path: "/" },
            { name: t.breadcrumb, path: "/blog" },
            { name: c.title, path: `/blog/${post.slug}` },
          ]}
        />
      </div>

      <article className="pb-[94px]">
        <header className="pb-[40px] pt-[10px]">
          <div className="flex flex-wrap items-center gap-[10px]">
            {post.tags.map((tag) => (
              <span key={tag} className="tag-chip">
                {t.tags[tag as keyof typeof t.tags] ?? tag}
              </span>
            ))}
          </div>
          <h1 className="mt-[22px] text-[clamp(30px,4vw,44px)] leading-[1.1] tracking-[-0.02em]">
            {c.title}
          </h1>
          <p className="mt-[15px] text-caption text-muted">
            {t.published} {formatDate(post.publishedAt, locale)}
            {post.updatedAt !== post.publishedAt && (
              <>
                {" "}
                · {t.updated} {formatDate(post.updatedAt, locale)}
              </>
            )}
          </p>
        </header>

        <PostBody locale={locale} blocks={c.blocks} />
      </article>

      {post.relatedServiceSlugs && post.relatedServiceSlugs.length > 0 && (
        <div className="pb-[94px]">
          <RelatedServices locale={locale} slugs={post.relatedServiceSlugs} />
        </div>
      )}
    </div>
  );
}
