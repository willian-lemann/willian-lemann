---
title: "Migrating a legacy React + Webpack app to Next.js, one page at a time"
description: "How we moved Vanhack's platform from a legacy React + Webpack app with a Node.js layer to Next.js incrementally — running both apps side by side, server-side authentication and static regeneration for content pages."
date: 2026-11-09
tags: [Next.js, React, Migration, SSR]
---

**TL;DR:** Don't rewrite a legacy frontend in one go. Put the new Next.js app in front, migrate page by page, and let every route that hasn't been migrated yet fall through to the legacy app. Use server-side rendering for authenticated pages and static regeneration (ISR) for content pages. Users never see a "big bang" release, and the team keeps shipping features during the migration.

At [Vanhack](https://vanhack.com) — a platform that connects tech candidates with companies to get hired and relocated or work remotely — I worked on the frontend while the team migrated from a legacy React application built with Webpack (with a Node.js layer for server-side work) to Next.js. During that time I built a lot of the interfaces, including the chat page, the dashboard, rich text editor components and the learning hub. This is the approach that made the migration work without stopping the product.

> This migration happened in 2021, with the Next.js Pages Router. The same strategy applies to the App Router today; I mention the modern equivalents along the way.

## Why not a full rewrite?

A full rewrite looks attractive: clean slate, modern stack, no legacy. In practice it means:

- **Months without shipping** user-facing features, or maintaining two codebases in parallel anyway.
- **A risky big-bang release** where every page changes at once.
- **Lost behavior**: legacy code encodes years of bug fixes and edge cases nobody remembers.

An incremental migration avoids all three. Each migrated page is a small, reviewable, reversible release.

## The strangler pattern: Next.js in front, legacy behind

The idea (Martin Fowler's "strangler fig") is to put the new app in front of the old one. Requests for routes that already exist in Next.js are served by Next.js; everything else is proxied to the legacy app. Over time, the legacy app serves fewer and fewer routes until it can be removed.

Next.js supports this directly with **fallback rewrites**, which are only checked after Next.js fails to match one of its own pages or files:

```js
// next.config.js
module.exports = {
  async rewrites() {
    return {
      fallback: [
        {
          source: "/:path*",
          destination: "https://legacy.example.com/:path*",
        },
      ],
    };
  },
};
```

With this in place, migrating a page is as simple as creating it in Next.js and deploying. The moment it exists, Next.js serves it instead of the legacy app.

Things to sort out early:

- **Shared session**: both apps must read the same auth cookie, so keep them on the same domain.
- **Shared look and feel**: extract design tokens and core components so users can't tell which app rendered the page.
- **Navigation between apps**: links from a Next.js page to a legacy page need a full page load, so use a plain `<a>` (or `next/link` that falls back to a hard navigation) for routes that aren't migrated yet.

## Server-side authentication for private pages

Authenticated pages like the dashboard shouldn't flash a logged-out state or a spinner while the client checks the session. With SSR, the server checks the session before rendering and redirects if needed:

```ts
// pages/dashboard.tsx (Pages Router)
import type { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const token = req.cookies.session;

  if (!token) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  const user = await getUserFromSession(token);
  if (!user) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  return { props: { user } };
};
```

The user gets a fully rendered dashboard on the first response. In the App Router, the same check lives in a Server Component or in middleware, using `cookies()` and `redirect()`.

## Static regeneration for content pages

Content pages — like a learning hub with articles and courses — don't change on every request, but they do change. Rendering them on every request wastes server time; building them only at deploy time makes them stale.

**Incremental Static Regeneration (ISR)** sits in between: the page is served as static HTML and regenerated in the background at most once per interval:

```ts
// pages/learning/[slug].tsx (Pages Router)
export async function getStaticProps({ params }) {
  const article = await getArticle(params.slug);
  if (!article) return { notFound: true };

  return {
    props: { article },
    revalidate: 60, // regenerate at most once a minute
  };
}

export async function getStaticPaths() {
  const slugs = await getPopularArticleSlugs();
  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: "blocking", // render unknown slugs on first request, then cache
  };
}
```

Content pages get static-site speed and good SEO, and editors don't need a deploy to publish. In the App Router, the equivalent is `export const revalidate = 60` or `fetch(url, { next: { revalidate: 60 } })`.

## How we prioritized what to migrate

Not all pages are equal. A practical order:

1. **Pages under active development.** If a page is about to get new features, build it in Next.js instead of adding more code to the legacy app.
2. **Public, SEO-relevant pages.** They benefit the most from SSR/ISR.
3. **Pages with the worst bugs or performance.** Migration is a chance to fix them.
4. **Everything else**, when there's capacity.

We tracked the work in Jira using Kanban, and fixing bugs in the legacy platform continued alongside the migration — which is exactly why an incremental approach was necessary.

## Key takeaways

- **Migrate incrementally**: Next.js in front, legacy behind, with fallback rewrites.
- **Share the session and the design system** so the two apps feel like one product.
- Use **SSR for authenticated pages** to avoid loading flashes and client-side auth checks.
- Use **ISR for content pages** to get static speed without stale content.
- **Prioritize pages that are changing anyway** — migration then costs almost nothing extra.
