# Phase 0: Audit and Establish a Baseline

Follow the master migration instructions.

Do not modify application code during this phase.

## Tasks

1. Inspect the complete repository structure.
2. Identify the current framework, build tool, package manager, Node.js requirements, scripts, and dependency versions.
3. Identify the routing system and enumerate every existing route.
4. Identify the styling approach, design tokens, global CSS, typography, fonts, breakpoints, and shared layout components.
5. Identify every animation library and animation-related component.
6. Inspect animations involving scroll events, IntersectionObserver, requestAnimationFrame, window, document, canvas, SVG, WebGL, and other browser APIs.
7. Identify dynamic imports, lazy-loaded components, third-party widgets, analytics, and external integrations.
8. Identify image assets, icons, videos, local fonts, and other media.
9. Identify existing SEO metadata and social-sharing configuration.
10. Inspect accessibility features and reduced-motion behavior.
11. Identify all environment variables and deployment assumptions without exposing secret values.

## Animation inventory

Create a checklist of the important animations and interactions, including:

- Component or section.
- Trigger.
- Animation type.
- Duration and easing, when identifiable.
- Dependencies.
- Browser APIs used.
- How to verify the behavior after migration.

## Visual baseline

Run the existing application and record screenshots at consistent viewport sizes:

- Desktop: 1440 × 900.
- Tablet: 768 × 1024.
- Mobile: 390 × 844.

Also document important scroll positions, menu states, hover states, and interactive behaviors.

Use the actual existing design as the source of truth. Do not invent missing behavior.

## Deliverables

Produce a concise migration audit containing:

- Existing architecture.
- Proposed Next.js architecture.
- Existing route inventory.
- Animation and interaction inventory.
- Dependencies that may require migration adjustments.
- SEO gaps.
- Potential breaking changes.
- A phased migration plan with acceptance criteria.

Do not start the implementation. Finish the audit and wait for approval.