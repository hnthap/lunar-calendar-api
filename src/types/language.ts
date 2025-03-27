const languageNames = ["en", "vi", "zh"] as const;

export type LanguageName = (typeof languageNames)[number];

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
