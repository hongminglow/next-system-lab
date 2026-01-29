import Link from "next/link";
import { ClientProbe } from "./ClientProbe";

export function ServerProbe({ label, serverRenderedAt }: { label: string; serverRenderedAt: string }) {
	console.log(`[ServerProbe] render label=${label} at=${serverRenderedAt} pid=${process.pid}`);

	return (
		<main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-4 px-6 py-10">
			<header className="flex items-center justify-between">
				<h1 className="text-xl font-semibold tracking-tight">{label}</h1>
				<Link className="text-sm underline" href="/">
					Home
				</Link>
			</header>

			<section className="rounded-lg border border-black/10 bg-white p-4 text-sm text-zinc-800 dark:border-white/15 dark:bg-zinc-950 dark:text-zinc-200">
				<div className="font-semibold">Server Component</div>
				<div className="mt-2">
					<div>
						<span className="font-medium">serverRenderedAt:</span> {serverRenderedAt}
					</div>
					<div>
						<span className="font-medium">process.pid:</span> {process.pid}
					</div>
					<div>
						<span className="font-medium">NEXT_RUNTIME:</span> {process.env.NEXT_RUNTIME ?? "(not set)"}
					</div>
				</div>
			</section>

			<ClientProbe serverRenderedAt={serverRenderedAt} />

			<p className="text-xs text-zinc-600 dark:text-zinc-400">Tip: open DevTools Console + Network and refresh.</p>
		</main>
	);
}
