import { LunarDate } from "../types/calendar";
import { LanguageName } from "../types/language";
import { stringifyChineseNumerical } from "./Chinese";
import { Constants } from "./constants";

/**
 *
 * @param lunarDate Lunar date
 * @param showMonthSize Whether to show the month size
 * @param language Language
 * @returns String representation of the Lunar date
 */
export function stringifyLunarDate(
  lunarDate: LunarDate,
  showMonthSize: boolean,
  language: LanguageName | null
): string | null {
  switch (language) {
    case "vi":
      return stringifyLunarDateInVietnamese(lunarDate, showMonthSize);

    case "zh":
      return stringifyLunarDateInChinese(lunarDate, showMonthSize);

    case "en":
    // fall through

    default:
      return stringifyLunarDateInModernNotation(lunarDate, showMonthSize);
  }
}

/**
 *
 * @param lunarDate Lunar date
 * @param showMonthSize Whether to show the month size
 * @returns String representation of the Lunar date in Chinese
 */
export function stringifyLunarDateInChinese(
  lunarDate: LunarDate,
  showMonthSize: boolean
): string {
  const year =
    getLunarYearStem(lunarDate.year, "zh") +
    getLunarYearBranch(lunarDate.year, "zh") +
    "年";
  let month = stringifyChineseNumerical(lunarDate.month);
  if (month === "一") {
    month = "正";
  }
  month += "月";
  const leap = lunarDate.leap ? "閏" : "";
  const monthSize = showMonthSize
    ? lunarDate.monthSize === 29
      ? "（小）"
      : "（大）"
    : "";
  let day = stringifyChineseNumerical(lunarDate.day) + "日";
  if (lunarDate.day < 11) {
    day = "初" + day;
  }
  return year + month + monthSize + day;
}

/**
 *
 * @param lunarDate Lunar date
 * @param showMonthSize Whether to show the month size
 * @returns String representation of the Lunar date in Vietnamese
 */
export function stringifyLunarDateInVietnamese(
  lunarDate: LunarDate,
  showMonthSize: boolean
): string {
  return (
    "ngày " +
    lunarDate.day.toString() +
    " tháng " +
    lunarDate.month.toString() +
    (lunarDate.leap ? " nhuận" : "") +
    (showMonthSize ? (lunarDate.monthSize === 30 ? " (lớn)" : " (nhỏ)") : "") +
    " năm " +
    getLunarYearStem(lunarDate.year, "vi") +
    " " +
    getLunarYearBranch(lunarDate.year, "vi")
  );
}

/**
 *
 * @param lunarDate Lunar date
 * @param showMonthSize Whether to show the month size
 * @returns String representation of the Lunar date in so-called
 * "modern notation."
 */
export function stringifyLunarDateInModernNotation(
  lunarDate: LunarDate,
  showMonthSize: boolean
): string {
  const month = lunarDate.month.toString();
  const day = lunarDate.day.toString();
  return (
    lunarDate.year.toString() +
    "." +
    ("0".repeat(Math.max(0, 2 - month.length)) + month) +
    (showMonthSize ? (lunarDate.monthSize === 30 ? "b" : "s") : "") +
    (lunarDate.leap ? "+" : "") +
    "." +
    ("0".repeat(Math.max(0, 2 - day.length)) + day)
  );
}

/**
 *
 * @param year Lunar year
 * @param language Language
 * @returns String representation of the Lunar year's "branch"
 */
export function getLunarYearBranch(
  year: number,
  language: LanguageName
): string {
  let branch = year % 12;
  if (branch < 0) {
    branch += 12;
  }
  switch (language) {
    case "en":
      return Constants.ENGLISH.branches[branch];

    case "vi":
      return Constants.VIETNAMESE.branches[branch];

    case "zh":
    // fall through

    default:
      return Constants.CHINESE.branches[branch];
  }
}

/**
 *
 * @param year Lunar year
 * @param language Language
 * @returns String representation of the Lunar year's "stem"
 */
export function getLunarYearStem(year: number, language: LanguageName): string {
  let stem = year % 10;
  if (stem < 0) {
    stem += 10;
  }
  switch (language) {
    case "en":
      return Constants.ENGLISH.stems[stem];

    case "vi":
      return Constants.VIETNAMESE.stems[stem];

    case "zh":
    // fall through

    default:
      return Constants.CHINESE.stems[stem];
  }
}
