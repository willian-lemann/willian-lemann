import { getAllPosts } from "@/lib/posts";
import { site } from "@/lib/site";
import { postUrl } from "@/lib/structured-data";

export const dynamic = "force-static";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  const posts = getAllPosts().filter((post) => !post.draft);

  const items = posts
    .map((post) => {
      const url = postUrl(post.slug);
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${new Date(`${post.date}T12:00:00Z`).toUTCString()}</pubDate>
      <dc:creator>${escapeXml(site.name)}</dc:creator>
${post.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`).join("\n")}
      <content:encoded><![CDATA[${post.html.replace(/]]>/g, "]]]]><![CDATA[>")}]]></content:encoded>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(`${site.name}'s Blog`)}</title>
    <link>${site.url}/blog</link>
    <description>${escapeXml(`Articles by ${site.name}, ${site.jobTitle}.`)}</description>
    <language>en</language>
    <atom:link href="${site.url}/blog/feed.xml" rel="self" type="application/rss+xml" />
${posts[0] ? `    <lastBuildDate>${new Date(`${posts[0].updated ?? posts[0].date}T12:00:00Z`).toUTCString()}</lastBuildDate>\n` : ""}${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
