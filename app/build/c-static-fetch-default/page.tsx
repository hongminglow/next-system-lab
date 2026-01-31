import { Suspense } from "react";

import { CaseHeader } from "../_components/CaseHeader";
import { ServerFetch } from "../_components/ServerFetch";

export default async function Page() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <CaseHeader
        caseId="C"
        title="Static + server fetch (default cache)"
        summary="A server-side fetch with default caching is usually compatible with static rendering. This is a baseline for 'default' fetch behavior."
      />

      <Suspense
        fallback={
          <div className="rounded-lg border border-black/10 bg-white/70 p-4 text-sm dark:border-white/15 dark:bg-zinc-950/40">
            Loading…
          </div>
        }
      >
        <ServerFetch label="C) fetch(default)" mode="default" />
      </Suspense>
    </div>
  );
}
