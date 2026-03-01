import { GregorianDate, GregorianTime, LunarDate } from "../types/calendar";
import { getLeapMonthK, getMonth11K } from "./engine";
import { approximateK, getNewMoonJDTD } from "./mechanics";
import { convertGregorianToJD, convertJDToGregorian, getDeltaTSecondsTD, SECONDS_TO_DAYS } from "./time";

function getMidnightJD(date: GregorianDate) {
  return convertGregorianToJD({ ...date, hour: 0, minute: 0, second: 0 });
}

function getNewMoonMidnightJD(k: number, tz: number) {
  const td = getNewMoonJDTD(k);
  const ut = td - getDeltaTSecondsTD(td) * SECONDS_TO_DAYS;
  const date = convertJDToGregorian(ut, tz);
  return getMidnightJD(date);
}

/**
 * 
 * @param gregorian A validated Gregorian date with timezone offset
 * @returns The equivalent Lunar date
 */
export function toLunar(gregorian: GregorianDate): LunarDate {
  const { year, tz } = gregorian;

  const gTime: GregorianTime = { ...gregorian, hour: 0, minute: 0, second: 0 };

  const gDayJD = convertGregorianToJD(gTime);
  
  let targetK = Math.round(approximateK(gTime));
  
  let dayOneJD = getNewMoonMidnightJD(targetK, tz);
  let nextDayOneJD = getNewMoonMidnightJD(targetK + 1, tz);

  if (gDayJD < dayOneJD) {
    targetK -= 1;
    nextDayOneJD = dayOneJD;
    dayOneJD = getNewMoonMidnightJD(targetK, tz);
  } else if (gDayJD >= nextDayOneJD) {
    targetK += 1;
    dayOneJD = nextDayOneJD;
    nextDayOneJD = getNewMoonMidnightJD(targetK + 1, tz);
  }

  const m11ThisYear = getMonth11K({ year, tz });
  let startM11K: number;
  let endM11K: number;
  let baseYear: number;

  if (targetK >= m11ThisYear) {
    startM11K = m11ThisYear;
    endM11K = getMonth11K({ year: year + 1, tz });
    baseYear = year;
  } else {
    startM11K = getMonth11K({ year: year - 1, tz });
    endM11K = m11ThisYear;
    baseYear = year - 1;
  }

  const leapMonthK = getLeapMonthK(startM11K, endM11K, tz);
  let lunarMonth = 11;
  let leap = false;
  let lunarYear = baseYear;

  for (let k = startM11K + 1; k <= targetK; k += 1) {
    if (k === leapMonthK) {
      leap = true;
    } else {
      leap = false;
      lunarMonth += 1;
      if (lunarMonth === 13) {
        lunarMonth = 1;
        lunarYear += 1;
      }
    }
  }

  const monthSize = nextDayOneJD - dayOneJD;
  const day = gDayJD - dayOneJD + 1;

  return {
    k: targetK, year: lunarYear, month: lunarMonth, leap, monthSize, day, tz,
  };
}

/**
 * 
 * @param lunar A validated Lunar date
 * @returns The equivalent Gregorian date
 */
export function toGregorian(
  { k, day, tz }: LunarDate
): GregorianDate {
  if (k === null) {
    throw new Error("Invalid lunar month of leap status for the given year.")
  }

  const td = getNewMoonJDTD(k);
  const ut = td - getDeltaTSecondsTD(td) * SECONDS_TO_DAYS;
  const date = convertJDToGregorian(ut, tz);
  const midnightJD = getMidnightJD(date);

  const targetJD = midnightJD + day - 1;
  const finalTime = convertJDToGregorian(targetJD, tz);

  return {
    year: finalTime.year, month: finalTime.month, day: finalTime.day, tz,
  };
}
