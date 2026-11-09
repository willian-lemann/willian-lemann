import { getAllPosts, getPost } from "@/lib/posts";
import { site } from "@/lib/site";
import { postUrl } from "@/lib/structured-data";

/**
 * Plain-markdown version of each post, served at /blog/<slug>.md (see the
 * rewrite in next.config.mjs). LLM crawlers and agents read this far more
 * cheaply and accurately than rendered HTML.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return new Response("Not found", { status: 404 });

  const body = `# ${post.title}

> ${post.description}

- Author: ${site.name} (${site.jobTitle}) — ${site.url}
- Published: ${post.date}${post.updated ? `\n- Updated: ${post.updated}` : ""}
- Canonical: ${postUrl(post.slug)}${post.tags.length ? `\n- Tags: ${post.tags.join(", ")}` : ""}

${post.markdown}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "X-Robots-Tag": "noindex",
    },
  });
}
