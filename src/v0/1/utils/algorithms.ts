/**
 * https://www.informatik.uni-leipzig.de/~duc/amlich/amlich-aa98.js
 *
 * Copyright (c) 2006 Ho Ngoc Duc. All Rights Reserved.
 * Astronomical algorithms from the book "Astronomical Algorithms" by Jean Meeus, 1998
 *
 * Permission to use, copy, modify, and redistribute this software and its
 * documentation for personal, non-commercial use is hereby granted provided that
 * this copyright notice and appropriate documentation appears in all copies.
 *
 * --------------------
 *
 * TypeScript translation of Ho Ngoc Duc's work:
 *
 * Copyright (c) 2024 Huynh Nhan Thap. All Rights Reserved.
 *
 * Permission to use, copy, modify, and redistribute this software and its
 * documentation for personal, non-commercial use is hereby granted provided
 * that this copyright notice and appropriate documentation appears in all
 * copies.
 */

import { GregorianDate, LunarDate } from "../types/calendar";
import { Constants } from "./constants";

/**
 * 
 * @param year Gregorian year
 * @param month Gregorian month, from 1 to 12
 * @param day Gregorian day of month, from 1 to 28, or 29, or 30, or 31
 * @param tz Time zone offset in hours
 * @returns Gregorian date if the provided values are valid, otherwise, null.
 */
export function getGregorianDate(
  year: number,
  month: number,
  day: number,
  tz: number
): GregorianDate | null {
  if (!isValidGregorianDate(year, month, day)) {
    return null;
  }
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const jd =
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;
  return { year, month, day, jd, tz };
}

/**
 * 
 * @param year Gregorian year
 * @param month Gregorian month, from 1 to 12
 * @param day Gregorian day of month, from 1 to 28, or 29, or 30, or 31
 * @returns Whether the specified Gregorian date is valid.
 */
export function isValidGregorianDate(
  year: number,
  month: number,
  day: number
): boolean {
  if (month < 1 || month > 12) {
    return false;
  }
  return day >= 1 && day <= getGregorianMonthNumDays(year, month);
}

/**
 * 
 * @param year Gregorian year
 * @param month Gregorian month, from 1 to 12
 * @returns Number of days in the specified month.
 */
export function getGregorianMonthNumDays(year: number, month: number): number {
  switch (month) {
    case 4:
    // fall through
    case 6:
    // fall through
    case 9:
    // fall through
    case 11:
      return 30;
    case 2:
      return isLeapGregorianYear(year) ? 29 : 28;
    default:
      return 31;
  }
}

/**
 * 
 * @param year Gregorian year
 * @returns Whether the Gregorian year is leap.
 */
export function isLeapGregorianYear(year: number): boolean {
  return year % 400 == 0 || (year % 4 == 0 && year % 100 != 0);
}

/**
 * Construct a Lunar date from the provided values.
 * @param year Approximate Gregorian year of the Lunar year
 * @param month Lunar month, from 1 to 12
 * @param leap Whether the Lunar month is leap
 * @param day Lunar day of month, from 1 to 29 or 30
 * @param tz Time zone offset in hours
 * @returns Lunar date if the provided values are valid, otherwise, null.
 */
export function getLunarDate(
  year: number,
  month: number,
  leap: boolean,
  day: number,
  tz: number
): LunarDate | null {
  if (month < 1 || month > 12 || day < 1 || day > 30) {
    return null;
  }
  let a, b;
  if (month < 11) {
    a = getLunarMonth11StartJd(year - 1, tz);
    b = getLunarMonth11StartJd(year, tz);
  } else {
    a = getLunarMonth11StartJd(year, tz);
    b = getLunarMonth11StartJd(year + 1, tz);
  }
  let offset = month - 11;
  if (offset < 0) {
    offset += 12;
  }
  if (b - a > 365) {
    const leapMonthOffset = getLeapMonthOffset(a, tz);
    let leapMonth = leapMonthOffset - 2;
    if (leapMonth < 0) {
      leapMonth += 12;
    }
    if (leap && month != leapMonth) {
      return null;
    } else if (leap || offset >= leapMonthOffset) {
      offset += 1;
    }
  }
  const k = Math.floor(0.5 + (a - 2415021.076998695) / 29.530588853);
  const monthStartJd = getKthNewMoonJd(k + offset, tz);
  const nextMonthStartJd = getKthNewMoonJd(k + offset + 1, tz);
  return {
    monthSize: nextMonthStartJd - monthStartJd,
    jd: monthStartJd + day - 1,
    year,
    month,
    leap,
    day,
    tz,
  };
}

