import express from "express";
import { isCalendarName } from "../CalendarName";
import { LunarDate } from "../LunarDate";
import {
  isParsableToBoolean,
  isParsableToInt,
  notifyMissingParam,
} from "../utils";

export const convertRouter = express.Router();

convertRouter.get("/", function (req, res) {
  const { query: q } = req;
  if (!isCalendarName(q.source)) {
    return notifyMissingParam("source", res, req);
  }
  if (!isCalendarName(q.target)) {
    return notifyMissingParam("target", res, req);
  }
  if (q.source === q.target) {
    return res.status(400).send({
      message:
        '"source" and "target" must not be the same ("' + q.source + '")',
    });
  }
  if (!isParsableToInt(q.y)) {
    return notifyMissingParam("y", res, req);
  }
  if (!isParsableToInt(q.m)) {
    return notifyMissingParam("m", res, req);
  }
  if (!isParsableToInt(q.d)) {
    return notifyMissingParam("d", res, req);
  }
  if (!isParsableToInt(q.z)) {
    return notifyMissingParam("z", res, req);
  }
  if (!isParsableToBoolean(q.leap) && q.source === "Lunar") {
    return notifyMissingParam("leap", res, req);
  }
  const year = parseInt(q.y, 10);
  const month = parseInt(q.m, 10);
  const day = parseInt(q.d, 10);
  const timeZoneHours = parseInt(q.z, 10);
  if (q.source === "Gregorian") {
    const date = LunarDate.fromGregorian(year, month, day, timeZoneHours);
    return res.send({
      year: date.getApproxGregorianYear(),
      month: date.getMonth(),
      leap: date.isLeapMonth(),
      day: date.getDay(),
    });
  } else {
    const leap = q.leap === "true" || q.leap === "1";
    const date = new LunarDate(
      year,
      month,
      leap,
      day,
      timeZoneHours
    ).toGregorian();
    if (date === null) {
      return res.status(400).send({
        message:
          "Invalid date in Lunar calendar: year " +
          year +
          ", month " +
          month +
          (leap ? " (leap)" : "") +
          ", day " +
          day,
      });
    }
    return res.send({
      year: date[0],
      month: date[1],
      day: date[2],
    });
  }
  throw new Error("Unreachable code.");
});
