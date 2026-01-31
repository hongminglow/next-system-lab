import { Suspense } from "react";

import { CaseHeader } from "../_components/CaseHeader";
import { ClientMarker } from "../_components/ClientMarker";
import { ServerFetch } from "../_components/ServerFetch";

export default async function Page() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <CaseHeader
        caseId="D"
        title="Dynamic due to server fetch (no-store)"
        summary="fetch({ cache: 'no-store' }) bubbles up and makes the route dynamic (not eligible for full-route static caching)."
      />

      <Suspense
        fallback={
          <div className="rounded-lg border border-black/10 bg-white/70 p-4 text-sm dark:border-white/15 dark:bg-zinc-950/40">
            Loading…
          </div>
        }
      >
        <ServerFetch label="D) fetch(no-store)" mode="no-store" />
      </Suspense>
      <ClientMarker label="D) client component present" />
    </div>
  );
}
