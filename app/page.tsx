export default function Home() {
	return (
		<main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-6 py-10">
			<h1 className="text-2xl font-semibold tracking-tight">Next System Lab</h1>

			<p className="text-sm text-zinc-700 dark:text-zinc-300">
				A tiny app to test Next.js rendering + caching behaviors.
			</p>

			<a
				className="w-fit rounded-md border border-black/10 bg-white px-4 py-2 text-sm hover:bg-black/3 dark:border-white/15 dark:bg-zinc-950 dark:hover:bg-white/6"
				href="/tests"
			>
				Open experiments →
			</a>
		</main>
	);
}
