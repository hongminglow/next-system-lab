import { ServerProbe } from "../../../probes/ServerProbe";
import { headers } from "next/headers";
import { Suspense } from "react";

async function RequestContent() {
	await headers();
	const serverRenderedAt = new Date().toISOString();
	return <ServerProbe label="A/SSR (no explicit caching)" serverRenderedAt={serverRenderedAt} />;
}

export default function Page() {
	return (
		<Suspense fallback={<div className="p-6 text-sm">Loading dynamic content…</div>}>
			<RequestContent />
		</Suspense>
	);
}
