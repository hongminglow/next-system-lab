import { CaseHeader } from "../_components/CaseHeader";

export default async function Page() {
  "use cache";
  const builtAt = new Date().toISOString();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <CaseHeader
        caseId="A"
        title="Static (basic)"
        summary="No fetch, no request-bound APIs, no client components. This should be a clean baseline for a fully static route."
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
    </div>
  );
}
