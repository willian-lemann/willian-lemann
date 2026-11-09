import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogShell } from "@/components/blog-shell";
import { JsonLd } from "@/components/json-ld";
import { formatPostDate, getAllPosts, getPost, toPostMeta } from "@/lib/posts";
import { site } from "@/lib/site";
import { buildPostJsonLd } from "@/lib/structured-data";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  const url = `/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    authors: [{ name: site.name, url: site.url }],
    alternates: {
      canonical: url,
      types: { "text/markdown": `${url}.md` },
    },
    openGraph: {
      type: "article",
      url,
      siteName: site.name,
      title: post.title,
      description: post.description,
      locale: site.locale,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      authors: [site.url],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      creator: site.twitter,
    },
    robots: post.draft ? { index: false, follow: false } : undefined,
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <BlogShell crumbs={[{ name: "Blog", href: "/blog" }, { name: post.title }]}>
      <JsonLd data={buildPostJsonLd(toPostMeta(post))} />

      <article>
        <header className="space-y-6 mb-12">
          <div className="text-sm text-muted-foreground font-mono flex flex-wrap gap-x-3 gap-y-1">
            <time dateTime={post.date}>{formatPostDate(post.date)}</time>
            <span aria-hidden="true">·</span>
            <span>{post.readingMinutes} min read</span>
            {post.updated && post.updated !== post.date && (
              <>
                <span aria-hidden="true">·</span>
                <span>
                  Updated{" "}
                  <time dateTime={post.updated}>
                    {formatPostDate(post.updated)}
                  </time>
                </span>
              </>
            )}
            {post.draft && <span className="text-amber-500">DRAFT</span>}
          </div>

          <h1 className="text-4xl sm:text-5xl font-light tracking-tight leading-tight">
            {post.title}
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
            {post.description}
          </p>

          <p className="text-sm text-muted-foreground">
            By{" "}
            <Link href="/" rel="author" className="text-foreground hover:underline">
              {site.name}
            </Link>
            , {site.jobTitle}
          </p>

          {post.tags.length > 0 && (
            <ul className="flex flex-wrap gap-2" aria-label="Tags">
              {post.tags.map((tag) => (
                <li
                  key={tag}
                  className="px-3 py-1 text-xs border border-border rounded-full text-muted-foreground"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </header>

        <div
          className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-medium prose-a:underline-offset-4 prose-pre:bg-muted prose-pre:text-foreground"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </article>
    </BlogShell>
  );
}
