import { CaseHeader } from "../_components/CaseHeader";
import { ClientMarker } from "../_components/ClientMarker";

/**
 * NOTE (Next 16 + cacheComponents)
 * When `next.config.ts` has `cacheComponents: true`, Next currently rejects the route segment config:
 *   export const dynamic = 'force-static'
 *
 * To test the `dynamic` segment config behavior:
 * 1) Temporarily set `cacheComponents: false` in next.config.ts
 * 2) Uncomment the export below
 * 3) `npm run build`
 */

// export const dynamic = "force-static";

export default async function Page() {
  "use cache";
  const builtAt = new Date().toISOString();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <CaseHeader
        caseId="F"
        title="Static baseline (+ client component)"
        summary="Safe static baseline with a client component. Use the toggle instructions at the top of this file to test `export const dynamic = 'force-static'` when cacheComponents is disabled."
      />

      <section className="rounded-lg border border-black/10 bg-white/70 p-4 text-sm dark:border-white/15 dark:bg-zinc-950/40">
        <div className="font-semibold">Server render</div>
        <div className="mt-2 text-zinc-700 dark:text-zinc-300">
          <div>
            <span className="font-medium">builtAt:</span> {builtAt}
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            If this is static, builtAt stays constant until rebuild.
          </div>
        </div>
      </section>

      <ClientMarker label="F) client component present" />
    </div>
  );
}
