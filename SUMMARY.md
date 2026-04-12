# Next.js App Router: Server vs Client Components (Mental Model)

## Lab guides

- Build matrix guide: see `app/build/BUILD_TESTS.md` (also rendered at `/build/guide`)

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
- Not allowed to execute hooks or Browser API
- Fetch data from databases or APIs close to the source
- Use API keys, tokens, and other secrets without exposing them to the client
- Reduce the amount of JavaScript sent to the browser.
- Improve **FCP** and stream content progressively to the client

**Client Component** (`"use client"`)

- Runs: **server render** (to produce initial HTML) _and_ **browser** (to hydrate and handle interactions)
- Can access: browser APIs (only in the browser phase)
- Ships to browser: **yes** (it’s part of the client JS chunks)
- Regardless of the rendering type (SSG or SSR), server and client components are both rendered on the server, and client components will reexecute it on the browser after hydration completed.
- Prefer fetching data in Server Components and pass as props.
- Able to access browser-only API, state, hooks

**_RSC payload is serialized as data have to be serialized (encode message into bytes using shared rules) to transmit over network then deserialized by the receiver to access the complete messages_**

- Both server and client components can actually shared the same data using `React.cache` + `Context`
- Write a server fetching function wrapped with `React.cache` to cache the function -> trigger network request at layout (don't await it) -> passing the data into providers -> server component will call that server fetching function once again (but with await this time), since its same request, the cached data will be reused -> client component will retrieve the promised data from the useContext hooks

### Server rendering both `server components` and `client components` using different renderers, `server components` using `RSC renderer` while client components using `React DOM server renderer`, `React DOM server renderer` can execute hooks but also wont execute effect until hydration completes.

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

## 3) SSG vs SSR vs ISR

**SSG vs SSR is mostly about _when_ the HTML gets produced**.
**SSG and SSR has no deal on both client and server components**

- **SSG**: HTML is generated ahead of time (build time or cached ahead of requests).
- **SSR**: HTML is generated at request time.
- **SSG**: Data frozen at build time, no automatic freshness unless revalidation is set up.
- “HTML of both client and server components are generated during build time” is only true for **SSG** routes.
- For **SSR**, that HTML is generated **per request**.
- **ISR** = **SSG** with revalidation (regenerate HTML in the background after a certain time).
- **ISR** will not auto build and replace HTML, it will used the first generated HTML until revalidation happens, thn it will regenerate the HTML and replace the CDN cached HTML, usually happens in CDN edge functions (depends, might in a self hosted Node server or serverless runtime as well).
- Accessing any of those in any segments of the routes (no matter how deep it is) will cause the page to be force rendered at full **SSR** as signal will be bubbled up:
  - `cookies()`
  - `headers()`
  - `connection()` (ensure component below this line excluded from prerendering)
  - fetch with `{ cache: 'no-store' }`
  - dynamic = `force-dynamic`

Also:

- Even for SSG pages, Client Components still hydrate and run in the browser.

## 4) RSC / Flight payload vs HTML

It’s easiest to separate them:

### HTML

- Browser receives HTML (possibly streamed) for the document.
- This HTML contains the DOM markup the user sees immediately(first paint).

### RSC / Flight payload

- This is **not HTML**.
- It is a serialized React tree (server component results) plus **client component references**.
- Those references let the client know _which_ client component boundaries exist and which JS chunks are needed.
- Used to reconstruct the server component tree in client runtime
- The reason React have to recreate a client-side tree instead of using the server rendered HTML is because `hydration` is not magic, it cant direct attach JS to the static HTML, have to create a `React Fiber Tree`(instance graph) first, it contains event handlers, wiring, hooks etc, the only way to create those structure is to run the render logic on the client at least once.

So: the “placeholder” language in the docs is about the **RSC tree serialization**, not about “Client Components never render on the server”. Client Components can still participate in SSR HTML, but in the RSC payload they appear as boundaries/references.

## 5) Suspense (especially relevant with Partial Prerendering)

- `Suspense` is a boundary React uses for async rendering.
- Next can use `Suspense` boundaries to **split a route into static shell + dynamic holes**.
- In Partial Prerendering (PPR-style), the static parts can be produced ahead of time, and the dynamic parts can be rendered on-demand and streamed.
- Defining components inside `Suspense` boundaries can understand as deferred the rendering of that particular component until request time
- `Suspense` boundary should be placed as close as possible to the components that need to be deferred, to maximize the content in the static shell.
- All components defined in `Suspense` boundary will be rendered parallely and independently as long as there is no data dependency between the parent and children, e.g. children depends on the data fetched from parent as props

Typical reasons a subtree becomes “dynamic”:

- Request data: `cookies()`, `headers()`, `connection()`, etc.
- Truly dynamic data reads (uncached fetches, current time, random, etc.)

## 6) Hydration

- Hydration is “attach event listeners + make UI interactive” for Client Components.
- Server Components do not hydrate (there’s no client JS for them).
- Only happen once per **Client Component subtree** when its HTML is first revealed/attached, subsequent RSC payload streamed over **will not rehydrate** again
- If the content of the client components in **Suspense** e.g. A list of interactable components, this portion of client components will be streamed over and hydration only happen once again for this particular newly inserted server-rendered markup.

What the browser typically uses on a full page load:

1. HTML stream arrives
2. Client JS chunks load (including Client Components)
3. RSC/Flight data is used to reconstruct the React tree and coordinate hydration
4. Client Components run again in the browser to hydrate

## 7) Incremental Caching

- **SSG** generate the HTML at build time while **SSR** have to generate the HTML from scratch for each user request so its kind of expensive.
- Instead of "render everything and throw away", they allow a hybrid approach where parts of the page can be cached and reused across requests, improving performance.
- Next cache is composable and incremental, it allowed the nodes to be cached. Functions, segments and fetches are all nodes.
- Only server components can be cached, can understand cache() as the useMemo when using on a computation function as it will cached the computed results
- use cache is not PER session, its global cache across sessions, cache lives in server/edge memory, will be shared across users and requests

## 8) Caching Types

# Full Route Cache

- **SSG** is also one of the way to populate full route cache
- `Full Route Cache` means “The entire output of this route (RSC payload + HTML shell) can be reused”
- Full Route Cache is enabled automatically if ALL of these are true:
  ✅ No cache: 'no-store'
  ✅ No headers() / cookies()
  ✅ No force-dynamic
  ✅ No uncached fetches
  ✅ No runtime-only APIs
- **_Full Route Cache decides whether SSR happens; Partial caches decide how expensive SSR is._**

# Browser Cache

- `Browser cache` mainly caching the HTTP responses, CSS, assets, and JS in browser memory.
- Disabling the cache options in dev tools will just disable the `Browser cache`, it will still hit the server to get the latest response but the static assets (JS/CSS) will be loaded from network again instead of `Browser cache`
- Browser cache controls :
  ✅ Code
  ✅ Assets
  ✅ Static shells
- Persists across reload

# Next Router Cache

- Mainly cached the RSC payload + `Route Segments` in memory
- `Route Segments` means the individual parts of the route tree (layouts, pages, components, parallel routes etc), each has its own RSC subtree, NextJS bundled them into one Flight response, so every navigation will see only 1 request but actually its containing multiple segment payloads
- For subsequent navigation(revisit), no need extra network trip to refetch the RSC payload anymore
- Wiped cached RSC payload on reload
- Commonly used on client navigation (revisit, prefetch)
- Nextjs will decide whether to reuse the RSC payload on router cache based on the **flag**, there is a **dynamic flag** on each route segments, it will reuse the static segment, and refetch the RSC payload for those dynamic segments

# React.cache

- Mainly cached the function results in server/edge memory
- Effective per request / per render, ONLY scoped to current request
- NOT a durable cross-request cache
- Mainly to deduplicate repeated DB reads or computed values during one render

# Data cache

- Mainly cached the HTTP response from fetch API in server/edge memory
- Can be cross-request
- Also deduplicate repeated fetches across render/requests

# `use cache` directive

- cached the component/function output into Next incremental cache
- Can be cross-request, shared across user

## 9) HTML

- `HTML` used for a) first paint, b) hydration target
- React never render from the `HTML` directly
- React render from data -> components -> DOM, HTML alone not enough, it has no props, component boundaries, module references

