export default function Home() {
	return (
		<main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-6 py-10">
			<h1 className="text-2xl font-semibold tracking-tight">Next Server vs Client rendering probe</h1>

			<p className="text-sm text-zinc-700 dark:text-zinc-300">
				Open these pages, then watch terminal logs (server) + browser console (client).
			</p>

			<div className="flex gap-3">
				<a
					className="rounded-md border border-black/10 bg-white px-4 py-2 text-sm hover:bg-black/3 dark:border-white/15 dark:bg-zinc-950 dark:hover:bg-white/6"
					href="/ssg"
				>
					/ssg (force-static)
				</a>
				<a
					className="rounded-md border border-black/10 bg-white px-4 py-2 text-sm hover:bg-black/3 dark:border-white/15 dark:bg-zinc-950 dark:hover:bg-white/6"
					href="/ssr"
				>
					/ssr (force-dynamic)
				</a>
			</div>

			<p className="text-xs text-zinc-600 dark:text-zinc-400">
				Files: app/probes/ServerProbe.tsx + app/probes/ClientProbe.tsx
			</p>
		</main>
	);
}
