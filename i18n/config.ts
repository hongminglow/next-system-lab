export const locales = ["en", "ms"] as const;

export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = "en";
export const localeCookieName = "locale";

export function isLocale(value: string | undefined | null): value is AppLocale {
  return locales.includes(value as AppLocale);
}

export async function getMessages(locale: AppLocale) {
  return (await import(`../locales/${locale}.json`)).default;
}
