import type { Metadata } from "next";
import Link from "next/link";
import { BlogShell } from "@/components/blog-shell";
import { JsonLd } from "@/components/json-ld";
import { formatPostDate, getAllPosts, toPostMeta } from "@/lib/posts";
import { site } from "@/lib/site";
import { buildBlogJsonLd } from "@/lib/structured-data";

const title = "Blog";
const description = `Articles by ${site.name} on frontend engineering, React, TypeScript, web performance, AI integrations and product development.`;

export function generateMetadata(): Metadata {
  const hasPosts = getAllPosts().length > 0;

  return {
    title,
    description,
    alternates: {
      canonical: "/blog",
      types: {
        "application/rss+xml": [
          { url: "/blog/feed.xml", title: `${site.name}'s Blog` },
        ],
      },
    },
    openGraph: {
      type: "website",
      url: "/blog",
      siteName: site.name,
      title: `${title} | ${site.name}`,
      description,
      locale: site.locale,
    },
    // An empty listing is thin content — keep it out of the index until the first post ships.
    robots: hasPosts ? undefined : { index: false, follow: true },
  };
}

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <BlogShell crumbs={[{ name: "Blog" }]}>
      <JsonLd data={buildBlogJsonLd(posts.map(toPostMeta))} />

      <div className="space-y-4 mb-16">
        <h1 className="text-4xl sm:text-5xl font-light tracking-tight">Blog</h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
          {description}
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="text-muted-foreground">First posts coming soon.</p>
      ) : (
        <ul className="border-t border-border/50">
          {posts.map((post) => (
            <li key={post.slug} className="border-b border-border/50">
              <Link
                href={`/blog/${post.slug}`}
                className="group grid sm:grid-cols-12 gap-2 sm:gap-8 py-8"
              >
                <div className="sm:col-span-3 text-sm text-muted-foreground font-mono pt-1">
                  <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                  {post.draft && <span className="ml-2 text-amber-500">DRAFT</span>}
                </div>
                <article className="sm:col-span-9 space-y-2">
                  <h2 className="text-xl font-medium group-hover:text-muted-foreground transition-colors duration-300">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {post.description}
                  </p>
                  <div className="text-xs text-muted-foreground font-mono">
                    {post.readingMinutes} min read
                    {post.tags.length > 0 && ` · ${post.tags.join(", ")}`}
                  </div>
                </article>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </BlogShell>
  );
}
