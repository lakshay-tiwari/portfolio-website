# Phase 2: Incremental Component and Animation Migration

Follow the master instructions and the approved audit.

## Goal

Migrate all existing portfolio sections and interactions to Next.js while preserving their appearance and behavior.

## Migration strategy

Work incrementally in this order, adapting the sequence to the actual application:

1. Shared layout and navigation.
2. Hero section and its entrance animations.
3. About and skills sections.
4. Projects and project-detail interactions.
5. Experience and other existing sections.
6. Blog or article sections, if present.
7. Contact section and form interactions.
8. Footer and shared decorative effects.
9. Remaining routes, overlays, menus, and interactive components.

Do not create sections that do not exist in the original website. Do not omit sections that do exist.

## Component rules

- Keep content and layout server-renderable where practical.
- Isolate interactive and animation-heavy components as Client Components.
- Preserve component boundaries when they help retain animation behavior.
- Keep existing animation libraries unless there is a demonstrated compatibility issue.
- Preserve motion settings, animation variants, initial states, viewport triggers, timing, easing, and exit animations.
- Verify cleanup for event listeners, observers, animation frames, and other resources.
- Verify client-side navigation and direct loading of nested routes.
- Check that browser-only APIs are not accessed during server rendering.
- Avoid hydration mismatches caused by random values, dates, browser state, or inconsistent initial markup.

If an animation library needs a compatibility adjustment, implement the smallest appropriate change and verify the result visually.

## After each section

1. Run the application.
2. Compare the migrated section against the original screenshots.
3. Test entrance and scroll-triggered animations.
4. Test hover, click, keyboard, and touch interactions where applicable.
5. Verify responsive spacing and alignment.
6. Check the browser console for errors.
7. Fix regressions before migrating the next section.

## Validation

Run type checking, linting where configured, and the production build. Test every existing route and confirm that no content or interaction has been lost.

Stop after Phase 2 and provide a migration report. Do not begin SEO or performance refactoring yet.