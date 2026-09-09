import en from "./translations/en.json";
import fr from "./translations/fr.json";
import type { HomeAssistant } from "./types";

export type SupportedLanguage = "en" | "fr";

type TranslationMap = Record<string, string>;

const dictionaries: Record<SupportedLanguage, TranslationMap> = { en, fr };

export const detectLanguage = (hass?: HomeAssistant, configuredLanguage?: SupportedLanguage): SupportedLanguage => {
  if (configuredLanguage) return configuredLanguage;
  const locale = hass?.locale?.language?.toLowerCase();
  if (locale?.startsWith("fr")) return "fr";
  return "en";
};

export const localize = (key: string, language: SupportedLanguage): string =>
  dictionaries[language][key] || dictionaries.en[key] || key;