## 10) PROD server vs DEV server

- In production, we create one optimized build and deploy it, no on-the-fly changes after deployment
- In production, pages are pre-rendered once during the build, in development, pages are pre-rendered on every request
- Focus on /.next/app or /.next/static folder for built output, /app file similar to the folder structure for server component, will have html(.html) and **RSC payload**(.rsc) for each route entry
- **RSC payload** in the output folder is representing a virtul DOM in a compact way
- **RSC payload** for server component will be the server rendered result and the html text in it
- **RSC payload** for client component has placeholder showing where the client component should go + references to the js file(pointing to /static files)

## 11) All assets in dev tools

- localhost: our initial index.html
- xx.rsc: RSC payload for the particular route

- Direct route visit (typing url in browser) will serve HTML, while client-side navigation uses RSC payload and Javascript chunks without additional server requests

## 12) Prefetching

- **Prefetching** only works in production mode
- **Prefetching** will ONLY fetched the full route when its static page, if its dynamic page will ONLY fetched up to the loading.js
- By default the client cache (from `prefetch`) will persists for **_5 min_** only
- **Prefetching** works differently in `app router` vs `pages router`.
  - `pages router` prefetch = it mainly prefetches **JS + page data** (no RSC concept there)
  - `app router` prefetch = it mainly prefetches **RSC/Flight payload** (and enough route segments to make navigation instant). With `cacheComponents: true` / PPR-style, what gets prefetched can be a **partial tree** (e.g. up to a Suspense boundary / static shell) instead of “everything”.
