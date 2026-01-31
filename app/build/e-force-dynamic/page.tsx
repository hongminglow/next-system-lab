import { CaseHeader } from "../_components/CaseHeader";
import { ClientMarker } from "../_components/ClientMarker";

/**
 * NOTE (Next 16 + cacheComponents)
 * When `next.config.ts` has `cacheComponents: true`, Next currently rejects the route segment config:
 *   export const dynamic = 'force-dynamic'
 *
 * To test the `dynamic` segment config behavior:
 * 1) Temporarily set `cacheComponents: false` in next.config.ts
 * 2) Uncomment the export below
 * 3) `npm run build`
 */

// export const dynamic = "force-dynamic";

export default async function Page() {
  "use cache";
  const renderedAt = new Date().toISOString();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <CaseHeader
        caseId="E"
        title="Dynamic segment config (toggle)"
        summary="This case is a placeholder for testing `export const dynamic = 'force-dynamic'`. See the comment at the top of this file for the exact toggle steps."
      />

      <section className="rounded-lg border border-black/10 bg-white/70 p-4 text-sm dark:border-white/15 dark:bg-zinc-950/40">
        <div className="font-semibold">Server render</div>
        <div className="mt-2 text-zinc-700 dark:text-zinc-300">
          <div>
            <span className="font-medium">renderedAt:</span> {renderedAt}
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            In prod, this should change on refresh.
          </div>
        </div>
      </section>

      <ClientMarker label="E) client component present" />
    </div>
  );
}
