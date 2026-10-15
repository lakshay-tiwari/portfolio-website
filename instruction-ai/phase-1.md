# Phase 1: Next.js Foundation

Follow the master instructions and use the approved Phase 0 audit.

## Goal

Set up the Next.js App Router architecture while preserving existing dependencies, styles, assets, and functionality.

## Tasks

1. Configure Next.js and the App Router using a compatible version.
2. Preserve the current package manager and lockfile.
3. Configure TypeScript, linting, build scripts, aliases, and other existing tooling as needed.
4. Establish the root layout, global styles, font configuration, and document metadata.
5. Reuse the existing CSS reset, theme variables, and design tokens.
6. Establish a reusable page container that preserves the original site's horizontal alignment, maximum width, and responsive gutters.
7. Move or reference existing assets appropriately.
8. Preserve environment variables and deployment configuration.
9. Set up the minimum required route structure based on the audit.
10. Identify which components must use the Client Component boundary because they depend on animation libraries or browser APIs.

Do not implement SEO improvements beyond the metadata needed for the foundation; those will be handled in a later phase.

## Constraints

- Do not redesign the page.
- Do not remove animation libraries.
- Do not replace existing styling with a different framework.
- Do not introduce unnecessary dependencies.
- Do not add "use client" to the root layout unless absolutely necessary.
- Do not leave two competing application implementations without documenting which one is active.

## Validation

- Install dependencies successfully.
- Verify the Next.js development server starts.
- Verify the production build succeeds for the current migration state.
- Check font loading, global CSS, asset paths, and responsive container behavior.
- Document all outstanding issues.

Stop after Phase 1 and wait for approval.