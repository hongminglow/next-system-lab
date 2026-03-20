import { getLocale, getTranslations } from "next-intl/server";

import { defaultLocale, isLocale } from "@/i18n/config";

import { I18nPersistenceDemo } from "./_components/I18nPersistenceDemo";

export default async function I18nDemoPage() {
	const [localeValue, t] = await Promise.all([
		getLocale(),
		getTranslations("I18nDemo"),
	]);
	const locale = isLocale(localeValue) ? localeValue : defaultLocale;
	const serverRefreshedAt = new Intl.DateTimeFormat(locale, {
		dateStyle: "medium",
		timeStyle: "medium",
	}).format(new Date());

	return (
		<div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
			<section className="rounded-2xl border border-black/10 bg-white/70 p-6 backdrop-blur dark:border-white/15 dark:bg-zinc-950/50">
				<p className="text-xs font-medium uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
					{t("badge")}
				</p>
				<h1 className="mt-3 text-2xl font-semibold tracking-tight">
					{t("title")}
				</h1>
				<p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-700 dark:text-zinc-300">
					{t("description")}
				</p>

				<div className="mt-5 grid gap-3 md:grid-cols-2">
					<div className="rounded-xl border border-black/10 bg-black/[0.025] p-4 dark:border-white/10 dark:bg-white/[0.03]">
						<div className="text-xs uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
							{t("currentLocale")}
						</div>
						<div className="mt-2 text-lg font-semibold">
							{t("localeName", { locale })}
						</div>
					</div>

					<div className="rounded-xl border border-black/10 bg-black/[0.025] p-4 dark:border-white/10 dark:bg-white/[0.03]">
						<div className="text-xs uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
							{t("serverRefreshedAt")}
						</div>
						<div className="mt-2 text-lg font-semibold">{serverRefreshedAt}</div>
						<p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
							{t("serverRefreshedNote")}
						</p>
					</div>
				</div>
			</section>

			<I18nPersistenceDemo />

			<section className="rounded-2xl border border-dashed border-black/10 bg-white/50 p-6 text-sm leading-6 text-zinc-700 dark:border-white/15 dark:bg-zinc-950/30 dark:text-zinc-300">
				<h2 className="text-base font-semibold text-zinc-950 dark:text-white">
					{t("noteTitle")}
				</h2>
				<p className="mt-2">{t("noteBody")}</p>
			</section>
		</div>
	);
}
