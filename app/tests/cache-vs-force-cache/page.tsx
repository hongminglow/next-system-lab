import { cache } from "react";
import { getOrigin } from "../_lib/getOrigin";
import { Suspense } from "react";

async function fetchTime(origin: string, cacheMode: RequestCache) {
	const res = await fetch(`${origin}/api/time`, { cache: cacheMode });
	return (await res.json()) as { now: string; rand: string };
}

const reactCachedFetchNoStore = cache(async (origin: string) => {
	return fetchTime(origin, "no-store");
});

export default async function Page() {
	return (
		<main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-4 px-6 py-10">
			<h1 className="text-xl font-semibold tracking-tight">C) React cache() vs fetch force-cache</h1>
			<p className="text-sm text-zinc-700 dark:text-zinc-300">
				Look at which values match <span className="font-medium">within the same request</span>
				vs which stay stable <span className="font-medium">across refreshes</span> in production.
			</p>

			<Suspense fallback={<div className="text-sm">Loading…</div>}>
				<RequestContent />
			</Suspense>

			<a className="text-sm underline" href="/tests">
				Back
			</a>
		</main>
	);
}

async function RequestContent() {
	const origin = await getOrigin();

	const noStoreA = await fetchTime(origin, "no-store");
	const noStoreB = await fetchTime(origin, "no-store");

	const forceCacheA = await fetchTime(origin, "force-cache");
	const forceCacheB = await fetchTime(origin, "force-cache");

	const reactCacheA = await reactCachedFetchNoStore(origin);
	const reactCacheB = await reactCachedFetchNoStore(origin);

	return (
		<>
			<div className="rounded-md border border-black/10 p-4 text-sm dark:border-white/15">
				<div className="font-semibold">no-store (two separate fetch calls)</div>
				<div className="mt-2">
					A: {noStoreA.now} (rand {noStoreA.rand})
				</div>
				<div>
					B: {noStoreB.now} (rand {noStoreB.rand})
				</div>
			</div>

			<div className="rounded-md border border-black/10 p-4 text-sm dark:border-white/15">
				<div className="font-semibold">force-cache (two separate fetch calls)</div>
				<div className="mt-2">
					A: {forceCacheA.now} (rand {forceCacheA.rand})
				</div>
				<div>
					B: {forceCacheB.now} (rand {forceCacheB.rand})
				</div>
			</div>

			<div className="rounded-md border border-black/10 p-4 text-sm dark:border-white/15">
				<div className="font-semibold">React cache() wrapping a no-store fetch</div>
				<div className="mt-2">
					A: {reactCacheA.now} (rand {reactCacheA.rand})
				</div>
				<div>
					B: {reactCacheB.now} (rand {reactCacheB.rand})
				</div>
			</div>
		</>
	);
}
