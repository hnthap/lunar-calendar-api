import { deepStrictEqual as dse } from "node:assert";
import test from "node:test";
import { LunarDate } from "../src/LunarDate";

test("Gregorian to Lunar", () => {
  const year = 1975;
  const month = 4;
  const day = 30;
  const timeZoneHours = 8;
  const lunar = LunarDate.fromGregorian(year, month, day, timeZoneHours);
  dse(lunar.getMonth(), 3);
  dse(lunar.isLeapMonth(), false);
  dse(lunar.getDay(), 19);
  const date = lunar.toGregorian()!;
  dse(date[0], year);
  dse(date[1], month);
  dse(date[2], day);
});

test("Lunar to Gregorian", () => {
  const lunar = new LunarDate(2024, 2, false, 8, 7);
  const [year, month, day] = lunar.toGregorian()!;
  dse(year, 2024);
  dse(month, 3);
  dse(day, 17);
});
