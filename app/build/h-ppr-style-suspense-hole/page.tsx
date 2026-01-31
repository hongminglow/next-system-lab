import { Suspense } from "react";

import { getOrigin } from "../../tests/_lib/getOrigin";
import { CaseHeader } from "../_components/CaseHeader";
import { ClientMarker } from "../_components/ClientMarker";

async function RuntimeSection() {
  const origin = await getOrigin();
  const res = await fetch(`${origin}/api/time`, { cache: "no-store" });
  const data = (await res.json()) as { now: string; rand: string };

  return (
    <section className="rounded-lg border border-black/10 bg-white/70 p-4 text-sm dark:border-white/15 dark:bg-zinc-950/40">
      <div className="font-semibold">Runtime section (no-store)</div>
      <div className="mt-2 text-zinc-700 dark:text-zinc-300">
        <div>
          <span className="font-medium">now:</span> {data.now}
        </div>
        <div>
          <span className="font-medium">rand:</span> {data.rand}
        </div>
      </div>
    </section>
  );
}

async function CachedSection() {
  "use cache";
  const cachedAt = new Date().toISOString();

  return (
    <section className="rounded-lg border border-black/10 bg-white/70 p-4 text-sm dark:border-white/15 dark:bg-zinc-950/40">
      <div className="font-semibold">Cached section (use cache)</div>
      <div className="mt-2 text-zinc-700 dark:text-zinc-300">
        <div>
          <span className="font-medium">cachedAt:</span> {cachedAt}
        </div>
        <div className="text-xs text-zinc-500 dark:text-zinc-400">
          In prod, this should stay stable across refreshes.
        </div>
      </div>
    </section>
  );
}

export default function Page() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <CaseHeader
        caseId="H"
        title="PPR-style: Static shell + Suspense runtime hole"
        summary="With cacheComponents enabled (see next.config.ts), dynamic signals under a Suspense boundary can be excluded from pre-rendered output (static shell + runtime section)."
      />

      <section className="rounded-lg border border-black/10 bg-white/70 p-4 text-sm dark:border-white/15 dark:bg-zinc-950/40">
        <div className="font-semibold">Static shell</div>
        <div className="mt-2 text-zinc-700 dark:text-zinc-300">
          This text should be safe to pre-render.
        </div>
      </section>

      <Suspense
        fallback={
          <div className="rounded-lg border border-black/10 bg-white/70 p-4 text-sm dark:border-white/15 dark:bg-zinc-950/40">
            Loading runtime section…
          </div>
        }
      >
        <RuntimeSection />
      </Suspense>

      <CachedSection />
      <ClientMarker label="H) client component present" />
    </div>
  );
}
