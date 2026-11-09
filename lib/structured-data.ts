import { page } from "./constants";
import { site } from "./site";

/**
 * JSON-LD graph: WebSite + ProfilePage + Person.
 * This is what lets Google build a knowledge panel and lets LLM-based
 * search engines answer "who is …" with confidence.
 */
export function buildJsonLd() {
  const personId = `${site.url}/#person`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.name,
        description: site.description,
        inLanguage: "en",
        publisher: { "@id": personId },
      },
      {
        "@type": "ProfilePage",
        "@id": `${site.url}/#profilepage`,
        url: site.url,
        name: site.title,
        isPartOf: { "@id": `${site.url}/#website` },
        mainEntity: { "@id": personId },
        dateModified: new Date().toISOString(),
        inLanguage: "en",
      },
      {
        "@type": "Person",
        "@id": personId,
        name: site.name,
        givenName: site.givenName,
        familyName: site.familyName,
        url: site.url,
        image: `${site.url}/opengraph-image`,
        email: `mailto:${site.email}`,
        jobTitle: site.jobTitle,
        description: site.description,
        worksFor: {
          "@type": "Organization",
          name: site.employer.name,
        },
        address: {
          "@type": "PostalAddress",
          addressCountry: site.country,
        },
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
      {
        "@type": "FAQPage",
        "@id": `${site.url}/#faq`,
        url: `${site.url}/#faq`,
        isPartOf: { "@id": `${site.url}/#website` },
        about: { "@id": personId },
        mainEntity: page.faq.items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };
}
