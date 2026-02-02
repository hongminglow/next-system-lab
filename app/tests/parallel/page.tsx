export default function Page() {
	return (
		<section className="rounded-lg border border-black/10 bg-white/70 p-4 text-sm dark:border-white/15 dark:bg-zinc-950/40">
			<div className="font-semibold">Main segment (children)</div>
			<div className="mt-2 text-zinc-700 dark:text-zinc-300">
				This is the normal <span className="font-mono">page.tsx</span> for{" "}
				<span className="font-mono">/tests/parallel</span>. The two panels next to it are rendered via{" "}
				<span className="font-mono">@left</span> and <span className="font-mono">@right</span> parallel routes.
			</div>
		</section>
	);
}
