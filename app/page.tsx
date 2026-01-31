export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <div className="rounded-xl border border-black/10 bg-white/70 p-6 backdrop-blur dark:border-white/15 dark:bg-zinc-950/50">
        <h1 className="text-2xl font-semibold tracking-tight">
          Next System Lab
        </h1>
        <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
          An experiment lab to verify App Router rendering + caching behaviors.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a
            className="cursor-pointer rounded-md border border-black/10 bg-white px-4 py-2 text-sm hover:bg-black/3 dark:border-white/15 dark:bg-zinc-950 dark:hover:bg-white/6"
            href="/tests"
          >
            Experiments
          </a>
          <a
            className="cursor-pointer rounded-md border border-black/10 bg-white px-4 py-2 text-sm hover:bg-black/3 dark:border-white/15 dark:bg-zinc-950 dark:hover:bg-white/6"
            href="/build"
          >
            Build matrix
          </a>
        </div>
      </div>
    </div>
  );
}
