import Link from "next/link";

export function CaseHeader({
  caseId,
  title,
  summary,
}: {
  caseId: string;
  title: string;
  summary: string;
}) {
  return (
    <header className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {caseId}
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link className="text-sm underline" href="/build">
            Back to /build
          </Link>
        </div>
      </div>
      <p className="max-w-3xl text-sm text-zinc-700 dark:text-zinc-300">
        {summary}
      </p>
    </header>
  );
}
