export default async function Page() {
	"use cache";

	const cachedAt = new Date().toISOString();
	const uncachedAt = new Date().toISOString();

	return (
		<main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-4 px-6 py-10">
			<h1 className="text-xl font-semibold tracking-tight">B1) page-level use cache</h1>
			<p className="text-sm text-zinc-700 dark:text-zinc-300">
				Refresh a few times in <span className="font-medium">production</span>: both timestamps should stay stable
				because the whole page is cached.
			</p>

			<div className="rounded-md border border-black/10 p-4 text-sm dark:border-white/15">
				<div>
					<span className="font-medium">cachedAt:</span> {cachedAt}
				</div>
				<div>
					<span className="font-medium">(also computed) uncachedAt:</span> {uncachedAt}
				</div>
			</div>

			<a className="text-sm underline" href="/tests/use-cache">
				Back
			</a>
		</main>
	);
}
