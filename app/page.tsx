import { Home } from "@/components/home";
import { JsonLd } from "@/components/json-ld";
import { formatPostDate, getAllPosts } from "@/lib/posts";
import { buildHomeJsonLd } from "@/lib/structured-data";

export default function HomePage() {
  const posts = getAllPosts()
    .slice(0, 4)
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      description: post.description,
      readingMinutes: post.readingMinutes,
      displayDate: formatPostDate(post.date),
    }));

  return (
    <>
      <JsonLd data={buildHomeJsonLd()} />
      <Home posts={posts} />
    </>
  );
}
