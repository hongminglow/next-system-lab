# Next.js App Router: Server vs Client Components (Mental Model)

This note is written for **App Router + React Server Components (RSC)**.

## TL;DR (the correct core idea)

- **Server Components** run only on the server. Their code **does not ship to the browser**.
- **Client Components** can render HTML on the server (for the initial HTML), but their _interactive_ behavior happens only after the browser downloads the JS and hydrates.
- On a full page load, Next sends **HTML** _and_ an **RSC/Flight payload**. The payload contains the server-rendered tree + **references** to client components so the client knows what to load/hydrate, imagine throwing a complete HTML to browser, it has no idea which part have to hydrate without the hints from the RSC payload.

## 1) Server Components vs Client Components

### What runs where?

**Server Component**

- Runs: **server only**
- Can access: databases, filesystem, private env vars, `cookies()`/`headers()` etc.
- Ships to browser: **no** (except serialized results)

**Client Component** (`"use client"`)

- Runs: **server render** (to produce initial HTML) _and_ **browser** (to hydrate and handle interactions)
- Can access: browser APIs (only in the browser phase)
- Ships to browser: **yes** (it’s part of the client JS chunks)
- Regardless of the rendering type (SSG or SSR), server and client components are both rendered on the server, and client components will reexecute it on the browser after hydration completed.

### Why did `console.log` inside a Client Component print on the server?

Because Next typically does **SSR for the initial HTML**, and the Client Component function is executed during that SSR pass.

The important nuance is:

- **Client Component render function** may run on the server (to output HTML)
- **Client-only effects** like `useEffect` do **not** run on the server

## 2) Hooks behavior in Client Components

- Render-time hooks like `useState`, `useMemo`, `useReducer` are fine during SSR, those hooks not touching browser APIs.
- `useEffect` does not run during SSR; it runs after hydration in the browser.
- `useLayoutEffect` can warn in SSR (React treats it specially). Prefer `useEffect`.

Important gotcha:

- Even though a Client Component can execute on the server during SSR, it still must obey **client bundling rules**: it must not import Node-only modules (e.g. `fs`) because that code is intended to ship to the browser.

## 3) SSG vs SSR

**SSG vs SSR is mostly about _when_ the HTML gets produced**.
**SSG and SSR has no deal on both client and server components**

- **SSG**: HTML is generated ahead of time (build time or cached ahead of requests).
- **SSR**: HTML is generated at request time.
- “HTML of both client and server components are generated during build time” is only true for **SSG** routes.
- For **SSR**, that HTML is generated **per request**.

Also:

- Even for SSG pages, Client Components still hydrate and run in the browser.

## 4) RSC / Flight payload vs HTML

It’s easiest to separate them:

### HTML

- Browser receives HTML (possibly streamed) for the document.
- This HTML contains the DOM markup the user sees immediately.

### RSC / Flight payload

- This is **not HTML**.
- It is a serialized React tree (server component results) plus **client component references**.
- Those references let the client know _which_ client component boundaries exist and which JS chunks are needed.

So: the “placeholder” language in the docs is about the **RSC tree serialization**, not about “Client Components never render on the server”. Client Components can still participate in SSR HTML, but in the RSC payload they appear as boundaries/references.

## 5) Suspense (especially relevant with Partial Prerendering)

- `Suspense` is a boundary React uses for async rendering.
- Next can use `Suspense` boundaries to **split a route into static shell + dynamic holes**.
- In Partial Prerendering (PPR-style), the static parts can be produced ahead of time, and the dynamic parts can be rendered on-demand and streamed.

Typical reasons a subtree becomes “dynamic”:

- Request data: `cookies()`, `headers()`, `connection()`, etc.
- Truly dynamic data reads (uncached fetches, current time, random, etc.)

## 6) Hydration

- Hydration is “attach event listeners + make UI interactive” for Client Components.
- Server Components do not hydrate (there’s no client JS for them).

What the browser typically uses on a full page load:

1. HTML stream arrives
2. Client JS chunks load (including Client Components)
3. RSC/Flight data is used to reconstruct the React tree and coordinate hydration
4. Client Components run again in the browser to hydrate
