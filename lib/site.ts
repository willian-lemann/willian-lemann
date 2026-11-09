import { page, YEARS_OF_EXPERIENCE } from "./constants";

/**
 * Single source of truth for identity/SEO data.
 * Keep the name spelled exactly the same everywhere (title, h1, JSON-LD,
 * socials) — search engines and LLMs use it to merge every mention of you
 * into one entity.
 */
function resolveSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();

export const site = {
  url: SITE_URL,
  name: "Willian Lemann",
  givenName: "Willian",
  familyName: "Lemann",
  jobTitle: "Senior Frontend Engineer",
  locale: "en_US",
  country: "BR",
  countryName: "Brazil",
  twitter: "@LemannWillian",
  email: page.connect.email,
  employer: { name: "Nortal", client: "Geomagical Labs (IKEA)" },
  get title() {
    return `${this.name} — ${this.jobTitle} (React, TypeScript, AI)`;
  },
  get description() {
    return `${this.name} is a ${this.jobTitle} based in ${this.countryName} with ${YEARS_OF_EXPERIENCE}+ years of experience building web apps with React, TypeScript, Next.js, Node.js and Golang, plus AI integrations and product analytics. Currently at ${this.employer.name}, working for ${this.employer.client}.`;
  },
  knowsAbout: [
    "Frontend Engineering",
    "React",
    "TypeScript",
    "JavaScript",
    "Next.js",
    "Node.js",
    "Golang",
    "AdonisJS",
    "AI automation",
    "LLM integrations",
    "Product analytics",
    "Mixpanel",
    "Web performance",
    "Core Web Vitals",
    "SEO",
    "Shopify apps",
    "Docker",
  ],
  sameAs: page.connect.socials.map((s) => s.url),
} as const;
