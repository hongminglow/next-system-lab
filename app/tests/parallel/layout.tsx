import { Suspense } from "react";

export default function Layout({
	children,
	left,
	right,
}: {
	children: React.ReactNode;
	left: React.ReactNode;
	right: React.ReactNode;
}) {
	return (
		<main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-6 py-10">
			<h1 className="text-xl font-semibold tracking-tight">F) Parallel routes (@slots)</h1>
			<p className="text-sm text-zinc-700 dark:text-zinc-300">
				Normal nested routes don&apos;t show multiple pages at once. To render multiple sibling trees in parallel under
				the same URL, Next uses <span className="font-mono">@slot</span> folders (Parallel Routes).
			</p>

			<div className="grid gap-4 lg:grid-cols-3">
				<div className="lg:col-span-1">{children}</div>

				<Suspense
					fallback={
						<div className="rounded-lg border border-black/10 p-4 text-sm dark:border-white/15">Loading left…</div>
					}
				>
					<div className="lg:col-span-1">{left}</div>
				</Suspense>

				<Suspense
					fallback={
						<div className="rounded-lg border border-black/10 p-4 text-sm dark:border-white/15">Loading right…</div>
					}
				>
					<div className="lg:col-span-1">{right}</div>
				</Suspense>
			</div>

			<a className="text-sm underline" href="/tests">
				Back
			</a>
		</main>
	);
}
