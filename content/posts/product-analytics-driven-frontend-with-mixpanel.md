---
title: "Frontend driven by product analytics: building small experiences that move activation"
description: "How I work as a frontend engineer when the goal is activation and conversion, not just shipping UI — defining the metric first, typed Mixpanel tracking, small focused experiences and reading the funnel after release."
date: 2026-11-09
tags: [Product Analytics, Mixpanel, React, TypeScript]
draft: true
---

**TL;DR:** When the goal is to increase activation and conversion, frontend work starts with the funnel, not with the UI. Define the activation event, instrument the funnel with typed events, ship small focused experiences instead of big redesigns, and decide what to keep by reading the data after release. Treat analytics as part of the feature, not an afterthought.

I currently work at Nortal for [Geomagical Labs](https://www.geomagical.com), a company under the IKEA umbrella that started from a simple idea: our most personal space, our home, is often hard to furnish. A big part of my work is building small product experiences guided by product analytics in Mixpanel, with the goal of improving activation and conversion. I can't share internal numbers or details, but the way of working is something I can share — and it changed how I think about frontend engineering.

## Start with the metric, not the screen

"Improve onboarding" is not a task. "Increase the share of new users who reach the first meaningful action within their first session" is. Before writing any component, I want three things clear:

1. **The activation event**: the action that best predicts a user will stick around.
2. **The funnel** that leads to it: the steps between landing and that event.
3. **Where users drop off** today, and a hypothesis for why.

Only then does the UI question make sense: *what is the smallest experience that could move users past that step?*

## Typed tracking: analytics that can't silently break

Analytics break silently. Someone renames a property, an event fires twice, a step stops being tracked after a refactor — and you find out weeks later when a chart looks weird. With TypeScript, you can make the tracking plan part of the type system:

```ts
import mixpanel from "mixpanel-browser";

// The tracking plan lives in code: event names and their properties
type TrackingPlan = {
  "Onboarding Step Viewed": { step: number; variant: "control" | "guided" };
  "Onboarding Completed": { durationSeconds: number };
  "Item Added": { source: "search" | "recommendation"; category: string };
};

export function track<E extends keyof TrackingPlan>(
  event: E,
  properties: TrackingPlan[E],
) {
  mixpanel.track(event, properties);
}

// ✅ type-checked
track("Onboarding Step Viewed", { step: 2, variant: "guided" });

// ❌ compile error: "stepNumber" doesn't exist on the event
// track("Onboarding Step Viewed", { stepNumber: 2, variant: "guided" });
```

Benefits:

- **Renames are safe**: changing an event breaks the build, not the dashboard.
- **The tracking plan is reviewable** in pull requests like any other code.
- **Autocomplete** makes it easy to track things consistently.

## Small, focused experiences beat big redesigns

When the funnel shows a specific drop-off, the instinct is often to redesign the whole flow. In my experience, **small, targeted experiences** work better:

- A contextual hint at the exact step where users get stuck.
- A shorter path for users who already know what they want.
- An empty state that suggests a concrete first action instead of a blank screen.

They are faster to build, easier to measure (one change, one hypothesis), and easier to remove if they don't work. A big redesign changes ten things at once, and when the numbers move you don't know why.

## Make experiences easy to turn on, off and compare

Each experience should be isolated behind a flag or variant so it can be measured against the current behavior:

```tsx
function OnboardingStep({ step }: { step: number }) {
  const variant = useVariant("guided-onboarding"); // "control" | "guided"

  useEffect(() => {
    track("Onboarding Step Viewed", { step, variant });
  }, [step, variant]);

  return variant === "guided" ? <GuidedStep step={step} /> : <DefaultStep step={step} />;
}
```

Tracking the variant on every event is what makes the comparison possible later: the same funnel, split by variant.

## Read the funnel after release — and be honest about it

Shipping is the middle of the work, not the end. After release:

- **Check the instrumentation first.** Before reading the results, confirm events fire once, with the right properties, on every platform.
- **Compare the funnel by variant**, not the overall numbers, which are affected by seasonality and marketing campaigns.
- **Give it enough time and traffic** before deciding; small samples lie.
- **Remove what didn't work.** Experiences that don't move the metric are just complexity.

## Performance is part of conversion

An experience that delays the page or makes it janky can cancel out its own benefit. Small experiences should be **lazy-loaded** when they're not needed on first paint, and analytics calls should never block rendering or interactions. On content and marketing surfaces, static-first tools like Astro and Gatsby help keep pages fast while the interactive parts load only where they're needed.

## Key takeaways

- **Define the activation metric and funnel before designing UI.**
- **Make the tracking plan typed** so analytics can't break silently.
- Prefer **small, focused experiences** with one hypothesis each.
- **Ship behind variants** and track the variant on every event.
- **Read the data honestly** after release, and remove what doesn't work.
