# Phase 3: Technical SEO and Search Indexability

Follow the master instructions.

## Goal

Improve the portfolio's technical SEO without changing its visual design or breaking animations.

## Tasks

1. Audit metadata for every public route.
2. Implement Next.js Metadata API configuration for page titles, descriptions, metadata inheritance, and relevant social-sharing information.
3. Use an appropriate absolute metadata base URL from the configured production domain.
4. Implement canonical URLs only when the canonical destination is correct.
5. Generate sitemap.xml for public, indexable routes.
6. Configure robots.txt to permit crawling of intended public content without exposing private routes or sensitive paths.
7. Add Open Graph and Twitter/X metadata with valid image URLs.
8. Use semantic HTML, descriptive links, logical heading levels, and meaningful image alt text.
9. Add appropriate structured data for the actual content, such as Person or WebSite, only when accurate and useful.
10. Ensure that SEO-critical text and project content are present in the initial server-rendered HTML or static HTML output wherever appropriate.
11. Ensure navigation links are crawlable and pages can be loaded directly.
12. Verify 404 handling, redirect behavior, URL consistency, and trailing-slash configuration.
13. Check that the site does not accidentally emit noindex directives or block search engines in production.
14. Preserve existing analytics and integrations.

Do not invent personal details, qualifications, project metrics, reviews, or structured-data claims.

## Important

Do not add metadata that conflicts with existing metadata. Avoid duplicate titles, descriptions, canonical tags, and structured data.

Do not claim that metadata alone guarantees rankings.

## Validation

- Inspect rendered page titles and meta descriptions.
- Inspect canonical, Open Graph, and robots metadata.
- Verify sitemap.xml and robots.txt.
- Check the initial HTML response for important portfolio content.
- Validate structured data where implemented.
- Verify that all original animations still work.
- Run a production build.

Report the SEO changes and any issues requiring Search Console or production-domain access. Stop and wait for approval.