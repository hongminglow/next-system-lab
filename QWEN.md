# QWEN.md — Next System Lab

## Project Overview

**next-system-lab** is a Next.js 16 "lab" application designed to test, explore, and understand Next.js internals — specifically React Server Components (RSC), SSG/SSR behavior, caching mechanisms, the RSC/Flight payload, and Partial Prerendering (PPR-style).

It is **not** a production app. It is an educational/experimental codebase with heavily labeled, intentionally repetitive test cases that let you correlate route configuration, data-fetching cache modes, Suspense boundaries, `use cache` directives, and Client Component presence with the resulting build output.

### Key Technologies

| Category | Stack |
|----------|-------|
| Framework | Next.js 16.1.6 |
| React | 19.2.3 |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS v4 + PostCSS |
| i18n | next-intl |
| Theming | next-themes |
| Linting | ESLint 9 + eslint-config-next |
| Font | Geist (Sans + Mono) via next/font |

### Architecture Highlights

- **App Router** structure with `app/` directory
- **Path alias**: `@/*` maps to project root
- **Typed Routes**: enabled via `typedRoutes: true`
- **Cache Components**: enabled via `cacheComponents: true` in next.config.ts
- **Internationalization**: supports `en` and `ms` locales via next-intl plugin
- **Theme System**: light/dark/system via `next-themes` with `class` attribute strategy
- **Sidebar Layout**: state managed via React context, mirrored to data attributes (`data-sidebar-collapsed`) and CSS variables (`--sidebar-current-width`) for CSS-driven layout

## Directory Structure

```
next-system-lab/
├── app/                        # Next.js App Router
│   ├── _components/            # Shared UI components (AppShell, sidebar, etc.)
│   ├── _lib/                   # Shared utilities
│   ├── api/                    # API routes
│   ├── build/                  # Build matrix test cases (A–Z)
│   ├── probes/                 # Probing/experiment routes
│   ├── ssg/                    # SSG experiment routes
│   ├── ssr/                    # SSR experiment routes
│   ├── tests/                  # Interactive test pages
│   │   ├── rendering/          # Server vs Client Components
│   │   ├── use-cache/          # `use cache` directive tests
│   │   ├── cache-vs-force-cache/  # React cache() vs fetch cache
│   │   ├── cms/                # CMS strategy: SSR vs ISR vs PPR
│   │   ├── waterfall/          # Waterfall vs parallel fetching
│   │   ├── parallel/           # Parallel Routes (@slot)
│   │   ├── mode/               # Mode experiments
│   │   ├── swr-tag/            # Stale-while-revalidate tag tests
│   │   └── i18n/               # i18n tests
│   ├── layout.tsx              # Root layout (Geist fonts, Providers, AppShell)
│   ├── page.tsx                # Home page
│   └── providers.tsx           # ThemeProvider + SidebarProvider
├── design-system/              # Design system assets
├── i18n/                       # i18n configuration
│   ├── config.ts               # Locale definitions (en, ms)
│   └── request.ts              # Request-time locale resolution
├── locales/                    # Translation JSON files
│   ├── en.json
│   └── ms.json
├── public/                     # Static assets
├── .github/prompts/            # AI assistant prompts (ui-ux-pro-max)
├── next.config.ts              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
├── eslint.config.mjs           # ESLint configuration
├── tailwind.config / postcss.config.mjs  # Styling configuration
├── README.md                   # Getting started guide
└── SUMMARY.md                  # Comprehensive RSC/Next.js mental model doc
```

## Building and Running

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The dev server auto-updates on file changes.

### Production Build

```bash
npm run build
```

### Production Server

```bash
npm run start
```

### Linting

```bash
npm run lint
```

### Key Routes

