
const calendarNames = ["Gregorian", "Lunar", "g", "l"] as const;

export const calendarJoinedName = calendarNames.map((s) => `"${s}"`).join(", ");

/**
 * Type representing calendar names.
 */
export type CalendarName = (typeof calendarNames)[number];

/**
 * 
 * @param calendar 
 * @returns Whether `calendar` is a valid calendar name
 */
export function isCalendarName(calendar: unknown): calendar is CalendarName {
  return (
    typeof calendar === "string" &&
    calendarNames.includes(calendar as CalendarName)
  );
}

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
  /** JD */
  jd: number;
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
  /** JD */
  jd: number;
}