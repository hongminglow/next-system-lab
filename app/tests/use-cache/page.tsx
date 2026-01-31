export default function UseCacheIndex() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-6 py-10">
      <h1 className="text-xl font-semibold tracking-tight">B) use cache</h1>
      <p className="text-sm text-zinc-700 dark:text-zinc-300">
        With `cacheComponents: true` enabled, you can opt specific parts into
        caching using the{" "}
        <span className="font-mono">&apos;use cache&apos;</span> directive.
      </p>

      <div className="flex flex-col gap-2 text-sm">
        <a className="underline" href="/tests/use-cache/page-level">
          page-level caching
        </a>
        <a className="underline" href="/tests/use-cache/component-level">
          component-level caching
        </a>
      </div>

      <a className="text-sm underline" href="/tests">
        Back
      </a>
    </main>
  );
}
