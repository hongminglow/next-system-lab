import { ServerProbe } from "../../../probes/ServerProbe";
import { cacheLife } from "next/cache";

export default async function Page() {
	"use cache";
	cacheLife("max");
	const serverRenderedAt = new Date().toISOString();

	return <ServerProbe label="A/SSG (cached via use cache)" serverRenderedAt={serverRenderedAt} />;
}
