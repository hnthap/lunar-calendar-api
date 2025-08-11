import express from "express";
import { languageNames } from "../types/language";

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
    action: "Convert Gregorian date to Lunar calendar",
    url: "/g2l",
    params: [
      {
        param: "y",
        meaning:
          "The year (AD 1 is 1, AD 2024 is 2024; BC years are not included).",
      },
      {
        param: "m",
        meaning: "The month of the year, from 1 to 12.",
      },
      {
        param: "d",
        meaning: "The day of the month, from 1 to 31 (for Gregorian calendar).",
      },
      {
        param: "z",
        meaning:
          "Time zone offset in hours, e.g. +09:00 is 9, -10:00 is -10, Zulu is 0.",
      },
      {
        param: "lang",
        meaning:
          "[Optional] Language of the textual representation of Lunar date. Must be one of: " +
          languageNames.join(", "),
      },
    ],
  },
  {
    action: "Convert Lunar date to Gregorian calendar",
    url: "/l2g",
    params: [
      {
        param: "y",
        meaning: "The approximate Gregorian year of the lunar year.",
      },
      {
        param: "m",
        meaning: "The month of the year, from 1 to 12.",
      },
      {
        param: "l",
        meaning:
          'Indicating whether the specified Lunar month is leap. Must be one of: "true", "t" (true), "1" (true), "false", "f" (false), "0" (false).',
      },
      {
        param: "d",
        meaning: "The day of the month, from 1 to 30.",
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
  return res.send(
    helpInfo.map((item) => {
      item.url = "/v0/2" + item.url;
      return item;
    })
  );
});
