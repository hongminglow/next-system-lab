import { Suspense } from "react";

import { getOrigin } from "../../tests/_lib/getOrigin";
import { CaseHeader } from "../_components/CaseHeader";
import { ClientMarker } from "../_components/ClientMarker";
import { ServerFetch } from "../_components/ServerFetch";

async function RuntimeNoStore() {
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

async function CachedForceCache() {
  "use cache";
  return (
    <ServerFetch
      label="I) fetch(force-cache) inside 'use cache'"
      mode="force-cache"
    />
  );
}

export default function Page() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <CaseHeader
        caseId="I"
        title="PPR-style: cached chunk + runtime chunk"
        summary="This puts a force-cache fetch behind a 'use cache' directive (cached chunk), and a no-store fetch under Suspense (runtime chunk)."
      />

      <section className="rounded-lg border border-black/10 bg-white/70 p-4 text-sm dark:border-white/15 dark:bg-zinc-950/40">
        <div className="font-semibold">Static shell</div>
        <div className="mt-2 text-zinc-700 dark:text-zinc-300">
          The route can still ship a static shell.
        </div>
      </section>

      <Suspense
        fallback={
          <div className="rounded-lg border border-black/10 bg-white/70 p-4 text-sm dark:border-white/15 dark:bg-zinc-950/40">
            Loading runtime chunk…
          </div>
        }
      >
        <RuntimeNoStore />
      </Suspense>

      <CachedForceCache />
      <ClientMarker label="I) client component present" />
    </div>
  );
}
