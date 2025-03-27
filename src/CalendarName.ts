const calendarNames = ["Gregorian", "Lunar", "g", "l"] as const;

export const calendarJoinedName = calendarNames.map((s) => `"${s}"`).join(", ");

export type CalendarName = (typeof calendarNames)[number];

export function isCalendarName(calendar: unknown): calendar is CalendarName {
  return (
    typeof calendar === "string" &&
    calendarNames.includes(calendar as CalendarName)
  );
}
