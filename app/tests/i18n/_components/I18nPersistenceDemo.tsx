"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import * as React from "react";

import { IconMinus, IconPlus } from "@/app/_components/icons";
import {
	defaultLocale,
	isLocale,
	locales,
	type AppLocale,
} from "@/i18n/config";

import { switchLocaleAction } from "../actions";

export function I18nPersistenceDemo() {
	const t = useTranslations("I18nDemo");
	const localeValue = useLocale();
	const locale = isLocale(localeValue) ? localeValue : defaultLocale;
	const router = useRouter();
	const [isPending, startTransition] = React.useTransition();
	const [count, setCount] = React.useState(2);
	const [draft, setDraft] = React.useState(
		"State lives here. Try switching to the other language.",
	);
	const [mountedAt] = React.useState(() =>
		new Date().toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		}),
	);

	function handleLocaleChange(nextLocale: AppLocale) {
		if (nextLocale === locale) return;

		startTransition(() => {
			void (async () => {
				await switchLocaleAction(nextLocale);
				router.refresh();
			})();
		});
	}

	return (
		<section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
			<div className="rounded-2xl border border-black/10 bg-white/70 p-6 backdrop-blur dark:border-white/15 dark:bg-zinc-950/50">
				<div className="flex items-start justify-between gap-3">
					<div>
						<h2 className="text-lg font-semibold tracking-tight">
							{t("switcherTitle")}
						</h2>
						<p className="mt-2 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
							{t("switcherDescription")}
						</p>
					</div>
					{isPending ? (
						<span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
							{t("pending")}
						</span>
					) : null}
				</div>

				<div className="mt-5 flex flex-wrap gap-3">
					{locales.map((candidate) => {
						const active = candidate === locale;
						return (
							<button
								key={candidate}
								type="button"
								onClick={() => handleLocaleChange(candidate)}
								disabled={isPending || active}
								className={[
									"rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
									active
										? "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200"
										: "border-black/10 bg-white hover:bg-black/3 dark:border-white/15 dark:bg-zinc-950 dark:hover:bg-white/6",
									isPending || active ? "cursor-default opacity-70" : "",
								].join(" ")}
							>
								{active
									? t("localeName", { locale: candidate })
									: t("switchTo", {
											locale: t("localeName", { locale: candidate }),
										})}
							</button>
						);
					})}
				</div>
			</div>

			<div className="rounded-2xl border border-black/10 bg-white/70 p-6 backdrop-blur dark:border-white/15 dark:bg-zinc-950/50">
				<h2 className="text-lg font-semibold tracking-tight">
					{t("persistenceTitle")}
				</h2>
				<p className="mt-2 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
					{t("persistenceHint")}
				</p>

				<div className="mt-5 grid gap-4 sm:grid-cols-2">
					<div className="rounded-xl border border-black/10 bg-black/[0.025] p-4 dark:border-white/10 dark:bg-white/[0.03]">
						<div className="text-xs uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
							{t("counterLabel")}
						</div>
						<div className="mt-3 text-3xl font-semibold tracking-tight">
							{count}
						</div>
						<div className="mt-4 flex items-center gap-2">
							<button
								type="button"
								onClick={() => setCount((value) => value - 1)}
								aria-label={t("decrement")}
								title={t("decrement")}
								className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-black/10 text-sm hover:bg-black/3 dark:border-white/15 dark:hover:bg-white/6"
							>
								<IconMinus title="" className="h-4 w-4" />
								<span className="sr-only">{t("decrement")}</span>
							</button>
							<button
								type="button"
								onClick={() => setCount((value) => value + 1)}
								aria-label={t("increment")}
								title={t("increment")}
								className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-black/10 text-sm hover:bg-black/3 dark:border-white/15 dark:hover:bg-white/6"
							>
								<IconPlus title="" className="h-4 w-4" />
								<span className="sr-only">{t("increment")}</span>
							</button>
						</div>
					</div>

					<div className="rounded-xl border border-black/10 bg-black/[0.025] p-4 dark:border-white/10 dark:bg-white/[0.03]">
						<div className="text-xs uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
							{t("mountedAt")}
						</div>
						<div className="mt-3 text-xl font-semibold tracking-tight">
							{mountedAt}
						</div>
						<p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
							{t("mountedHint")}
						</p>
					</div>
				</div>

				<label className="mt-5 block text-sm font-medium text-zinc-900 dark:text-zinc-100">
					{t("draftLabel")}
				</label>
				<textarea
					value={draft}
					onChange={(event) => setDraft(event.target.value)}
					rows={4}
					placeholder={t("draftPlaceholder")}
					className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/15 dark:bg-zinc-950"
				/>

				<div className="mt-4 flex flex-wrap items-center gap-3">
					<button
						type="button"
						onClick={() => {
							setCount(0);
							setDraft("");
						}}
						className="rounded-md border border-black/10 px-3 py-2 text-sm hover:bg-black/3 dark:border-white/15 dark:hover:bg-white/6"
					>
						{t("reset")}
					</button>
					<span className="text-xs text-zinc-500 dark:text-zinc-400">
						{t("currentLocale")}: {t("localeName", { locale })}
					</span>
				</div>
			</div>
		</section>
	);
}
