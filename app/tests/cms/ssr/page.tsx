import { headers } from "next/headers";
import { Suspense } from "react";

async function RequestContent() {
	await headers();
	const now = new Date().toISOString();

	return (
		<div className="rounded-md border border-black/10 p-4 text-sm dark:border-white/15">
			<span className="font-medium">now:</span> {now}
		</div>
	);
}

export default function Page() {
	return (
		<main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-4 px-6 py-10">
			<h1 className="text-xl font-semibold tracking-tight">D1) SSR</h1>
			<p className="text-sm text-zinc-700 dark:text-zinc-300">Every request re-runs the Server Component render.</p>

			<Suspense fallback={<div className="text-sm">Loading…</div>}>
				<RequestContent />
			</Suspense>

			<a className="text-sm underline" href="/tests/cms">
				Back
			</a>
		</main>
	);
}
