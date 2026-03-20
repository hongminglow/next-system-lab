"use server";

import { cookies } from "next/headers";

import {
	defaultLocale,
	isLocale,
	localeCookieName,
	type AppLocale,
} from "@/i18n/config";

export async function switchLocaleAction(nextLocale: AppLocale | string) {
	const locale = isLocale(nextLocale) ? nextLocale : defaultLocale;
	const store = await cookies();

	store.set(localeCookieName, locale, {
		path: "/",
		sameSite: "lax",
		maxAge: 60 * 60 * 24 * 365,
	});
}
