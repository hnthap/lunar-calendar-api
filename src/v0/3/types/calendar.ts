
export interface LunarDate {
  /**
   * Time zone offset in hours (e.g. +00:00 is 0, +05:00 is 5,
   *  -10:00 is -10)
   */
  tz: number;
  /** Approximate Gregorian year of the lunar date */
  year: number;
  /** Lunar month, from 1 to 12 */
  month: number;
  /** Lunar month's number of days */
  monthSize: number;
  /** Whether the date is in a leap month */
  leap: boolean;
  /** Day of month, from 1 to 30 */
  day: number;
  /** Lunation number (k), starting from 6 January 2000 */
  k: number;
}

export interface GregorianDate {
  /**
   * Time zone offset in hours (e.g. +00:00 is 0, +05:00 is 5,
   *  -10:00 is -10)
   */
  tz: number;
  /** Gregorian year */
  year: number;
  /** Gregorian month, from 1 to 12 */
  month: number;
  /** Day of month, from 1 to 31 */
  day: number;
}

export interface Time {
  /**
   * Hours, as an integer from 0 (inclusive) to 24 (exclusive).
   */
  hour: number;
  /**
   * Minutes, as an integer from 0 (inclusive) to 60 (exclusive).
   */
  minute: number;
  /**
   * Seconds, as an integer from 0 (inclusive) to 60 (exclusive).
   */
  second: number;
}

export interface LunarTime extends LunarDate, Time {}

export interface GregorianTime extends GregorianDate, Time {}

/**
 * 
 * @param a The first Gregorian date without timezone offset
 * @param b The second Gregorian date without timezone offset
 * @returns 0 if identical, -1 if the first is before the second,
 * and 1 otherwise
 */
export function compareDates(
  a: Pick<GregorianDate, "year" | "month" | "day">,
  b: Pick<GregorianDate, "year" | "month" | "day">
): number {
  if (a.year !== b.year) {
    return a.year < b.year ? -1 : 1;
  }
  if (a.month !== b.month) {
    return a.month < b.month ? -1 : 1;
  }
  if (a.day !== b.day) {
    return a.day < b.day ? -1 : 1;
  }
  return 0;
}
