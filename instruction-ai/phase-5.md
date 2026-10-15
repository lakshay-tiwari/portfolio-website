# Phase 5: Final QA, Production Build, and Deployment Readiness

Follow the master instructions.

## Goal

Verify that the migrated portfolio is ready for production.

## Testing checklist

### Functional tests

- All original routes load directly.
- Navigation and mobile menus work.
- Project links and external links work.
- Contact forms and validation work, if present.
- All interactive elements work with mouse, touch, and keyboard as applicable.
- No essential content is missing.
- Refreshing or opening a nested URL does not produce an error.

### Animation regression tests

- Page-load animations.
- Scroll-triggered animations.
- Staggered sequences.
- Hover and tap effects.
- Navigation transitions.
- Background animations and decorative effects.
- Repeated scrolling and route changes.
- Reduced-motion behavior.
- Cleanup of observers, listeners, and animation frames.

### Visual regression tests

Compare original and migrated screenshots at:

- 1440 × 900 desktop.
- 768 × 1024 tablet.
- 390 × 844 mobile.

Also compare relevant scroll positions and interaction states.

Pay special attention to consistent horizontal margins, section widths, typography, line wrapping, image sizing, and layout shifts.

### Technical tests

- Production build succeeds.
- Type checking and configured linting pass.
- No unresolved migration-related hydration errors.
- No broken assets or unexpected failed requests.
- No accidental exposure of environment variables.
- SEO metadata, sitemap, robots.txt, and canonical URLs are correct.
- Production routes return the expected HTTP statuses.
- Deployment configuration is consistent with the actual hosting platform.

### Final deployment report

Provide:

1. Summary of the migration.
2. Routes and components migrated.
3. Animation regression results.
4. SEO changes.
5. Before-and-after performance measurements, if available.
6. Tests passed and failed.
7. Known limitations.
8. Deployment steps and environment variables required.
9. Any post-deployment verification steps.

Do not deploy to production, delete the original source, or modify DNS unless I explicitly authorize it.

Stop after the final report.