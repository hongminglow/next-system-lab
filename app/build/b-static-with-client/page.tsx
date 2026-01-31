import { CaseHeader } from "../_components/CaseHeader";
import { ClientMarker } from "../_components/ClientMarker";

export default async function Page() {
  "use cache";
  const builtAt = new Date().toISOString();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <CaseHeader
        caseId="B"
        title="Static + at least one client component"
        summary="Client Components do NOT automatically make a route dynamic. This route should still be static (look at next build output), but it will ship client JS for ClientMarker."
      />

      <section className="rounded-lg border border-black/10 bg-white/70 p-4 text-sm dark:border-white/15 dark:bg-zinc-950/40">
        <div className="font-semibold">Server render</div>
        <div className="mt-2 text-zinc-700 dark:text-zinc-300">
          <div>
            <span className="font-medium">builtAt:</span> {builtAt}
          </div>
        </div>
      </section>

      <ClientMarker label="B) client component present" />
    </div>
  );
}
