import express from "express";
import { GregorianDate, LunarDate } from "../types/calendar";
import { convertLunarToGregorian, getLunarDate } from "../utils/algorithms";
import {
  isParsableToBoolean,
  isParsableToInt,
  respondInvalidParameter,
  respondMissingParameter,
} from "../utils/utils";

export const l2gRouter = express.Router();

l2gRouter.get("/", function (req, res) {
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
  if (!isParsableToBoolean(q.leap) && q.source === "Lunar") {
    return respondMissingParameter("leap", res, req);
  }
  return handleLunarToGregorian(
    {
      year: parseInt(q.y, 10),
      month: parseInt(q.m, 10),
      leap: q.leap === "true" || q.leap === "1",
      day: parseInt(q.d, 10),
      tz: parseInt(q.z, 10),
    },
    (result) => res.send(result),
    () => {
      return respondInvalidParameter(null, res, req);
    }
  );
});

function handleLunarToGregorian(
  date: Pick<LunarDate, "year" | "month" | "leap" | "day" | "tz">,
  onSuccess: (result: {
    date: Pick<GregorianDate, "year" | "month" | "day">;
  }) => void,
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
    date: {
      year: gregorianDate.year,
      month: gregorianDate.month,
      day: gregorianDate.day,
    },
  });
}
