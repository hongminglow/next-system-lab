import { getOrigin } from "../../_lib/getOrigin";

type TimePayload = { now: string; rand: string; label?: string; ms?: number; tookMs?: number };

export default async function Page() {
	const origin = await getOrigin();
	const res = await fetch(`${origin}/api/time?ms=900&label=parallel-right`, { cache: "no-store" });
	const data = (await res.json()) as TimePayload;

	return (
		<section className="rounded-lg border border-black/10 bg-white/70 p-4 text-sm dark:border-white/15 dark:bg-zinc-950/40">
			<div className="font-semibold">Right slot (@right)</div>
			<div className="mt-2 text-zinc-700 dark:text-zinc-300">Does a delayed server fetch (900ms).</div>
			<pre className="mt-3 whitespace-pre-wrap wrap-break-word text-xs">{JSON.stringify(data, null, 2)}</pre>
		</section>
	);
}
