/**
 * https://www.informatik.uni-leipzig.de/~duc/amlich/amlich-aa98.js
 *
 * Copyright (c) 2006 Ho Ngoc Duc. All Rights Reserved.
 * Astronomical algorithms from the book "Astronomical Algorithms" by Jean Meeus, 1998
 *
 * Permission to use, copy, modify, and redistribute this software and its
 * documentation for personal, non-commercial use is hereby granted provided that
 * this copyright notice and appropriate documentation appears in all copies.
 * --------------------
 *
 * TypeScript translation of Ho Ngoc Duc's work:
 *
 * Copyright (c) 2024 Huynh Nhan Thap. All Rights Reserved.
 *
 * Permission to use, copy, modify, and redistribute this software and its
 * documentation for personal, non-commercial use is hereby granted provided
 * that this copyright notice and appropriate documentation appears in all
 * copies.
 */

import express from "express";

const DEGREES_TO_RADIANS = Math.PI / 180.0;
const TAU = Math.PI * 2;

export function getHelpLink(req: express.Request) {
  return `See ${req.protocol}://${req.get("host")}/help for more.`;
}

export function notifyMissingParam(
  paramName: string,
  res: express.Response,
  req: express.Request
) {
  return res.status(400).send({
    message: `Please specify "${paramName}". ${getHelpLink(req)}`,
  });
}

/**
 * 
 * @param s 
 * @returns true if `s` is parsable to integer, otherwise, false
 */
export function isParsableToInt(s: unknown): s is string {
  return typeof s === "string" && /[+-]?[0-9]+/.test(s);
}

/**
 * 
 * @param s 
 * @returns true if `s` is parsable to boolean, otherwise, false
 */
export function isParsableToBoolean(s: unknown): s is string {
  return typeof s === "string" && /true|false|0|1/i.test(s);
}

/**
 * Calculate the start of the 11th lunar month in the specified Gregorian year
 * and time zone.
 * @param yearGregorian Year in Gregorian calendar
 * @param timeZoneHours Time zone offset in hours
 * @returns Start date (in JD) of the 11th lunar month
 */
export function get11thLunarMonthsStartDateJD(
  yearGregorian: number,
  timeZoneHours: number
): number {
  const offset = getJDFromGregorianDate(yearGregorian, 12, 31) - 2415021;
  const n = Math.floor(offset / 29.530588853);
  const newMoon = getNthNewMoonWithTimeZone(n, timeZoneHours);
  const sunLong = getMajorSolarTerm(newMoon, timeZoneHours);
  return sunLong >= 9
    ? getNthNewMoonWithTimeZone(n - 1, timeZoneHours)
    : newMoon;
}

/**
 * 
 * @param jd JD
 * @returns Gregorian date as an array of `[year, month, day]`
 */
