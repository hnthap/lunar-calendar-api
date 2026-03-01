export const languageNames = ["en", "vi", "zh", "zh-cn"] as const;

export type LanguageName = (typeof languageNames)[number];

export const languageNameMeanings: Record<LanguageName, string> = {
  en: "English",
  vi: "Vietnamese (Tiếng Việt)",
  zh: "Chinese (Traditional) (繁體中文)",
  "zh-cn": "Chinese (Simplified) (简体中文)",
};

/**
 * 
 * @param language 
 * @returns Whether the language name is defined
 */
export function isLanguageName(language: unknown): language is LanguageName {
  return (
    typeof language === "string" &&
    languageNames.includes(language as LanguageName)
  );
}
