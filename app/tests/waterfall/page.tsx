import { getOrigin } from "../_lib/getOrigin";
import { Suspense } from "react";

type TimePayload = {
	now: string;
	rand: string;
	label?: string;
	ms?: number;
	tookMs?: number;
};

async function fetchTime(origin: string, label: string, ms: number) {
	const url = `${origin}/api/time?ms=${ms}&label=${encodeURIComponent(label)}`;
	const res = await fetch(url, { cache: "no-store" });
	const body = (await res.json()) as TimePayload;
	return {
		ok: res.ok,
		status: res.status,
		url,
		body,
	};
}

async function ChildAwait({ title, promise }: { title: string; promise: ReturnType<typeof fetchTime> }) {
	const data = await promise;
	return (
		<div className="rounded-md border border-black/10 p-4 text-sm dark:border-white/15">
			<div className="font-medium">{title}</div>
			<pre className="mt-2 whitespace-pre-wrap wrap-break-word text-xs">{JSON.stringify(data, null, 2)}</pre>
		</div>
	);
}

export default async function Page() {
	return (
		<main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 px-6 py-10">
			<h1 className="text-xl font-semibold tracking-tight">E) Waterfall vs parallel fetching</h1>
			<p className="text-sm text-zinc-700 dark:text-zinc-300">
				This route uses a delayed <span className="font-mono">/api/time?ms=800</span> and server logs to show ordering.
				Open your terminal logs while refreshing.
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
	const ms = 800;

	// Waterfall: parent awaits before the child request is even started.
	const parentWaterfall = await fetchTime(origin, "parent-waterfall", ms);
	const childWaterfallPromise = fetchTime(origin, "child-waterfall", ms);

	// Parallel: start both requests first, then await.
	const parentParallelPromise = fetchTime(origin, "parent-parallel", ms);
	const childParallelPromise = fetchTime(origin, "child-parallel", ms);
	const parentParallel = await parentParallelPromise;

	// // Promise.allSettled demo: start both immediately, then await their settled statuses.
	// const allSettledPromises = [fetchTime(origin, "allSettled-A", ms), fetchTime(origin, "allSettled-B", ms)] as const;
	// const settled = await Promise.allSettled(allSettledPromises);

	return (
		<>
			<section className="rounded-lg border border-black/10 bg-white/70 p-4 text-sm dark:border-white/15 dark:bg-zinc-950/40">
				<div className="font-semibold">Waterfall pattern</div>
				<div className="mt-2 text-zinc-700 dark:text-zinc-300">
					Parent awaits first, then child awaits → roughly <span className="font-medium">~{ms * 2}ms</span> total.
				</div>
				<div className="mt-3 grid gap-3">
					<div className="rounded-md border border-black/10 p-4 text-sm dark:border-white/15">
						<div className="font-medium">Parent (waterfall)</div>
						<pre className="mt-2 whitespace-pre-wrap wrap-break-word text-xs">
							{JSON.stringify(parentWaterfall, null, 2)}
						</pre>
					</div>
					<ChildAwait title="Child (waterfall)" promise={childWaterfallPromise} />
				</div>
			</section>

			<section className="rounded-lg border border-black/10 bg-white/70 p-4 text-sm dark:border-white/15 dark:bg-zinc-950/40">
				<div className="font-semibold">Avoiding waterfall (start requests early)</div>
				<div className="mt-2 text-zinc-700 dark:text-zinc-300">
					Start both fetches first, then await → roughly <span className="font-medium">~{ms}ms</span> total.
				</div>
				<div className="mt-3 grid gap-3">
					<div className="rounded-md border border-black/10 p-4 text-sm dark:border-white/15">
						<div className="font-medium">Parent (parallel)</div>
						<pre className="mt-2 whitespace-pre-wrap wrap-break-word text-xs">
							{JSON.stringify(parentParallel, null, 2)}
						</pre>
					</div>
					<ChildAwait title="Child (parallel)" promise={childParallelPromise} />
				</div>
			</section>
		</>
	);
}
