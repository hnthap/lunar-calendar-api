import express from "express";
import { GregorianDate, isCalendarName, LunarDate } from "../types/calendar";
import {
  convertGregorianToLunar,
  convertLunarToGregorian,
  getGregorianDate,
  getLunarDate,
} from "../utils/algorithms";
import {
  isParsableToBoolean,
  isParsableToInt,
  respondInvalidParameter,
  respondMissingParameter,
} from "../utils/utils";

export const convertRouter = express.Router();

convertRouter.get("/", function (req, res) {
  const { query: q } = req;
  if (!isCalendarName(q.source)) {
    return respondMissingParameter("source", res, req);
  }
  if (!isCalendarName(q.target)) {
    return respondMissingParameter("target", res, req);
  }
  if (q.source === q.target) {
    return res.status(400).send({
      message:
      '"source" and "target" must not be the same ("' +
      q.source +
      '")',
    });
  }
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
  if (!isParsableToBoolean(q.leap) && q.source === "Lunar") {
    return respondMissingParameter("leap", res, req);
  }
  const year = parseInt(q.y, 10);
  const month = parseInt(q.m, 10);
  const day = parseInt(q.d, 10);
  const tz = parseInt(q.z, 10);
  if (q.source === "Gregorian" || q.source === "g") {
    return handleGregorianToLunar(
      { year, month, day, tz },
      res.send,
      () => {
        return respondInvalidParameter(null, res, req);
      }
    );
  } else {
    const leap = q.leap === "true" || q.leap === "1";
    return handleLunarToGregorian(
      { year, month, leap, day, tz },
      res.send,
      () => {
        return respondInvalidParameter(null, res, req);
      }
    );
  }
});

function handleGregorianToLunar(
  date: Pick<GregorianDate, "year" | "month" | "day" | "tz">,
  onSuccess: (
    result: Pick<LunarDate, "year" | "month" | "monthSize" | "leap" | "day">
  ) => void,
  onFailure: () => void
) {
  const gregorianDate = getGregorianDate(
    date.year,
    date.month,
    date.day,
    date.tz
  );
  if (gregorianDate === null) {
    return onFailure();
  }
  const lunarDate = convertGregorianToLunar(gregorianDate);
  const result = {
    year: lunarDate.year,
    month: lunarDate.month,
    monthSize: lunarDate.monthSize,
    leap: lunarDate.leap,
    day: lunarDate.day,
  };
  return onSuccess(result);
}

function handleLunarToGregorian(
  date: Pick<LunarDate, "year" | "month" | "leap" | "day" | "tz">,
  onSuccess: (result: Pick<GregorianDate, "year" | "month" | "day">) => void,
  onFailure: () => void
) {
  const lunarDate = getLunarDate(
    date.year,
    date.month,
    date.leap,
    date.day,
    date.tz
  );
  if (lunarDate === null) {
    return onFailure();
  }
  const gregorianDate = convertLunarToGregorian(lunarDate);
  return onSuccess({
    year: gregorianDate.year,
    month: gregorianDate.month,
    day: gregorianDate.day,
  });
}
