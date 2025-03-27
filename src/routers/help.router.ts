import express from "express";
import { calendarJoinedName } from "../types/calendar";

type HelpInfo = {
  action: string;
  url: string;
  params: {
    param: string;
    meaning: string;
  }[];
}[];

const helpInfo: HelpInfo = [
  {
    action: "Convert date in Gregorian from and to Lunar",
    url: "/convert",
    params: [
      {
        param: "source",
        meaning:
          'Original date\'s calendar. Must not be the same as "target". Must be one of ' +
          calendarJoinedName,
      },
      {
        param: "target",
        meaning:
          'Target date\'s calendar. Must not be the same as "source". Must be one of ' +
          calendarJoinedName,
      },
      {
        param: "y",
        meaning:
          'If "source" is "Gregorian" or "g", this is the year (AD 1 is 1, AD 2024 is 2024; BC years are not included). If "source" is "Lunar" or "l", this is the approximate Gregorian year of the lunar year.',
      },
      {
        param: "m",
        meaning: "The month of the year, from 1 to 12.",
      },
      {
        param: "l",
        meaning:
          'Indicating whether the specified Lunar month is leap. Applicable for Lunar calendar only. Must be one of: "true", "t" (true), "1" (true), "false", "f" (false), "0" (false).',
      },
      {
        param: "d",
        meaning:
          "The day of the month, from 1 to 30 (for Lunar calendar) or from 1 to 31 (for Gregorian calendar).",
      },
      {
        param: "z",
        meaning:
          "Time zone offset in hours, e.g. +09:00 is 9, -10:00 is -10, Zulu is 0.",
      },
    ],
  },
];

export const helpRouter = express.Router();

helpRouter.get("/", function (req, res) {
  return res.send(helpInfo);
});
