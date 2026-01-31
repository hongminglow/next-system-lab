import { readFile } from "node:fs/promises";
import path from "node:path";

import { Suspense } from "react";

import { CaseHeader } from "../_components/CaseHeader";

async function GuideContent() {
  const mdPath = path.join(process.cwd(), "app", "build", "BUILD_TESTS.md");
  try {
    return await readFile(mdPath, "utf8");
  } catch {
    return "(Could not read app/build/BUILD_TESTS.md)";
  }
}

export default function Page() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <CaseHeader
        caseId="Guide"
        title="/build guide"
        summary="This page renders the repo Markdown guide from app/build/BUILD_TESTS.md so you can read it in-browser while testing."
      />

      <Suspense
        fallback={
          <section className="rounded-xl border border-black/10 bg-white/70 p-4 text-sm dark:border-white/15 dark:bg-zinc-950/40">
            Loading guide…
          </section>
        }
      >
        <section className="rounded-xl border border-black/10 bg-white/70 p-4 text-sm dark:border-white/15 dark:bg-zinc-950/40">
          <pre className="whitespace-pre-wrap break-words font-mono text-[12px] leading-relaxed text-zinc-800 dark:text-zinc-200">
            <GuideContent />
          </pre>
        </section>
      </Suspense>
    </div>
  );
}
