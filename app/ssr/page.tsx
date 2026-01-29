import { ServerProbe } from "../probes/ServerProbe";

export const dynamic = "force-dynamic";

export default function Page() {
	return <ServerProbe label="SSR (force-dynamic)" />;
}
