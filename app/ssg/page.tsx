import { ServerProbe } from "../probes/ServerProbe";

export const dynamic = "force-static";

export default function Page() {
	return <ServerProbe label="SSG (force-static)" />;
}
