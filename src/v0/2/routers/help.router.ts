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
          languageNames
            .map((name) => `"${name}" (${languageNameMeanings[name]})`)
            .join(", ") +
          '. Default is "en" (English, i.e. modern representation).',
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
      item.endpoint = "/v0/2" + item.endpoint;
      return item;
    })
  );
});

export const redirectToHelp: express.RequestHandler = (res, req) => {
  return req.redirect("/v0/2/help");
};
