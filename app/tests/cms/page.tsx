export default function CmsIndex() {
	return (
		<main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-6 py-10">
			<h1 className="text-xl font-semibold tracking-tight">D) CMS changes: SSR vs ISR vs PPR-style</h1>

			<p className="text-sm text-zinc-700 dark:text-zinc-300">
				These are tiny examples of how you might choose a rendering strategy when content changes over time.
			</p>

			<div className="flex flex-col gap-2 text-sm">
				<a className="underline" href="/tests/cms/ssr">
					SSR (always fresh)
				</a>
				<a className="underline" href="/tests/cms/isr">
					ISR (revalidate)
				</a>
				<a className="underline" href="/tests/cms/ppr-style">
					PPR-style (static shell + runtime section)
				</a>
			</div>

			<a className="text-sm underline" href="/tests">
				Back
			</a>
		</main>
	);
}
