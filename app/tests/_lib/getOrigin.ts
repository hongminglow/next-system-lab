import { headers } from "next/headers";

export async function getOrigin() {
	const h = await headers();
	const host = h.get("host");
	const proto = h.get("x-forwarded-proto") ?? "http";

	if (!host) return "http://localhost:3000";
	return `${proto}://${host}`;
}
