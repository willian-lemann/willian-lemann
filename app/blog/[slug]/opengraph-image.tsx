import { OG_SIZE, renderOgCard } from "@/lib/og";
import { formatPostDate, getAllPosts, getPost } from "@/lib/posts";
import { site } from "@/lib/site";

export const alt = `Blog post by ${site.name}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default async function PostOpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  const title = post?.title ?? "Blog";

  return renderOgCard({
    eyebrow: "BLOG",
    title,
    titleSize: title.length > 48 ? 64 : 80,
    subtitle: post ? `${post.readingMinutes} min read` : "",
    footerLeft: `${site.name} · ${site.jobTitle}`,
    footerRight: post ? formatPostDate(post.date) : "",
  });
}
