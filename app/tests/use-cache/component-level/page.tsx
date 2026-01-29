import { headers } from "next/headers";
import { Suspense } from "react";

async function CachedChunk() {
	"use cache";
	const cachedAt = new Date().toISOString();
	return (
		<section className="rounded-md border border-black/10 p-4 text-sm dark:border-white/15">
			<div className="font-semibold">Cached chunk</div>
			<div className="mt-2">
				<span className="font-medium">cachedAt:</span> {cachedAt}
			</div>
		</section>
	);
}

function UncachedChunk({ uncachedAt }: { uncachedAt: string }) {
	return (
		<section className="rounded-md border border-black/10 p-4 text-sm dark:border-white/15">
			<div className="font-semibold">Uncached chunk</div>
			<div className="mt-2">
				<span className="font-medium">uncachedAt:</span> {uncachedAt}
			</div>
		</section>
	);
}

async function RequestContent() {
	await headers();
	const uncachedAt = new Date().toISOString();
	return (
		<>
			<UncachedChunk uncachedAt={uncachedAt} />
			<CachedChunk />
		</>
	);
}

export default function Page() {
	return (
		<main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-4 px-6 py-10">
			<h1 className="text-xl font-semibold tracking-tight">B2) component-level use cache</h1>
			<p className="text-sm text-zinc-700 dark:text-zinc-300">
				Refresh in <span className="font-medium">production</span>: Uncached chunk changes every request, cached chunk
				stays stable.
			</p>

			<Suspense fallback={<div className="text-sm">Loading…</div>}>
				<RequestContent />
			</Suspense>

			<a className="text-sm underline" href="/tests/use-cache">
				Back
			</a>
		</main>
	);
}