/**
 * Convert a Gregorian date to Lunar calendar.
 * @param gregorianDate
 * @returns Lunar date
 */
export function convertGregorianToLunar(
  gregorianDate: GregorianDate
): LunarDate {
  const { year, jd, tz } = gregorianDate;
  const k = Math.floor((jd - 2415021.076998695) / 29.530588853);
  let monthStartJd = getKthNewMoonJd(k + 1, tz);
  let nextMonthStartJd;
  if (monthStartJd > jd) {
    nextMonthStartJd = monthStartJd;
    monthStartJd = getKthNewMoonJd(k, tz);
  } else {
    nextMonthStartJd = getKthNewMoonJd(k + 2, tz);
  }
  let a = getLunarMonth11StartJd(year, tz);
  let b = a;
  let lunarYear;
  if (a >= monthStartJd) {
    lunarYear = year;
    a = getLunarMonth11StartJd(year - 1, tz);
  } else {
    lunarYear = year + 1;
    b = getLunarMonth11StartJd(year + 1, tz);
  }
  const lunarDay = jd - monthStartJd + 1;
  const diff = Math.floor((monthStartJd - a) / 29);
  let leap = false;
  let lunarMonth = diff + 11;
  let offset;
  if (b - a > 365) {
    offset = getLeapMonthOffset(a, tz);
    if (diff >= offset) {
      lunarMonth = diff + 10;
      if (diff === offset) {
        leap = true;
      }
    }
  }
  if (lunarMonth > 12) {
    lunarMonth -= 12;
  }
  if (lunarMonth >= 11 && diff < 4) {
    lunarYear -= 1;
  }
  return {
    year: lunarYear,
    month: lunarMonth,
    monthSize: nextMonthStartJd - monthStartJd,
    day: lunarDay,
    jd,
    tz,
    leap,
  };
}

/**
 * Convert a Lunar date to Gregorian.
 * @param lunarDate
 * @returns Equivalent Gregorian date
 */
export function convertLunarToGregorian(lunarDate: LunarDate): GregorianDate {
  return convertJdToGregorianDate(lunarDate.jd, lunarDate.tz);
}

/**
 *
 * @param k
 * @param tz Time zone offset in hours
 * @returns JD of the kth new moon in the specified time zone
 */
export function getKthNewMoonJd(k: number, tz: number): number {
  const t = k / 1236.85;
  const t2 = t * t;
  const t3 = t2 * t;
  const jd1 =
    2415020.75933 +
    29.53058868 * k +
    0.0001178 * t2 -
    0.000000155 * t3 +
    0.00033 * sinDegrees(166.56 + 132.87 * t - 0.009173 * t2);
  const m = 359.2242 + 29.10535608 * k - 0.0000333 * t2 - 0.00000347 * t3;
  const mpr = 306.0253 + 385.81691806 * k + 0.0107306 * t2 + 0.00001236 * t3;
  const f = 21.2964 + 390.67050646 * k - 0.0016528 * t2 - 0.00000239 * t3;
  const c1 =
    (0.1734 - 0.000393 * t) * sinDegrees(m) +
    0.0021 * sinDegrees(2 * m) -
    0.4068 * sinDegrees(mpr) +
    0.0161 * sinDegrees(2 * mpr) -
    0.0004 * sinDegrees(3 * mpr) +
    0.0104 * sinDegrees(2 * f) -
    0.0051 * sinDegrees(m + mpr) -
    0.0074 * sinDegrees(m - mpr) +
    0.0004 * sinDegrees(2 * f + m) -
    0.0004 * sinDegrees(2 * f - m) -
    0.0006 * sinDegrees(2 * f + mpr) +
    0.001 * sinDegrees(2 * f - mpr) +
    0.0005 * sinDegrees(2 * mpr + m);
  let delta_t;
  if (t < -11) {
    delta_t =
      0.001 +
      0.000839 * t +
      0.0002261 * t2 -
      0.00000845 * t3 -
      0.000000081 * t3 * t;
  } else {
    delta_t = -0.000278 + 0.000265 * t + 0.000262 * t2;
  }
  const jd = jd1 + c1 - delta_t;
  return Math.floor(jd + 0.5 + tz / 24);
}

