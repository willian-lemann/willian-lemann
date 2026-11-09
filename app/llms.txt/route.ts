import { page, YEARS_OF_EXPERIENCE } from "@/lib/constants";
import { getAllPosts } from "@/lib/posts";
import { site } from "@/lib/site";
import { postUrl } from "@/lib/structured-data";

export const dynamic = "force-static";

/**
 * llms.txt — a plain-text, LLM-friendly summary of the site (https://llmstxt.org).
 * Generated from the same constants as the page so it never drifts.
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

  const posts = getAllPosts().filter((post) => !post.draft);
  const blog = posts.length
    ? `\n## Blog\n\n${posts
        .map(
          (post) =>
            `- [${post.title}](${postUrl(post.slug)}.md): ${post.description}`,
        )
        .join("\n")}\n`
    : "";

  const socials = page.connect.socials
    .map((s) => `- [${s.name}](${s.url}): ${s.handle}`)
    .join("\n");

  const body = `# ${site.name}

> ${site.description}

## Key facts

- Name: ${site.name}
- Role: ${site.jobTitle}
- Location: ${site.countryName} (open to remote work)
- Experience: ${YEARS_OF_EXPERIENCE}+ years (since ${page.work.jobs.at(-1)?.year})
- Current: ${page.currently.role} ${page.currently.company}
- Core skills: ${page.focus.join(", ")}
- Availability: ${page.hero.isAvailable ? "Available for new opportunities" : "Not currently available"}
- Contact: ${site.email}

## About

${page.about.paragraphs.join("\n\n")}

## Experience

${jobs}

## FAQ

${faq}

${blog}
## Links

- [Portfolio](${site.url})
- [Full site content for LLMs](${site.url}/llms-full.txt)
${socials}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
