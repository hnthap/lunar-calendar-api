import { GregorianDate } from "../types/calendar";

/**
 * 
 * @param gregorianDate Gregorian date
 * @returns String representation of the Gregorian date in so-called
 * "modern notation".
 */
export function stringifyGregorianDateInModernNotation(
  gregorianDate: GregorianDate
): string {
  const month = gregorianDate.month.toString();
  const day = gregorianDate.day.toString();
  return (
    gregorianDate.year.toString() +
    "." +
    ("0".repeat(Math.max(0, 2 - month.length)) + month) +
    "." +
    ("0".repeat(Math.max(0, 2 - day.length)) + day)
  );
}