/**
 *
 * @param newMoon11Jd JD of the 11th new moon
 * @param tz Time zone offset in hours
 * @returns Leap month offet.
 */
export function getLeapMonthOffset(newMoon11Jd: number, tz: number): number {
  const k = Math.floor((newMoon11Jd - 2415021.076998695) / 29.530588853 + 0.5);
  let last = 0;
  let i = 1;
  let arc = getSunLongitude(getKthNewMoonJd(k + 1, tz), tz);
  while (true) {
    last = arc;
    i += 1;
    arc = getSunLongitude(getKthNewMoonJd(k + i, tz), tz);
    if (arc == last || i >= 14) {
      break;
    }
  }
  return i - 1;
}

/**
 *
 * @param year Approximate Gregorian year of the Lunar year
 * @param tz Time zone offset in hours
 * @returns JD of the 11th new moon in the specified Lunar year and time zone
 */
export function getLunarMonth11StartJd(year: number, tz: number): number {
  const date = getGregorianDate(year, 12, 31, tz)!;
  const offset = date.jd - 2415021;
  const k = Math.floor(offset / 29.530588853);
  const newMoonJd = getKthNewMoonJd(k, tz);
  const sunLongitude = getSunLongitude(newMoonJd, tz);
  return sunLongitude >= 9 ? getKthNewMoonJd(k - 1, tz) : newMoonJd;
}

/**
 *
 * @param jd JD of some date
 * @param tz Time zone offset in hours
 * @returns Sun longitude in the specified date and time zone
 */
export function getSunLongitude(jd: number, tz: number): number {
  const t = (jd - 2451545.5 - tz / 24.0) / 36525;
  const t2 = t * t;
  const m = 357.5291 + 35999.0503 * t - 0.0001559 * t2 - 0.00000048 * t2 * t;
  const long0 = 280.46645 + 36000.76983 * t + 0.0003032 * t2;
  const dl =
    (1.9146 - 0.004817 * t - 0.000014 * t2) * sinDegrees(m) +
    (0.019993 - 0.000101 * t) * sinDegrees(2 * m) +
    0.00029 * sinDegrees(3 * m);
  let longitude = (long0 + dl) * Constants.DEGREES_TO_RADIANS;
  longitude -= Constants.TAU * Math.floor(longitude / Constants.TAU);
  return Math.floor((longitude / Constants.PI) * 6);
}

/**
 *
 * @param jd JD of a day
 * @param tz Time zone offset in hours
 * @returns Gregorian date
 */
export function convertJdToGregorianDate(
  jd: number,
  tz: number
): GregorianDate {
  const a = Math.floor(jd + 32044);
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((b * 146097) / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = b * 100 + d - 4800 + Math.floor(m / 10);
  return { year, month, day, jd, tz };
}

/**
 *
 * @param degrees
 * @returns Sine of the specified number of degrees
 */
export function sinDegrees(degrees: number): number {
  return Math.sin(degrees * Constants.DEGREES_TO_RADIANS);
}
