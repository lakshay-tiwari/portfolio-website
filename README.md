# Lakshya Tiwari — Portfolio

This repository hosts the personal portfolio website of Lakshya Tiwari (Full-Stack Engineer & AI Developer).

## Active Architecture: Next.js App Router

The application is actively running on **Next.js 16 (App Router)** with **React 19**, **TypeScript**, and **Tailwind CSS**.

### Scripts

- `npm run dev`: Starts the Next.js development server with Turbopack.
- `npm run build`: Generates the production Next.js static build.
- `npm run start`: Starts the Next.js production server.
- `npm run typecheck`: Runs TypeScript type checking (`tsc --noEmit`).

### Legacy Vite Fallback

The legacy Vite SPA implementation is preserved for reference:
- `npm run dev:vite`: Starts the legacy Vite dev server.
- `npm run build:vite`: Builds the legacy Vite bundle to `dist/`.
- `npm run preview:vite`: Previews the legacy Vite build.

## Project Structure

```
├── public/                 # Static assets (images, profile pictures)
├── src/
│   ├── app/                # Next.js App Router (active)
│   │   ├── layout.tsx      # Root layout (fonts, theme init, metadata)
│   │   ├── page.tsx        # Home route (/)
│   │   └── blogs/page.tsx  # Blogs route (/blogs)
│   ├── components/         # Reusable UI, motion, and layout components
│   ├── config/             # Theme and site configurations
│   ├── data/               # Content data (projects, skills, experience, social)
│   ├── views/              # Legacy SPA page views (Home, Blogs)
│   └── index.css           # Global Tailwind and design system CSS
├── next.config.mjs         # Next.js configuration
├── tailwind.config.js      # Tailwind design system configuration
└── tsconfig.json           # TypeScript configuration
```