export function getGregorianDateFromJD(
  jd: number
): [year: number, month: number, day: number] {
  const a = jd + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((b * 146097) / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  return [
    b * 100 + d - 4800 + Math.floor(m / 10),
    m + 3 - 12 * Math.floor(m / 10),
    e - Math.floor((153 * m + 2) / 5) + 1,
  ];
}

/**
 * 
 * @param year Gregorian year
 * @param month Gregorian month, starting from 1
 * @param day Gregorian day of month, starting from 1
 * @returns JD
 */
export function getJDFromGregorianDate(
  year: number,
  month: number,
  day: number
) {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const jd =
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;
  return jd;
}

/**
 * Calculate leap month offset from the start of the 11th lunar month and time
 * zone.
 * @param newMoon11 The start of an 11th lunar month
 * @param timeZoneHours Time zone offset in hours
 * @returns Leap month offset
 */
export function getLeapMonthOffset(
  newMoon11: number,
  timeZoneHours: number
): number {
  const n = Math.floor((newMoon11 - 2415021.076998695) / 29.530588853 + 0.5);
  let last: number;
  let i = 0;
  let arc = getMajorSolarTerm(
    getNthNewMoonWithTimeZone(n + 1, timeZoneHours),
    timeZoneHours
  );
  do {
    last = arc;
    i += 1;
    arc = getMajorSolarTerm(
      getNthNewMoonWithTimeZone(n + 1, timeZoneHours),
      timeZoneHours
    );
  } while (arc != last && i < 14);
  return i - 1;
}

/**
 * 
 * @param n 
 * @returns Start of nth new moon since Jan 1 1900 (in JD)
 */
export function getNthNewMoon(n: number) {
  const t = n / 1236.85;
  const t2 = t * t;
  const t3 = t2 * t;
  const jd1 =
    2415020.75933 +
    29.53058868 * n +
    0.0001178 * t2 -
    0.000000155 * t3 +
    0.00033 * sinDegrees(166.56 + 132.87 * t - 0.009173 * t2);
  const m = 359.2242 + 29.10535608 * n - 0.0000333 * t2 - 0.00000347 * t3;
  const mpr = 306.0253 + 385.81691806 * n + 0.0107306 * t2 + 0.00001236 * t3;
  const f = 21.2964 + 390.67050646 * n - 0.0016528 * t2 - 0.00000239 * t3;
  const c1 =
    (0.1734 - 0.000393 * t) * sinDegrees(m) +
    0.0021 * sinDegrees(2 * m) -
    0.4068 * sinDegrees(mpr) +
    0.0161 * sinDegrees(2 * mpr) -
    0.0004 * sinDegrees(3 * mpr) +
    0.0104 * sinDegrees(2 * f) -
    0.0051 * sinDegrees(m + mpr) -
    0.0074 * sinDegrees(m - mpr) +
    0.0004 * sinDegrees(2 * f + m) -
    0.0004 * sinDegrees(2 * f - m) -
    0.0006 * sinDegrees(2 * f + mpr) +
    0.001 * sinDegrees(2 * f - mpr) +
    0.0005 * sinDegrees(2 * mpr + m);
  const deltaT =
    t < -11
      ? 0.001 +
        0.000839 * t +
        0.0002261 * t2 -
        0.00000845 * t3 -
        0.000000081 * t3 * t
      : -0.000278 + 0.000265 * t + 0.000262 * t2;
  return jd1 + c1 - deltaT;
}

/**
 * 
 * @param n 
 * @param timeZoneHours Time zone offset in hours
 * @returns nth new moon in specified time zone
 */
export function getNthNewMoonWithTimeZone(n: number, timeZoneHours: number) {
  return Math.floor(getNthNewMoon(n) + 0.5 + timeZoneHours / 24);
}

/**
 * 
 * @param jdn 
 * @returns Solar ecliptic longitude
 */
export function getSolarEclipticLongitude(jdn: number): number {
  const t = (jdn - 2451545.0) / 36525;
  const t2 = t * t;
  const m = 357.5291 + 35999.0503 * t - 0.0001559 * t2 - 0.00000048 * t2 * t;
  const long0Degrees = 280.46645 + 36000.76983 * t + 0.0003032 * t2;
  const deltaLongDegres =
    (1.9146 - 0.004817 * t - 0.000014 * t2) * sinDegrees(m) +
    (0.019993 - 0.000101 * t) * sinDegrees(2 * m) +
    0.00029 * sinDegrees(3 * m);
  const long = (long0Degrees + deltaLongDegres) * DEGREES_TO_RADIANS;
  return long - TAU * Math.floor(long / TAU);
}

/**
 * 
 * @param jdn 
 * @param timeZoneHours Time zone offset in hours
 * @returns Major solar term
 */
export function getMajorSolarTerm(jdn: number, timeZoneHours: number): number {
  return Math.floor(
    (getSolarEclipticLongitude(jdn - 0.5 - timeZoneHours / 24) / Math.PI) * 6
  );
}

/**
 * 
 * @param degrees 
 * @returns Sine of specified degrees
 */
export function sinDegrees(degrees: number): number {
  return Math.sin(degrees * DEGREES_TO_RADIANS);
}
