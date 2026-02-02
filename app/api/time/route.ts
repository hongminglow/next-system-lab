function sleep(ms: number) {
	return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export async function GET(request: Request) {
	const url = new URL(request.url);
	const ms = Math.max(0, Number(url.searchParams.get("ms") ?? "0") || 0);
	const label = url.searchParams.get("label") ?? "";
	const req = url.searchParams.get("req") ?? "";

	const startedAt = Date.now();
	if (ms) await sleep(ms);
	const tookMs = Date.now() - startedAt;

	// Helpful when you want to confirm request ordering in the server logs.
	if (label || req || ms) {
		console.log(`[api/time] label=${label} req=${req} ms=${ms} tookMs=${tookMs}`);
	}

	return Response.json(
		{
			now: new Date().toISOString(),
			rand: Math.random().toString(16).slice(2),
			label,
			req,
			ms,
			tookMs,
		},
		{
			headers: {
				"server-timing": `sleep;dur=${tookMs}`,
			},
		},
	);
}
