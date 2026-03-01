import express from "express";
import { GregorianDate, LunarDate } from "../types/calendar";
import {
  isParsableToBoolean,
  isParsableToInt,
  respondInvalidParameter,
  respondMissingParameter,
} from "../utils/utils";
import { createLunarDate } from "../astronomy/time";
import { toGregorian } from "../astronomy/converter";

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
  if (!isParsableToBoolean(q.leap)) {
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
      return respondInvalidParameter(
        "Invalid lunar month, day, or leap status.", res, req,
      );
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
  const lunarDate = createLunarDate(date);
  if (lunarDate === null) {
    return onFailure();
  }
  const gregorianDate = toGregorian(lunarDate);
  return onSuccess({
    date: {
      year: gregorianDate.year,
      month: gregorianDate.month,
      day: gregorianDate.day,
    },
  });
}
