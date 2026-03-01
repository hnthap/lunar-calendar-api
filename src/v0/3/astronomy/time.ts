import { GregorianDate, GregorianTime, LunarDate } from "../types/calendar";
import { getLeapMonthK, getMonth11K } from "./engine";
import { getNewMoonJDTD } from "./mechanics";

export const SECONDS_TO_DAYS = 1 / 86400;

/**
 * 
 * @param date Input Gregorian date
 * @returns Gregorian date if the provided values are valid, otherwise, null
 */
export function createGregorianDate(
  { year, month, day, tz }: Pick<GregorianDate, "year" | "month" | "day" | "tz">,
): GregorianDate | null {
  if (
    month < 1
    || month > 12
    || day < 1
    || day > getGregorianMonthSize(year, month)
  ) {
    return null;
  }
  return { year, month, day, tz };
}

/**
 * 
 * @param lunar Input Lunar date
 * @returns Lunar date if the provided values are valid, otherwise, null
 */
export function createLunarDate(
  { year, month, leap, day, tz }: Pick<LunarDate, "year" | "month" | "leap" | "day" | "tz">,
): LunarDate | null {
  if (month < 1 || month > 12 || day < 1 || day > 30) {
    return null;
  }

  const anchorYear = month >= 11 ? year : year - 1;

  const startM11K = getMonth11K({ year: anchorYear, tz });
  const endM11K = getMonth11K({ year: anchorYear + 1, tz });
  const leapMonthK = getLeapMonthK(startM11K, endM11K, tz);

  let targetK: number | null = null;
  let currentMonth = 11;
  let isLeap = false;

  for (let i = 0; i <= 14; i++) {
    const k = startM11K + i;

    if (i > 0) {
      if (k === leapMonthK) {
        isLeap = true;
      } else {
        isLeap = false;
        currentMonth += 1;
        if (currentMonth === 13) {
          currentMonth = 1;
        }
      }
    }

    if (currentMonth === month && isLeap === leap) {
      targetK = k;
      break;
    }
  }

  if (targetK === null) {
    return null;
  }

  const nextMonthTD = getNewMoonJDTD(targetK + 1);
  const nextMonthUT = (
    nextMonthTD - getDeltaTSecondsTD(nextMonthTD) * SECONDS_TO_DAYS
  );
  const nextMonthDayOne: GregorianTime = {
    ...convertJDToGregorian(nextMonthUT, tz), hour: 0, minute: 0, second: 0,
  };

  const thisMonthTD = getNewMoonJDTD(targetK);
  const thisMonthUT = (
    thisMonthTD - getDeltaTSecondsTD(thisMonthTD) * SECONDS_TO_DAYS
  );
  const thisMonthDayOne: GregorianTime = {
    ...convertJDToGregorian(thisMonthUT, tz), hour: 0, minute: 0, second: 0,
  };

  const monthSize = (
    convertGregorianToJD(nextMonthDayOne) - convertGregorianToJD(thisMonthDayOne)
  );

  if (day > monthSize) {
    return null;
  }

  return { k: targetK, year, month, leap, monthSize, day, tz };
}

/**
 * 
 * @param year Gregorian year
 * @param month Gregorian month, from 1 to 12
 * @returns Number of days in the specified month
 */
export function getGregorianMonthSize(year: number, month: number): number {
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
      return year % 400 == 0 || (year % 4 == 0 && year % 100 != 0) ? 29 : 28;
    
    default:
      return 31;
  }
}

/**
 * See more: Chapter 7 of Jean Meuus, Astronomical Algorithms, 1991.
 * 
 * @param g A Gregorian date with hour, minute, and second values
 * @returns The equivalent JD (UT)
 */
export function convertGregorianToJD(g: GregorianTime): number {
  let { year: y, month: m } = g;
  const d = g.day + (g.hour - g.tz + (g.minute + g.second / 60.0) / 60.0) / 24.0;
  if (m < 3) {
    y = y - 1;
    m = m + 12;
  }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return (
    Math.floor(365.25 * (y + 4716))
    + Math.floor(30.6001 * (m + 1))
    + d
    + B
    - 1524.5
  );
}

/**
 * See more: Chapter 7 of Jean Meuus, Astronomical Algorithms, 1991.
 * 
 * @param jd A positive JD (UT)
 * @param tz Timezone offset
 * @returns The equivalent Gregorian date with hour, minute, and second values
 */
export function convertJDToGregorian(jd: number, tz: number): GregorianTime {
  jd += tz / 24;
  const Z = Math.floor(jd + 0.5);
  const F = jd + 0.5 - Z;
  const alpha = Math.floor((Z - 1867216.25) / 36524.25);
  const A = Z + 1 + alpha - Math.floor(alpha / 4);
  const B = A + 1524;
  const C = Math.floor((B - 122.1) / 365.25);
  const D = Math.floor(365.25 * C);
  const E = Math.floor((B - D) / 30.6001);

  const month = E < 14 ? E - 1 : E - 13;
  const year = month > 2 ? C - 4716 : C - 4715;
  const t = B - D - Math.floor(30.6001 * E) + F;
  const day = Math.floor(t);
  const h = (t - day) * 24;
  const hour = Math.floor(h);
  const m = (h - hour) * 60;
  const minute = Math.floor(m);
  const second = Math.round((m - minute) * 60);
  return { year, month, day, hour, minute, second, tz };
}

/**
 * Calculates Delta T (in seconds), the difference between Dynamic Time (TD)
 * and Universal Time (UT) for a given JD (which equals TD minus Delta T).
 * 
 * See more: Chapter 9 "Dynamical Time"
 * in Jean Meuus, Astronomical Algorithms, 1991.
 * 
 * @param jd The JD (UT)
 * @returns Delta T
 */
export function getDeltaTSeconds(jd: number): number {
  return -15 + (jd - 2382148) * (jd - 2382148) / 41048480;
}

/**
 * Calculates Delta T (in seconds), the difference between Dynamic Time (TD)
 * and Universal Time (UT) for a given JD (which equals TD minus Delta T).
 * 
 * See more: Chapter 9 "Dynamical Time"
 * in Jean Meuus, Astronomical Algorithms, 1991.
 * 
 * @param jd The JD (TD)
 * @returns Delta T
 */
export function getDeltaTSecondsTD(jdTD: number): number {
  let ut = jdTD;
  let previousUT = 0;

  while (ut !== previousUT) {
    previousUT = ut;
    ut = jdTD - getDeltaTSeconds(ut) * SECONDS_TO_DAYS;
  }

  return getDeltaTSeconds(ut);
}