- **Prefetch** didnt care about FCP, it’s for _client side navigation optimization_ (instant transitions), not first paint.
- Cached RSC payload (Next Router Cache) will wipe on **any full reload** (CTRL + R also clears it), while CTRL + SHIFT + R mainly affects the **browser HTTP cache** for assets.
- As long as we didnt make our page **dynamic**, and once RSC payload cached in the router cache, across client side navigation, it will reuse it. So even wrapped with **Suspense** and **CacheComponent** enabled, its not saying that particular component will always being executed on request; it just saying it can be streamed / deferred, and the client might still reuse a previously fetched snapshot unless we force refresh (e.g. `router.refresh()`).
- Can use `router.prefetch(/xxx)` to prefetch specific routes programmatically

## 13) NextJS Data Fetching

- Recommended data fetching to prevent `waterfall network request`, separate component into smaller pieces and fetch data in each component instead of fetching all data in parent component and pass down as props.
- If cases like component B wrapping component C, B have to await for data, can trigger both network request in parallel and then await one of the promises in component B
- If component B wraps component C and B must await its own data, you can still start both requests in parallel and await B's result while passing the child's promise down. Example:
- NextJS with its **Request Memoization** mechanism will ensure that the fetch request with `Get` or `Head` with the same URL and options in a single render will be combine into one request and deduplicated, so even component C awaits the same fetch, it will reuse the same network request started in parent component B.
- **Request Memoization** is scoped to the lifetime of a request

```ts
// start both requests (non-blocking)
const parentParallelPromise = fetchTime(origin, "parent-parallel", ms);
const childParallelPromise = fetchTime(origin, "child-parallel", ms);

// await B's result; C can `await childParallelPromise` when needed
const parentParallel = await parentParallelPromise;
```

- If both components going to use the same data, expected trigger the network request at the lowest common ancestor and pass down as props to prevent duplicate network request.

## 14) Revalidate

- We can cache server components, functions and even api response using `use-cache` directives and `cache-tag` to tag them with a key
- There are total of 4 options available to revalidate those cached results :
  a) revalidatePath : invalidates specific page or layout paths
  b) revalidateTag : ONLY invalidates data with specific tags across all pages that use those tags
  c) cacheLife : provide options `revalidate`,e.g. cacheLife({revalidate: 60}) to ensure a revalidate for every 60 seconds
  d) updateTag : update cached data on-demand for a specific cache tag from within Server Actions
- All options only can be called in server components, route handlers or server actions, never allow to be called in client component
- `revalidateTag` or `updateTag` will mark the tag or cache as staled, next request or render boundary will stream over the new RSC payload
- Latest RSC payload will be streamed over on HTTP Post response after user revalidated it and client will then reconstruct the tree, perform incremental reconcilation to compare the RSC payload and update as necessary

**_ Good To Know_**

- `revalidateTag`(tag, { expire: 0 }), this can ensure the data will be expired immediately
- recommended to use `updateTag` in server actions for immediate updates instead
- `updateTag` only can be called inside the `server actions`, not even in route handlers
- `updateTag` will not showing staled content on next request, while `revalidateTag` with profile **(max)** will kind of having a SWR(stale-while-revalidate) behaviour, will show staled content while fresh data loading in background
- When using **profile="max"**, `revalidateTag` will have a intended behaviour where it will marked the tagged data as stale, and only fetched the fresh data for the pages that are next visited, which mean its normal for seeing the staled content for **at least once** before updated to the latest content.
- `RevalidatePath` vs `router.refresh()`
  a) `revalidatePath` only can be executed in server side, while `router.refresh()` can only be executed in client side
  b) `router.refresh()` most likely to revalidate the content for the client itself (refetch RSC payload), while `revalidatePath` will revalidate the specific path provided, will affect all subsequent requests to that path across all clients
  c) `router.refresh()` will clear **Router Cache**, remain **Full Route Cache** and **Data Cache**, while `revalidatePath` will clear both **Full Route Cache** and **Data Cache** for that particular path

## 15) Performance Optimization

- During production, NextJS will automatically enabled below optimizations without additonal configuration :
  ✅ Server components
  ✅ Code Splitting
  ✅ Prefetching
  ✅ Static rendering (SSG)
  ✅ Caching
- Other optimizations that required manual configuration :
  ✅ Partial Prerendering (PPR) using `Suspense` boundaries
  ✅ Incremental Caching using `cache()` directive
  ✅ Image Optimization using `next/image` component
  ✅ Font Optimization using `next/font` component
  ✅ Analytics using `@vercel/analytics` package
  ✅ CDN caching using proper `Cache-Control` headers
  ✅ Parallel Data Fetching to reduce network request waterfall
  ✅ Use `public` folder for static assets to leverage browser caching
  ✅ Streaming using `Suspense` and loading UI(loading.js) to progressively sending UI from server to client
