import { Suspense } from "react";

import { CaseHeader } from "../_components/CaseHeader";
import { ClientMarker } from "../_components/ClientMarker";
import { ServerFetch } from "../_components/ServerFetch";

async function NoStoreChunk() {
  return (
    <ServerFetch label="G) fetch(no-store) inside <Suspense>" mode="no-store" />
  );
}

export default function Page() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <CaseHeader
        caseId="G"
        title="Suspense boundary + no-store fetch"
        summary="This checks what happens when the only dynamic signal lives under a Suspense boundary (without enabling PPR at the route)."
      />

      <Suspense
        fallback={
          <div className="rounded-lg border border-black/10 bg-white/70 p-4 text-sm dark:border-white/15 dark:bg-zinc-950/40">
            Loading…
          </div>
        }
      >
        {/* Dynamic signal is inside this subtree */}
        <NoStoreChunk />
      </Suspense>

      <ClientMarker label="G) client component present" />
    </div>
  );
}
