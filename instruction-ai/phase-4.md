# Phase 4: Performance, Accessibility, and Rendering Optimization

Follow the master instructions.

## Goal

Improve real-world loading, rendering, and interaction performance while preserving the portfolio's animation quality.

## Tasks

1. Establish a performance baseline using Lighthouse or equivalent tools.
2. Inspect bundle sizes and identify unnecessary JavaScript.
3. Keep Server Components for static content and use smaller Client Component boundaries where practical.
4. Optimize image delivery with Next.js image features where appropriate.
5. Preserve image dimensions and aspect ratios to prevent layout shifts.
6. Optimize local font loading without changing the visual typography.
7. Lazy-load expensive components when doing so will not break entrance animations, initial viewport content, or user experience.
8. Avoid delaying the hero section or other important above-the-fold content.
9. Inspect large animation libraries, duplicated dependencies, expensive scroll handlers, and repeated re-renders.
10. Use appropriate event throttling, passive listeners, observers, or animation cleanup when necessary.
11. Reduce layout shifts and avoid expensive layout-triggering animation patterns where a verified alternative exists.
12. Support prefers-reduced-motion without making the site unusable or hiding important information.
13. Check contrast, keyboard navigation, focus states, accessible names, and mobile usability.
14. Avoid adding excessive client-side state or hydration solely for static presentation.

Do not remove, shorten, or simplify animations solely to improve a performance score.

Make changes incrementally and measure their effects.

## Validation

Compare before-and-after performance results under comparable conditions. Verify visual fidelity, mobile behavior, animations, layout stability, and accessibility.

Report the metrics that were actually measured. Do not fabricate Lighthouse scores or claim an improvement without evidence.

Stop after Phase 4 and wait for approval.