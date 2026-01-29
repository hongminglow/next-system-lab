"use client";

import { useEffect, useRef, useState } from "react";

export function ClientProbe({ serverRenderedAt }: { serverRenderedAt: string }) {
	console.log("[ClientProbe] render. hasWindow=", typeof window !== "undefined");

	const [count, setCount] = useState(0);
	const hydratedTextRef = useRef<HTMLSpanElement | null>(null);

	useEffect(() => {
		if (hydratedTextRef.current) hydratedTextRef.current.textContent = "true";
		console.log("[ClientProbe] useEffect (hydrated). hasWindow=", typeof window !== "undefined");
	}, []);

	return (
		<section className="rounded-lg border border-black/10 bg-white p-4 dark:border-white/15 dark:bg-zinc-950">
			<div className="text-sm font-semibold">Client Component</div>
			<div className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
				<div>
					<span className="font-medium">serverRenderedAt prop:</span> {serverRenderedAt}
				</div>
				<div>
					<span className="font-medium">hydration effect ran:</span> <span ref={hydratedTextRef}>false</span>
				</div>
				<div className="mt-3 flex items-center gap-3">
					<button
						className="rounded-md border border-black/10 px-3 py-1 text-sm hover:bg-black/3 dark:border-white/15 dark:hover:bg-white/6"
						onClick={() => setCount((c) => c + 1)}
						type="button"
					>
						increment
					</button>
					<span className="text-sm">
						<span className="font-medium">count:</span> {count}
					</span>
				</div>
			</div>
		</section>
	);
}
