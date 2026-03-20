import { Suspense } from "react";

import { NextIntlClientProvider } from "next-intl";

export default function I18nDemoLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<Suspense
			fallback={
				<section className="mx-auto w-full max-w-4xl rounded-2xl border border-black/10 bg-white/70 p-6 text-sm dark:border-white/15 dark:bg-zinc-950/50">
					Loading locale demo...
				</section>
			}
		>
			<NextIntlClientProvider>{children}</NextIntlClientProvider>
		</Suspense>
	);
}
