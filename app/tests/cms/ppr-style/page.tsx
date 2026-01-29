import { getOrigin } from "../../_lib/getOrigin";
import { Suspense } from "react";

async function RuntimeSection() {
	const origin = await getOrigin();
	const res = await fetch(`${origin}/api/time`, { cache: "no-store" });
	const data = (await res.json()) as { now: string; rand: string };

	return (
		<section className="rounded-md border border-black/10 p-4 text-sm dark:border-white/15">
			<div className="font-semibold">Runtime section (excluded from pre-render)</div>
			<div className="mt-2">
				<span className="font-medium">now:</span> {data.now} (rand {data.rand})
			</div>
		</section>
	);
}

async function CachedSection() {
	"use cache";
	const cachedAt = new Date().toISOString();

	return (
		<section className="rounded-md border border-black/10 p-4 text-sm dark:border-white/15">
			<div className="font-semibold">Cached section (use cache)</div>
			<div className="mt-2">
				<span className="font-medium">cachedAt:</span> {cachedAt}
			</div>
		</section>
	);
}

export default function Page() {
	return (
		<main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-4 px-6 py-10">
			<h1 className="text-xl font-semibold tracking-tight">D3) PPR-style page</h1>
			<p className="text-sm text-zinc-700 dark:text-zinc-300">
				With <span className="font-mono">cacheComponents: true</span>, dynamic data fetches are kept out of pre-rendered
				output by default (static shell + runtime section). You can opt-in caching for specific parts via{" "}
				<span className="font-mono">'use cache'</span>.
			</p>

			<section className="rounded-md border border-black/10 p-4 text-sm dark:border-white/15">
				<div className="font-semibold">Static shell</div>
				<div className="mt-2">This text is safe to pre-render.</div>
			</section>

			<Suspense fallback={<div className="text-sm">Loading…</div>}>
				<RuntimeSection />
			</Suspense>
			<CachedSection />

			<a className="text-sm underline" href="/tests/cms">
				Back
			</a>
		</main>
	);
}
