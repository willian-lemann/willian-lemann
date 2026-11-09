import { page, YEARS_OF_EXPERIENCE } from "@/lib/constants";
import { getAllPosts } from "@/lib/posts";
import { site } from "@/lib/site";
import { postUrl } from "@/lib/structured-data";

export const dynamic = "force-static";

/**
 * llms-full.txt — the entire site's content in one markdown file, so an LLM
 * or agent can load everything with a single request. llms.txt stays the
 * short index; this is the full version.
 */
export function GET() {
  const jobs = page.work.jobs
    .map(
      (job) =>
        `### ${job.role} — ${job.company} (${job.year})\n\nStack: ${job.tech.join(", ")}\n\n${job.description.trim()}`,
    )
    .join("\n\n");

  const faq = page.faq.items
    .map((item) => `### ${item.question}\n\n${item.answer}`)
    .join("\n\n");

  const posts = getAllPosts()
    .filter((post) => !post.draft)
    .map(
      (post) => `## ${post.title}

- URL: ${postUrl(post.slug)}
- Published: ${post.date}${post.updated ? `\n- Updated: ${post.updated}` : ""}${post.tags.length ? `\n- Tags: ${post.tags.join(", ")}` : ""}

> ${post.description}

${post.markdown}`,
    )
    .join("\n\n---\n\n");

  const body = `# ${site.name} — full site content

> ${site.description}

Source: ${site.url} · Index: ${site.url}/llms.txt

## Key facts

- Name: ${site.name}
- Role: ${site.jobTitle}
- Location: ${site.countryName}
- Experience: ${YEARS_OF_EXPERIENCE}+ years
- Current: ${page.currently.role} ${page.currently.company}
- Core skills: ${page.focus.join(", ")}
- Contact: ${site.email}
- Profiles: ${site.sameAs.join(", ")}

## About

${page.about.paragraphs.join("\n\n")}

## Experience

${jobs}

## FAQ

${faq}
${posts ? `\n---\n\n# Blog posts\n\n${posts}\n` : ""}`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
