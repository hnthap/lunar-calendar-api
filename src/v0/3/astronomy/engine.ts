import { compareDates, GregorianDate, GregorianTime } from "../types/calendar";
import { approximateK, getNewMoonJDTD, getSunTrueLongitude } from "./mechanics";
import { convertGregorianToJD, convertJDToGregorian, getDeltaTSeconds, getDeltaTSecondsTD, SECONDS_TO_DAYS } from "./time";

/**
 * 
 * @param input Gregorian year and timezone offset
 * @returns The JD (TD) of the Winter Solstice of the specified Gregorian year
 */
function getWinterSolsticeJDTD(
  { year, tz }: Pick<GregorianDate, "year" | "tz">
): number {
  // Herein, left and right are anchors for a binary search,
  // and both are very far away from the Winter Solstice,
  // so assuming TD = UT is safe. In short, left and right are TD.
  let left = convertGregorianToJD({
    year: year,
    month: 12,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
    tz: tz,
  });
  let right = left + 35;

  let middle: number | undefined;
  let longitude: number;
  for (let i = 0; i < 100; i += 1) {
    middle = (left + right) / 2;
    longitude = getSunTrueLongitude(middle);

    // For Winter Solstice, the difference in degrees does not need
    // normalization.
    if (Math.abs(longitude - 270) < 1e-9) {
      return middle;
    }
    if (longitude < 270) {
      left = middle;
    } else {
      right = middle;
    }
  }
  return middle ?? (left + right) / 2;
}


/**
 * 
 * @param gregorianYear A Gregorian year
 * @param tz Timezone offset
 * @returns Lunation number () of the New Moon that begins the 11th Lunar
 * Month, i.e., Month 11
 */
export function getMonth11K(
  { year, tz }: Pick<GregorianDate, "year" | "tz">
): number {
  // w: The moment of the Winter Solstice in JD (TD)
  const w = getWinterSolsticeJDTD({ year, tz });
  const wDeltaT = getDeltaTSeconds(w);
  const wDate = convertJDToGregorian(w - wDeltaT * SECONDS_TO_DAYS, tz);

  // m: The moment of New Moon in JD (TD)
  const k = Math.round(approximateK(wDate));
  const m = getNewMoonJDTD(k);
  const mDeltaT = getDeltaTSeconds(m);
  const mDate = convertJDToGregorian(m - mDeltaT * SECONDS_TO_DAYS, tz);

  return compareDates(mDate, wDate) > 0 ? k - 1 : k;
}

/**
 * 
 * @param currentYearMonth11K
 * Lunation number (k) of Month 11 of the current year
 * @param nextYearMonth11K
 * Lunation number (k) of Month 11 of the next year
 * @param tz Timezone offset
 * @returns Lunation number (k) the first month without a Principal Solar Term
 * in the lunar year from Month 11 to before the next Month 11, otherwise,
 * null
 */
export function getLeapMonthK(
  currentYearMonth11K: number,
  nextYearMonth11K: number,
  tz: number
): number | null {
  if (nextYearMonth11K - currentYearMonth11K <= 12) {
    return null;
  }

  const k = currentYearMonth11K;
  for (let i = 1; i <= 12; i += 1) {
    const currentTD = getNewMoonJDTD(k + i);
    const nextTD = getNewMoonJDTD(k + i + 1);

    const currentUT = (
      currentTD - getDeltaTSecondsTD(currentTD) * SECONDS_TO_DAYS
    );
    const currentTime = convertJDToGregorian(currentUT, tz);
    const currentMidnightTime: GregorianTime = {
      ...currentTime, hour: 0, minute: 0, second: 0,
    };
    const currentMidnightUT = convertGregorianToJD(currentMidnightTime);
    const currentMidnightTD = (
      currentMidnightUT + getDeltaTSeconds(currentMidnightUT) * SECONDS_TO_DAYS
    );
    const lon1 = getSunTrueLongitude(currentMidnightTD);

    const nextUT = nextTD - getDeltaTSecondsTD(nextTD) * SECONDS_TO_DAYS;
    const nextTime = convertJDToGregorian(nextUT, tz);
    const nextMidnightTime: GregorianTime = {
      ...nextTime, hour: 0, minute: 0, second: 0,
    }
    const nextMidnightUT = convertGregorianToJD(nextMidnightTime);
    const nextMidnightTD = (
      nextMidnightUT + getDeltaTSeconds(nextMidnightUT) * SECONDS_TO_DAYS
    );
    const lon2 = getSunTrueLongitude(nextMidnightTD);
    
    if (Math.floor(lon1 / 30) == Math.floor(lon2 / 30)) {
      return k + i;
    }
  }

  return null;
}
