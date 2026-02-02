import { headers } from "next/headers";
import { getTaggedRandom, getTimedRandom } from "../_lib/random";

export async function SwrTagPanel() {
  // Request data access must live inside a <Suspense> boundary when cacheComponents is enabled,
  // otherwise Next treats it as "blocking" and fails the build.
  const userAgent = (await headers()).get("user-agent") ?? "unknown";

  const serverRenderedAt = new Date().toISOString();
  const tagged = await getTaggedRandom();
  const timed = await getTimedRandom();

  return (
    <>
      <section className="rounded-lg border border-black/10 bg-white/70 p-4 text-sm dark:border-white/15 dark:bg-zinc-950/40">
        <div className="font-semibold">Server render (dynamic hole)</div>
        <div className="mt-2 text-zinc-700 dark:text-zinc-300">
          <div>
            <span className="font-medium">serverRenderedAt:</span>{" "}
            {serverRenderedAt}
          </div>
          <div className="mt-1">
            <span className="font-medium">userAgent (first 24):</span>{" "}
            {userAgent.slice(0, 24)}
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-black/10 bg-white/70 p-4 text-sm dark:border-white/15 dark:bg-zinc-950/40">
        <div className="font-semibold">
          A) Tagged random (manual invalidation)
        </div>
        <div className="mt-2 text-zinc-700 dark:text-zinc-300">
          <div>
            <span className="font-medium">value:</span> {tagged.value}
          </div>
          <div>
            <span className="font-medium">generatedAt:</span>{" "}
            {tagged.generatedAt}
          </div>
          <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            Expected: stays stable across refreshes until you click{" "}
            <span className="font-medium">Invalidate/Update</span> for
            <span className="font-medium"> swr-random</span>.
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-black/10 bg-white/70 p-4 text-sm dark:border-white/15 dark:bg-zinc-950/40">
        <div className="font-semibold">
          B) Timed random (10s revalidate + tag)
        </div>
        <div className="mt-2 text-zinc-700 dark:text-zinc-300">
          <div>
            <span className="font-medium">value:</span> {timed.value}
          </div>
          <div>
            <span className="font-medium">generatedAt:</span>{" "}
            {timed.generatedAt}
          </div>
          <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            Expected: within 10s it stays stable. After it expires, the first
            request after expiry may still show the old value while a
            revalidation happens; a subsequent refresh should show the new
            value.
          </div>
        </div>
      </section>
    </>
  );
}
