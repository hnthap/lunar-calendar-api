import { GregorianDate, LunarDate } from "../types/calendar";
import { LanguageName } from "../types/language";

const CHINESE = {
  branches: [
    "申",
    "酉",
    "戌",
    "亥",
    "子",
    "丑",
    "寅",
    "卯",
    "辰",
    "巳",
    "午",
    "未",
  ],
  stems: ["庚", "辛", "壬", "癸", "甲", "乙", "丙", "丁", "戊", "己"],
};
const ENGLISH = {
  branches: [
    "Monkey",
    "Rooster",
    "Dog",
    "Pig",
    "Rat",
    "Ox",
    "Tiger",
    "Rabbit",
    "Dragon",
    "Snake",
    "Horse",
    "Goat",
  ],
  stems: [
    "Metal",
    "Metal",
    "Water",
    "Water",
    "Wood",
    "Wood",
    "Fire",
    "Fire",
    "Earth",
    "Earth",
  ],
};
const VIETNAMESE = {
  branches: [
    "Thân",
    "Dậu",
    "Tuất",
    "Hợi",
    "Tý",
    "Sửu",
    "Dần",
    "Mão",
    "Thìn",
    "Tỵ",
    "Ngọ",
    "Mùi",
  ],
  stems: [
    "Canh",
    "Tân",
    "Nhâm",
    "Quý",
    "Giáp",
    "Ất",
    "Bính",
    "Đinh",
    "Mậu",
    "Kỷ",
  ],
};

/**
 * 
 * @param date Gregorian date
 * @returns String representation of the Gregorian date in the modern
 * representation
 */
export function stringifyGregorian(date: GregorianDate): string {
  const month = date.month.toString();
  const day = date.day.toString();
  return (
    date.year.toString() +
    "." +
    ("0".repeat(Math.max(0, 2 - month.length)) + month) +
    "." +
    ("0".repeat(Math.max(0, 2 - day.length)) + day)
  );
}

/**
 *
 * @param lunarDate Lunar date
 * @param showMonthSize Whether to show the month size
 * @param language Language
 * @returns String representation of the Lunar date
 */
export function stringifyLunar(
  lunarDate: LunarDate,
  showMonthSize: boolean,
  language: LanguageName | null
): string | null {
  switch (language) {
    case "vi":
      return stringifyLunarInVietnamese(lunarDate, showMonthSize);

    case "zh":
      return stringifyLunarInChinese(lunarDate, showMonthSize);

    case "zh-cn":
      return stringifyLunarInChinese(lunarDate, showMonthSize, {
        traditional: false,
      });

    case "en":
    // fall through

    default:
      return stringifyLunarInModernNotation(lunarDate, showMonthSize);
  }
}

/**
 * 
 * @param value An integer from 1 to 30
 * @returns Chinese numerical value, that frequently used on calendar
 */
export function stringifyChineseNumerical(value: number): string {
  if (value == 20) {
    return "二十";
  } else {
    const tens = Math.floor(value / 10.0) * 10;
    const units = value - tens;
    return getChineseDigit(tens) + getChineseDigit(units);
  }
}

/**
 * 
 * @param value An integer from 1 to 10, or 20, or 30
 * @returns Corresponding Chinese numerical value
 */
export function getChineseDigit(value: number): string {
  switch (value) {
    case 1:
      return "一";
    case 2:
      return "二";
    case 3:
      return "三";
    case 4:
      return "四";
    case 5:
      return "五";
    case 6:
      return "六";
    case 7:
      return "七";
    case 8:
      return "八";
    case 9:
      return "九";
    case 10:
      return "十";
    case 20:
      return "廿";
    case 30:
      return "三十";
    default:
      return "";
  }
}

/**
 *
 * @param lunarDate Lunar date
 * @param showMonthSize Whether to show the month size
 * @returns String representation of the Lunar date in Chinese
 */
export function stringifyLunarInChinese(
  lunarDate: LunarDate,
  showMonthSize: boolean,
  options?: { traditional?: boolean }
): string {
  options = options || {};
  options.traditional = options.traditional ?? true;
  const year =
    getLunarYearStem(lunarDate.year, "zh") +
    getLunarYearBranch(lunarDate.year, "zh") +
    "年";
  let month = stringifyChineseNumerical(lunarDate.month);
  if (month === "一") {
    month = "正";
  }
  month += "月";
  const leap = lunarDate.leap ? (options.traditional ? "閏" : "闰") : "";
  const monthSize = showMonthSize
    ? lunarDate.monthSize === 29
      ? "（小）"
      : "（大）"
    : "";
  let day = stringifyChineseNumerical(lunarDate.day) + "日";
  if (lunarDate.day < 11) {
    day = "初" + day;
  }
  return year + leap + month + monthSize + day;
}

/**
 *
 * @param lunarDate Lunar date
 * @param showMonthSize Whether to show the month size
 * @returns String representation of the Lunar date in Vietnamese
 */
export function stringifyLunarInVietnamese(
  lunarDate: LunarDate,
  showMonthSize: boolean
): string {
  return (
    "ngày " +
    lunarDate.day.toString() +
    " tháng " +
    lunarDate.month.toString() +
    (lunarDate.leap ? " nhuận" : "") +
    (showMonthSize ? (lunarDate.monthSize === 30 ? " (đủ)" : " (thiếu)") : "") +
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
export function stringifyLunarInModernNotation(
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
      return ENGLISH.branches[branch];

    case "vi":
      return VIETNAMESE.branches[branch];

    case "zh":
    // fall through

    default:
      return CHINESE.branches[branch];
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
      return ENGLISH.stems[stem];

    case "vi":
      return VIETNAMESE.stems[stem];

    case "zh":
    // fall through

    default:
      return CHINESE.stems[stem];
  }
}
