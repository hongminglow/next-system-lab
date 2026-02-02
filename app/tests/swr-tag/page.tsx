import { Suspense } from "react";
import { TagButtons } from "./_components/TagButtons";
import { SwrTagPanel } from "./_components/SwrTagPanel";

export default async function Page() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">
        SWR-ish cache + revalidateTag
      </h1>

      <p className="text-sm text-zinc-700 dark:text-zinc-300">
        This page is <span className="font-medium">not</span> marked with{" "}
        <span className="font-medium">&quot;use cache&quot;</span>, so it should
        re-render on refresh in production. The values below are cached via{" "}
        <span className="font-medium">unstable_cache()</span>.
      </p>

      <TagButtons />

      <Suspense
        fallback={
          <div className="rounded-lg border border-black/10 bg-white/70 p-4 text-sm text-zinc-600 dark:border-white/15 dark:bg-zinc-950/40 dark:text-zinc-300">
            Loading server data…
          </div>
        }
      >
        <SwrTagPanel />
      </Suspense>

      <div className="flex items-center justify-between">
        <a className="text-sm underline" href="/tests">
          Back
        </a>
        <div className="text-xs text-zinc-500 dark:text-zinc-400">
          tags: swr-random, swr-random-timed
        </div>
      </div>
    </main>
  );
}
