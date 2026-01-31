# /build – Next.js build matrix (static / dynamic / PPR-style)

This folder is designed to answer one question:

> **When multiple Next.js signals are present, which one wins, and what does `next build` output become?**

It’s intentionally repetitive and heavily labeled so you can correlate:

- **Route segment config** (e.g. `export const dynamic = ...`)
- **Server data fetching** cache mode (`default`, `force-cache`, `no-store`)
- **Suspense boundaries**
- **cacheComponents + `"use cache"`**
- **Presence of Client Components**

## How to run

1. Production build

```bash
npm run build
```

2. Start production server

```bash
npm run start
```

3. Visit each case route and refresh a few times.

## What to look for in `next build`

In the build output route table, Next typically marks routes as something like:

- **Static** (pre-rendered)
- **Dynamic** (rendered at request time)
- **PPR / partially pre-rendered** (static shell + runtime “holes”)

Exact symbols/labels vary across Next versions, but the key is: **each /build/\* route should land in a different bucket based on the signals used.**

## Case index

- A: `/build/a-static-basic`
- B: `/build/b-static-with-client`
- C: `/build/c-static-fetch-default`
- D: `/build/d-dynamic-fetch-no-store`
- E: `/build/e-force-dynamic`
- F: `/build/f-force-static-with-client`
- G: `/build/g-suspense-no-store`
- H: `/build/h-ppr-style-suspense-hole`
- I: `/build/i-ppr-style-cached-chunk`
- Z: `/build/z-conflicts`

---

## A) Static (basic)

**File:** `app/build/a-static-basic/page.tsx`

**Signals used:** none

**Expected:**

- `next build` shows it as **static**
- `builtAt` stays the same in production until rebuild

---

## B) Static + Client Component

**File:** `app/build/b-static-with-client/page.tsx`

**Signals used:**

- ✅ Has a Client Component (`ClientMarker`)

**Expected:**

- Still **static** in `next build`
- But browser downloads JS for the client component (hydration)

---

## C) Static + server `fetch()` (default)

**File:** `app/build/c-static-fetch-default/page.tsx`

**Signals used:**

- ✅ Server `fetch()` with **default** caching

**Expected:**

- Usually **static**

Notes:

- This uses an external endpoint. If you are offline, the UI will show a fetch error, but the build should still succeed (fetch is wrapped).

---

## D) Dynamic due to server `fetch({ cache: 'no-store' })`

**File:** `app/build/d-dynamic-fetch-no-store/page.tsx`

**Signals used:**

- ✅ Server `fetch()` with `cache: 'no-store'`
- ✅ Client Component present

**Expected:**

- `next build` marks it **dynamic**
- In production, the fetch result changes on refresh

---

## E) `export const dynamic = 'force-dynamic'` (toggle)

**File:** `app/build/e-force-dynamic/page.tsx`

**Signals used:**

- ✅ Route-level dynamic override (toggle)

**Important (Next 16):**

- When `next.config.ts` has `cacheComponents: true`, Next rejects `export const dynamic = ...`.

**How to test:**

1. Set `cacheComponents: false` in `next.config.ts`
2. In `app/build/e-force-dynamic/page.tsx`, uncomment:
   `// export const dynamic = "force-dynamic";`
3. `npm run build`

**Expected:**

- `next build` marks it **dynamic**
- In production, `renderedAt` changes on refresh

---

## F) `export const dynamic = 'force-static'` + Client Component (toggle)

**File:** `app/build/f-force-static-with-client/page.tsx`

**Signals used:**

- ✅ Route-level static override (toggle)
- ✅ Client Component present

**How to test:**

1. Set `cacheComponents: false` in `next.config.ts`
2. In `app/build/f-force-static-with-client/page.tsx`, uncomment:
   `// export const dynamic = "force-static";`
3. `npm run build`

**Expected:**

- `next build` marks it **static**

---

## G) Suspense boundary + `no-store` fetch

**File:** `app/build/g-suspense-no-store/page.tsx`

**Signals used:**

- ✅ `no-store` fetch
- ✅ Wrapped in `<Suspense>`

**Expected:**

- Without PPR-style splitting, this typically still forces the route to behave **dynamic**.
- This case is here to compare against H/I.

---

## H) PPR-style “runtime hole” under Suspense

**File:** `app/build/h-ppr-style-suspense-hole/page.tsx`

**Signals used:**

- ✅ Suspense boundary
- ✅ Runtime section uses request-bound origin (`headers()`) and `fetch({ cache: 'no-store' })`
- ✅ Cached section uses `"use cache"`

**Expected:**

- Route should show **static shell + runtime section** behavior (PPR-style)
- In production:
  - Static shell stays stable
  - Runtime section changes on refresh
  - Cached section (`cachedAt`) stays stable across refreshes

---

## I) PPR-style + `"use cache"` + `force-cache`

**File:** `app/build/i-ppr-style-cached-chunk/page.tsx`

**Signals used:**

- ✅ Cached chunk uses `"use cache"`
- ✅ Inside cached chunk: `fetch({ cache: 'force-cache' })`
- ✅ Runtime section uses `no-store` under Suspense

**Expected:**

- Demonstrates **composable caching**:
  - runtime chunk changes
  - cached chunk stays stable

---

## Z) Conflicts / toggles (edit + rebuild)

**File:** `app/build/z-conflicts/page.tsx`

This route is meant for _manual_ exploration. It contains knobs you can flip and then re-run build.

### Toggle 1: `dynamic` override

In `app/build/z-conflicts/page.tsx`, find:

```ts
// export const dynamic = "force-static";
// export const dynamic = "force-dynamic";
```

- Uncomment exactly one line.
- Then run:

```bash
npm run build
```

**Expected:**

- `force-static` tries to keep the route static (unless you introduce incompatible signals)
- `force-dynamic` forces dynamic

### Toggle 2: fetch cache mode

In the same file, find:

```ts
const FETCH_MODE: "default" | "force-cache" | "no-store" = "default";
```

Change it to `"no-store"`, then rebuild.

**Expected:**

- `no-store` pushes the route toward dynamic

### Toggle 3: Suspense boundary

In the same file, find:

```ts
const WRAP_IN_SUSPENSE = true;
```

Flip it to `false`, rebuild, and compare.

---

## Notes on “industry standard” patterns used here

- Theme switching: `next-themes` + Tailwind `dark:` via `.dark` class is a very common production pattern.
- Sidebar state: React state is mirrored into **data attributes** (`data-sidebar-collapsed`) and layout math is done via **CSS variables** (`--sidebar-current-width`).
  - This keeps layout consistent, avoids brittle JS measurements, and plays nicely with Tailwind utility classes.
