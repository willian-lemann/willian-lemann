import { page } from "./constants";
import type { PostMeta } from "./posts";
import { site } from "./site";

/**
 * JSON-LD builders. Entities reference each other by `@id`, so Google and
 * LLM-based engines connect the site, the person, the profile and every post
 * into a single entity graph.
 */
const ids = {
  website: `${site.url}/#website`,
  person: `${site.url}/#person`,
  profile: `${site.url}/#profilepage`,
  blog: `${site.url}/blog#blog`,
};

/** Site-wide: rendered in the root layout on every page. */
export function buildSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": ids.website,
        url: site.url,
        name: site.name,
        description: site.description,
        inLanguage: "en",
        publisher: { "@id": ids.person },
      },
      {
        "@type": "Person",
        "@id": ids.person,
        name: site.name,
        givenName: site.givenName,
        familyName: site.familyName,
        url: site.url,
        image: `${site.url}/opengraph-image`,
        email: `mailto:${site.email}`,
        jobTitle: site.jobTitle,
        description: site.description,
        worksFor: { "@type": "Organization", name: site.employer.name },
        address: { "@type": "PostalAddress", addressCountry: site.country },
        nationality: { "@type": "Country", name: site.countryName },
        knowsAbout: site.knowsAbout,
        knowsLanguage: ["en", "pt-BR"],
        sameAs: site.sameAs,
        hasOccupation: {
          "@type": "Occupation",
          name: site.jobTitle,
          occupationLocation: { "@type": "Country", name: site.countryName },
          skills: Array.from(
            new Set(page.work.jobs.flatMap((job) => job.tech)),
          ).join(", "),
        },
      },
    ],
  };
}

/** Home page: the profile itself plus the visible FAQ. */
export function buildHomeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": ids.profile,
        url: site.url,
        name: site.title,
        isPartOf: { "@id": ids.website },
        mainEntity: { "@id": ids.person },
        dateModified: new Date().toISOString(),
        inLanguage: "en",
      },
      {
        "@type": "FAQPage",
        "@id": `${site.url}/#faq`,
        url: `${site.url}/#faq`,
        isPartOf: { "@id": ids.website },
        about: { "@id": ids.person },
        mainEntity: page.faq.items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };
}

export function postUrl(slug: string) {
  return `${site.url}/blog/${slug}`;
}

/** Blog index: the Blog entity listing every published post. */
export function buildBlogJsonLd(posts: PostMeta[]) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": ids.blog,
        url: `${site.url}/blog`,
        name: `${site.name}'s Blog`,
        description: `Articles by ${site.name} on frontend engineering, web performance, AI integrations and product development.`,
        inLanguage: "en",
        isPartOf: { "@id": ids.website },
        author: { "@id": ids.person },
        publisher: { "@id": ids.person },
        blogPost: posts.map((post) => ({ "@id": `${postUrl(post.slug)}#article` })),
      },
      breadcrumbs([
        { name: "Home", url: site.url },
        { name: "Blog", url: `${site.url}/blog` },
      ]),
    ],
  };
}

/** Single post: BlogPosting authored by the Person, plus breadcrumbs. */
export function buildPostJsonLd(post: PostMeta) {
  const url = postUrl(post.slug);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        url,
        mainEntityOfPage: url,
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        dateModified: post.updated ?? post.date,
        inLanguage: "en",
        keywords: post.tags.join(", "),
        timeRequired: `PT${post.readingMinutes}M`,
        image: `${url}/opengraph-image`,
        author: { "@id": ids.person },
        publisher: { "@id": ids.person },
        isPartOf: { "@id": ids.blog },
      },
      breadcrumbs([
        { name: "Home", url: site.url },
        { name: "Blog", url: `${site.url}/blog` },
        { name: post.title, url },
      ]),
    ],
  };
}

function breadcrumbs(items: { name: string; url: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
