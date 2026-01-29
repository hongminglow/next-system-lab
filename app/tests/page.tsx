export default function TestsIndex() {
	return (
		<main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-6 py-10">
			<h1 className="text-2xl font-semibold tracking-tight">Next.js experiments</h1>
			<p className="text-sm text-zinc-700 dark:text-zinc-300">
				Each route is a tiny, isolated test you can revisit later.
			</p>

			<div className="flex flex-col gap-3 text-sm">
				<a className="underline" href="/tests/rendering">
					A) Server vs Client rendering
				</a>
				<a className="underline" href="/tests/use-cache">
					B) use cache (page vs component)
				</a>
				<a className="underline" href="/tests/cache-vs-force-cache">
					C) React cache() vs fetch force-cache
				</a>
				<a className="underline" href="/tests/cms">
					D) CMS changes: SSR vs ISR vs PPR-style
				</a>
			</div>
		</main>
	);
}
