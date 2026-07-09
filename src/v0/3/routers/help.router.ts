import express from "express";
import { languageNameMeanings, languageNames } from "../types/language";

type MethodName =
  | "GET"
  | "HEAD"
  | "OPTIONS"
  | "TRACE"
  | "PUT"
  | "DELETE"
  | "POST"
  | "PATCH"
  | "CONNECT";

type HelpInfo = {
  action: string;
  method: MethodName;
  endpoint: string;
  params: {
    param: string;
    meaning: string;
  }[];
}[];

const helpInfo: HelpInfo = [
  {
    action: "Convert Gregorian date to Lunar calendar",
    method: "GET",
    endpoint: "/g2l",
    params: [
      {
        param: "y",
        meaning:
          "Gregorian year. For example, AD 1 is 1, AD 2024 is 2024, 1 BC is 0, 10 BC is -9.",
      },
      {
        param: "m",
        meaning: "Gregorian month, from 1 to 12.",
      },
      {
        param: "d",
        meaning: "Gregorian day of month, from 1 to 31.",
      },
      {
        param: "z",
        meaning:
          "Time zone offset in hours. For example +09:00 is 9, -10:00 is -10, 00:00 is 0.",
      },
      {
        param: "lang or language",
        meaning:
          "[Optional] Language of textual representation of the Lunar date, must be one of: " +
          languageNames
            .map((name) => `"${name}" (${languageNameMeanings[name]})`)
            .join(", ") +
          '. If not specified, a "modern representation" would be provided. lang and language are equivalent.',
      },
    ],
  },
  {
    action: "Convert Lunar date to Gregorian calendar",
    method: "GET",
    endpoint: "/l2g",
    params: [
      {
        param: "y",
        meaning: "The approximate Gregorian year of the lunar year.",
      },
      {
        param: "m",
        meaning: "Lunar month, from 1 to 12.",
      },
      {
        param: "leap",
        meaning:
          'Indicating whether the specified Lunar month is leap. Must be one of: "true", "1" (true), "false", "0" (false).',
      },
      {
        param: "d",
        meaning: "Lunar day of month, from 1 to 30.",
      },
      {
        param: "z",
        meaning:
          "Time zone offset in hours. For example +09:00 is 9, -10:00 is -10, 00:00 is 0.",
      },
    ],
  },
];

export const helpRouter = express.Router();

helpRouter.get("/", function (req, res) {
  return res.send(
    helpInfo.map((item) => {
      item.endpoint = "/v0/3" + item.endpoint;
      return item;
    })
  );
});