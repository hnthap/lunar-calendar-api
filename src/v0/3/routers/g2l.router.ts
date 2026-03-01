import express from "express";
import { GregorianDate, LunarDate } from "../types/calendar";
import { isLanguageName, LanguageName } from "../types/language";
import {
  isParsableToInt,
  respondInvalidParameter,
  respondMissingParameter,
} from "../utils/utils";
import { createGregorianDate } from "../astronomy/time";
import { toLunar } from "../astronomy/converter";
import { stringifyLunar } from "../utils/representation";

export const g2lRouter = express.Router();

g2lRouter.get("/", function (req, res) {
  const { query: q } = req;
  if (!isParsableToInt(q.y)) {
    return respondMissingParameter("y", res, req);
  }
  if (!isParsableToInt(q.m)) {
    return respondMissingParameter("m", res, req);
  }
  if (!isParsableToInt(q.d)) {
    return respondMissingParameter("d", res, req);
  }
  if (!isParsableToInt(q.z)) {
    return respondMissingParameter("z", res, req);
  }
  const language: LanguageName | null = isLanguageName(q.lang)
    ? q.lang
    : isLanguageName(q.language)
    ? q.language
    : null;
  return handleGregorianToLunar(
    {
      year: parseInt(q.y, 10),
      month: parseInt(q.m, 10),
      day: parseInt(q.d, 10),
      tz: parseInt(q.z, 10),
    },
    language,
    (result) => res.send(result),
    () => {
      return respondInvalidParameter(
        "Invalid Gregorian month and/or day.", res, req,
      );
    }
  );
});

function handleGregorianToLunar(
  date: Pick<GregorianDate, "year" | "month" | "day" | "tz">,
  language: LanguageName | null,
  onSuccess: (result: {
    date: Pick<LunarDate, "year" | "month" | "monthSize" | "leap" | "day">;
    text: string | null;
  }) => void,
  onFailure: () => void
) {
  const gregorianDate = createGregorianDate(date);
  if (gregorianDate === null) {
    return onFailure();
  }
  const lunarDate = toLunar(gregorianDate);
  return onSuccess({
    date: {
      year: lunarDate.year,
      month: lunarDate.month,
      monthSize: lunarDate.monthSize,
      leap: lunarDate.leap,
      day: lunarDate.day,
    },
    text: stringifyLunar(lunarDate, true, language),
  });
}
