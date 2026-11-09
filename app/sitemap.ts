import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { site } from "@/lib/site";
import { postUrl } from "@/lib/structured-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts().filter((post) => !post.draft);
  const latestPost = posts[0];

  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...(latestPost
      ? [
          {
            url: `${site.url}/blog`,
            lastModified: new Date(latestPost.updated ?? latestPost.date),
            changeFrequency: "weekly" as const,
            priority: 0.8,
          },
        ]
      : []),
    ...posts.map((post) => ({
      url: postUrl(post.slug),
      lastModified: new Date(post.updated ?? post.date),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