| Route | Purpose |
|-------|---------|
| `/` | Home page |
| `/tests` | Index of all interactive experiments |
| `/tests/rendering` | Server vs Client Components |
| `/tests/use-cache` | `use cache` directive |
| `/tests/cache-vs-force-cache` | React `cache()` vs `fetch(..., { cache: 'force-cache' })` |
| `/tests/cms` | CMS strategy: SSR vs ISR vs PPR-style |
| `/tests/waterfall` | Waterfall vs parallel fetching |
| `/tests/parallel` | Parallel Routes (`@slot`) |
| `/build` | Build matrix index |
| `/build/guide` | Build guide (source: `app/build/BUILD_TESTS.md`) |

## Build Matrix (`/build/*`)

The `/build` folder contains systematically labeled test cases (A through Z) that demonstrate how different Next.js signals interact and what `next build` output they produce:

| Case | Route | Signal | Expected Build Result |
|------|-------|--------|----------------------|
| A | `/build/a-static-basic` | None | Static |
| B | `/build/b-static-with-client` | Client Component | Static (with hydration) |
| C | `/build/c-static-fetch-default` | Server `fetch()` default | Static |
| D | `/build/d-dynamic-fetch-no-store` | `fetch({ cache: 'no-store' })` | Dynamic |
| E | `/build/e-force-dynamic` | `export const dynamic = 'force-dynamic'` | Dynamic (requires `cacheComponents: false`) |
| F | `/build/f-force-static-with-client` | `export const dynamic = 'force-static'` | Static (requires `cacheComponents: false`) |
| G | `/build/g-suspense-no-store` | Suspense + `no-store` | Dynamic behavior |
| H | `/build/h-ppr-style-suspense-hole` | Suspense + headers() + no-store + "use cache" | PPR-style (static shell + runtime hole) |
| I | `/build/i-ppr-style-cached-chunk` | "use cache" + force-cache + no-store under Suspense | Composable caching |
| Z | `/build/z-conflicts` | Editable toggles | Manual exploration |

To test cases E and F, you must temporarily set `cacheComponents: false` in `next.config.ts` and uncomment the relevant `export const dynamic` line in the respective page file.

## Development Conventions

### TypeScript

- **Strict mode** enabled
- **ES2017** target
- **Path alias**: `@/*` → project root
- **No emit** — Next handles compilation
- Plugin for Next typed routes enabled

### Code Style

- ESLint 9 with `eslint-config-next` core-web-vitals and TypeScript rules
- `.next/`, `out/`, `build/`, `next-env.d.ts` excluded from linting

### Component Patterns

- **Server Components** are the default; use `"use client"` only when browser interactivity is needed
- Data fetching preferred in Server Components, passed as props to Client Components
- Parallel data fetching: start multiple requests simultaneously, await individually — Next's Request Memoization deduplicates identical fetches
- Suspense boundaries placed close to components that need deferral to maximize static shell

### Caching Strategy Understanding

The project documents several caching layers:

1. **Full Route Cache**: Reuses entire route output (RSC payload + HTML)
2. **Next Router Cache**: Caches RSC payload for client-side navigation (wiped on reload)
3. **React.cache()**: Per-request function result deduplication
4. **Data Cache**: Cross-request fetch response caching
5. **`use cache` directive**: Cross-request component output caching (incremental cache)
6. **Browser Cache**: HTTP cache for static assets

### Revalidation Methods

- `revalidatePath` — invalidates specific paths (server-side)
- `revalidateTag` — invalidates tagged cache data across pages
- `cacheLife({ revalidate: N })` — time-based revalidation
- `updateTag` — immediate on-demand cache update (server actions only)
- `router.refresh()` — client-side RSC payload refetch

## Important Notes

- **`cacheComponents: true`** in `next.config.ts` enables PPR-style behavior but **rejects** `export const dynamic = ...` overrides in Next 16
- **`SUMMARY.md`** contains an extensive mental model document covering RSC, SSR, SSG, ISR, hydration, caching, prefetching, and performance optimization — read it for deep understanding
- The build matrix pages are designed to be **repetitive and labeled** so you can directly correlate configuration with `next build` output
- Pages that access `cookies()`, `headers()`, `connection()`, or use `fetch({ cache: 'no-store' })` will force dynamic rendering
- Prefetching only works in production mode; client-side cache persists for 5 minutes by default
