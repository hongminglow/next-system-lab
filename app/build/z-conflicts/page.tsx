import { Suspense } from "react";

import { CaseHeader } from "../_components/CaseHeader";
import { ClientMarker } from "../_components/ClientMarker";
import { ServerFetch } from "../_components/ServerFetch";

/**
 * Z) Conflicts / toggles
 *
 * This file is intentionally "hands-on".
 * The guide (app/build/BUILD_TESTS.md) tells you which lines to toggle.
 */

// 1) Route-level override:
// Uncomment ONE of these to force a rendering strategy.
// export const dynamic = "force-static";
// export const dynamic = "force-dynamic";

// 2) Fetch cache policy:
// - "default" and "force-cache" are usually compatible with static output.
// - "no-store" forces runtime rendering (dynamic signal).
const FETCH_MODE: "default" | "force-cache" | "no-store" = "default";

// 3) Suspense boundary (for PPR-style behavior when cacheComponents is enabled)
const WRAP_IN_SUSPENSE = true;

async function FetchChunk() {
  return <ServerFetch label={`Z) fetch(${FETCH_MODE})`} mode={FETCH_MODE} />;
}

export default function Page() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <CaseHeader
        caseId="Z"
        title="Conflicts and priority (toggle lines)"
        summary="Use this route to quickly test precedence: export const dynamic, fetch cache modes, and Suspense boundaries."
      />

      <section className="rounded-lg border border-black/10 bg-white/70 p-4 text-sm dark:border-white/15 dark:bg-zinc-950/40">
        <div className="font-semibold">Current toggles</div>
        <div className="mt-2 text-zinc-700 dark:text-zinc-300">
          <div>
            <span className="font-medium">FETCH_MODE:</span> {FETCH_MODE}
          </div>
          <div>
            <span className="font-medium">WRAP_IN_SUSPENSE:</span>{" "}
            {String(WRAP_IN_SUSPENSE)}
          </div>
        </div>
      </section>

      {WRAP_IN_SUSPENSE ? (
        <Suspense
          fallback={
            <div className="rounded-lg border border-black/10 bg-white/70 p-4 text-sm dark:border-white/15 dark:bg-zinc-950/40">
              Loading…
            </div>
          }
        >
          <FetchChunk />
        </Suspense>
      ) : (
        <FetchChunk />
      )}

      <ClientMarker label="Z) client component present" />
    </div>
  );
}
