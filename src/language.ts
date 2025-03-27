const languageNames = [
  "en",
  "vi",
  "zh",
  "Chinese",
  "English",
  "Vietnamese",
] as const;

export type LanguageName = (typeof languageNames)[number];

export function isLanguageName(language: unknown): language is LanguageName {
  return (
    typeof language === "string" &&
    languageNames.includes(language as LanguageName)
  );
}
