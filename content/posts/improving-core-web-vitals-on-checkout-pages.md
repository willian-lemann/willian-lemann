---
title: "Improving Core Web Vitals on checkout and data-heavy pages"
description: "What I learned improving LCP, INP and CLS on checkout flows and data-heavy dashboards at Spocket — measuring real users first, taming third-party scripts and treating perceived performance as a feature."
date: 2026-11-09
tags: [Performance, Core Web Vitals, React, Shopify]
---

**TL;DR:** On checkout and data-heavy pages, the biggest Core Web Vitals wins rarely come from micro-optimizing React. They come from (1) measuring real users instead of trusting Lighthouse, (2) controlling when third-party scripts load, (3) reserving space for everything that loads late, and (4) keeping the main thread free so interactions feel instant. Perceived performance matters as much as the raw numbers.

At [Spocket](https://www.spocket.co) I worked on the main dropshipping app and on Shopify apps, and a recurring part of my job was web performance: checkout pages and pages that render a lot of product data. These are the practices that consistently moved the needle.

## Why checkout and data-heavy pages are the hardest to optimize

They combine everything that hurts Core Web Vitals at once:

- **Lots of data** fetched from several APIs before the page is useful.
- **Third-party scripts** — analytics, tag managers, payment widgets, chat — all competing for the main thread.
- **Late-loading UI** (prices, shipping estimates, recommendations) that pushes content around.
- **High stakes**: a slow or janky checkout costs money directly.

As a reference, Google considers a page "good" when, at the 75th percentile of real visits, **LCP ≤ 2.5 s**, **INP ≤ 200 ms** and **CLS ≤ 0.1**. INP replaced FID as a Core Web Vital in March 2024, and it is much stricter about slow interactions.

## Step 1: measure real users, not just Lighthouse

Lighthouse runs on one machine, once. Your users run on cheap Android phones on 4G with a dozen browser extensions. Field data is what Google uses, so it is what you should optimize.

The [`web-vitals`](https://github.com/GoogleChrome/web-vitals) library makes it easy to send real-user metrics to your own analytics:

```ts
import { onCLS, onINP, onLCP, type Metric } from "web-vitals";

function report(metric: Metric) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    rating: metric.rating, // "good" | "needs-improvement" | "poor"
    page: location.pathname,
  });

  // sendBeacon survives page unloads, which is when CLS and INP are finalized
  navigator.sendBeacon("/api/vitals", body);
}

onLCP(report);
onINP(report);
onCLS(report);
```

Segmenting by page type (checkout, product list, dashboard) is what makes this useful: a site-wide average hides the one page that is actually slow.

## Step 2: control third-party scripts

On marketing-heavy products, tags injected through Google Tag Manager are often the single biggest cost. I worked with GTM to inject tracking scripts, and the lesson was simple: **every tag is a performance decision**, not just a marketing one.

What helps:

- **Audit the container regularly.** Tags from old campaigns tend to stay forever.
- **Fire tags on the right trigger.** Most analytics don't need to run before the page is interactive; "Window Loaded" or a custom event is usually enough.
- **Defer the tag manager itself on critical pages** when the business accepts it, for example loading it after the first interaction or when the browser is idle:

```ts
let tagManagerLoaded = false;

function loadTagManager() {
  if (tagManagerLoaded) return;
  tagManagerLoaded = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtm.js?id=GTM-XXXXXXX";
  document.head.appendChild(script);
}

// Load when the browser is idle, or on the first interaction — whichever comes first
if ("requestIdleCallback" in window) {
  requestIdleCallback(loadTagManager, { timeout: 4000 });
} else {
  setTimeout(loadTagManager, 3000);
}
["pointerdown", "keydown", "scroll"].forEach((event) =>
  addEventListener(event, loadTagManager, { once: true, passive: true }),
);
```

This is a trade-off: delaying analytics can lose some events from very short visits, so agree on it with whoever owns the data.

## Step 3: reserve space for anything that loads late (CLS)

Layout shift on checkout is more than a metric — it makes people click the wrong button. The fix is almost always to **reserve the space before the content arrives**:

- Give images and media explicit `width`/`height` or an `aspect-ratio`.
- Render skeletons with the **same dimensions** as the final content, not a generic spinner.
- Never insert banners, coupons or alerts above content that is already visible; reserve a slot or overlay them.

```tsx
function ShippingEstimate({ estimate }: { estimate?: string }) {
  // The container keeps the same height whether the data has arrived or not
  return (
    <div className="min-h-[3rem]">
      {estimate ? <p>{estimate}</p> : <div className="h-5 w-40 animate-pulse rounded bg-muted" />}
    </div>
  );
}
```

## Step 4: keep the main thread free (INP)

INP measures how long it takes from a user interaction until the next frame is painted. On data-heavy pages, the usual culprit is a click handler that does too much synchronous work — filtering a big list, recalculating totals, re-rendering a huge table.

Things that help:

- **Show feedback first, compute later.** Update the button state immediately, then do the heavy work.
- **Yield to the browser** between chunks of work so it can paint:

```ts
const yieldToMain = () =>
  "scheduler" in window && "yield" in (window as any).scheduler
    ? (window as any).scheduler.yield()
    : new Promise((resolve) => setTimeout(resolve, 0));

async function applyFilters(items: Product[], filters: Filters) {
  setLoading(true); // paint feedback right away
  await yieldToMain();

  const result = items.filter((item) => matches(item, filters));
  setProducts(result);
  setLoading(false);
}
```

- In React, use `useTransition` / `useDeferredValue` for non-urgent updates, and virtualize long lists instead of rendering thousands of rows.

## Perceived performance is a feature

Not every improvement shows up in Core Web Vitals, and that's fine. A big part of my work was improving **perceived** performance across the platform: skeletons that match the layout, optimistic updates, prefetching the next likely step of a flow, and avoiding blank screens between routes. Users judge speed by how the product *feels*, and a page that responds instantly while data loads in the background feels faster than one that is technically quicker but frozen.

## Key takeaways

- Optimize for **field data at the 75th percentile**, segmented by page type.
- **Third-party scripts are product decisions** — audit and defer them deliberately.
- **Reserve space** for every late element to eliminate layout shift.
- **Yield to the main thread** and show feedback before doing heavy work to keep INP low.
- **Perceived performance** — skeletons, optimistic UI, prefetching — is as important as the metrics.
