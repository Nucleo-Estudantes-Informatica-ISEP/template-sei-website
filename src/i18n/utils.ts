import en from "./en.json";
import pt from "./pt.json";

export const languages = ["pt", "en"] as const;
export type Lang = (typeof languages)[number];
export type TranslationKey = keyof typeof pt;

// Language endonyms — always shown in their own language, never translated
// per the current page's locale.
export const langLabels: Record<Lang, string> = {
  en: "English",
  pt: "Português",
};

const defaultLang: Lang = "pt";
const translations: Record<Lang, Record<TranslationKey, string>> = { en, pt };

function isLang(value: string | undefined): value is Lang {
  return languages.includes(value as Lang);
}

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split("/");
  return isLang(lang) ? lang : defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: TranslationKey) {
    return translations[lang][key];
  };
}
