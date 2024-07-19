import {
  get11thLunarMonthsStartDateJD,
  getGregorianDateFromJD,
  getJDFromGregorianDate,
  getLeapMonthOffset,
  getNthNewMoonWithTimeZone,
} from "./utils";

export class LunarDate {
  /** Approximate Gregorian year of the lunar date */
  private gregorianYear: number;

  /** Lunar month, from 1 to 12 */
  private month: number;

  /** Whether the date is in a leap month */
  private leap: boolean;

  /** Day of month, from 1 to 30 */
  private day: number;

  /**
   * Time zone offset in hours (e.g. +00:00 is 0, +05:00 is 5,
   *  -10:00 is -10)
   */
  private timeZoneHours: number;

  constructor(
    approxGregorianYear: number,
    month: number,
    leap: boolean,
    day: number,
    timeZoneHours: number
  ) {
    this.gregorianYear = approxGregorianYear;
    this.month = month;
    this.leap = leap;
    this.day = day;
    this.timeZoneHours = timeZoneHours;
  }

  getApproxGregorianYear() {
    return this.gregorianYear;
  }

  getMonth() {
    return this.month;
  }

  getDay() {
    return this.day;
  }

  isLeapMonth() {
    return this.leap;
  }

  /**
   * https://www.informatik.uni-leipzig.de/~duc/amlich/amlich-aa98.js
   *
   * Copyright (c) 2006 Ho Ngoc Duc. All Rights Reserved.
   * Astronomical algorithms from the book "Astronomical Algorithms" by Jean Meeus, 1998
   *
   * Permission to use, copy, modify, and redistribute this software and its
   * documentation for personal, non-commercial use is hereby granted provided that
   * this copyright notice and appropriate documentation appears in all copies.
   */
  toGregorian() {
    let newMoonA, newMoonB: number;
    if (this.month < 11) {
      newMoonA = get11thLunarMonthsStartDateJD(
        this.gregorianYear - 1,
        this.timeZoneHours
      );
      newMoonB = get11thLunarMonthsStartDateJD(
        this.gregorianYear,
        this.timeZoneHours
      );
    } else {
      newMoonA = get11thLunarMonthsStartDateJD(
        this.gregorianYear,
        this.timeZoneHours
      );
      newMoonB = get11thLunarMonthsStartDateJD(
        this.gregorianYear + 1,
        this.timeZoneHours
      );
    }
    const n = Math.floor(0.5 + (newMoonA - 2415021.076998695) / 29.530588853);
    let offset = this.month - 11;
    if (offset < 0) {
      offset += 12;
    }
    if (newMoonB - newMoonA > 365) {
      const leapOffset = getLeapMonthOffset(newMoonA, this.timeZoneHours);
      let leapMonth = leapOffset - 2;
      if (leapMonth < 0) {
        leapMonth += 12;
      }
      if (this.leap && this.month != leapMonth) {
        return null;
      } else if (this.leap && offset >= leapOffset) {
        // The condition uses || instead of && in the original source file
        offset += 1;
      }
    }
    const monthStart = getNthNewMoonWithTimeZone(
      n + offset,
      this.timeZoneHours
    );
    return getGregorianDateFromJD(monthStart + this.day - 1);
  }

  toString() {
    return `${this.day}/${this.month} (${this.leap ? "nhuận" : "không nhuận"})`;
  }

  /**
   * https://www.informatik.uni-leipzig.de/~duc/amlich/amlich-aa98.js
   *
   * Copyright (c) 2006 Ho Ngoc Duc. All Rights Reserved.
   * Astronomical algorithms from the book "Astronomical Algorithms" by Jean Meeus, 1998
   *
   * Permission to use, copy, modify, and redistribute this software and its
   * documentation for personal, non-commercial use is hereby granted provided that
   * this copyright notice and appropriate documentation appears in all copies.
   */
  static fromGregorian(
    year: number,
    month: number,
    day: number,
    timeZoneHours: number
  ) {
    const dayNumber = getJDFromGregorianDate(year, month, day);
    const n = Math.floor((dayNumber - 2415021.076998695) / 29.530588853);
    let monthStart = getNthNewMoonWithTimeZone(n + 1, timeZoneHours);
    if (monthStart > dayNumber) {
      monthStart = getNthNewMoonWithTimeZone(n, timeZoneHours);
    }
    let newMoonA = get11thLunarMonthsStartDateJD(year, timeZoneHours);
    let newMoonB = newMoonA;
    const lunarDate = new LunarDate(
      year,
      0,
      false,
      dayNumber - monthStart + 1,
      timeZoneHours
    );
    if (newMoonA >= monthStart) {
      newMoonA = get11thLunarMonthsStartDateJD(year - 1, timeZoneHours);
    } else {
      lunarDate.gregorianYear += 1;
      newMoonB = get11thLunarMonthsStartDateJD(year + 1, timeZoneHours);
    }
    const diff = Math.floor((monthStart - newMoonA) / 29);
    lunarDate.month = diff + 11;
    if (newMoonB - newMoonA > 365) {
      const leapMonthDiff = getLeapMonthOffset(newMoonA, timeZoneHours);
      if (diff >= leapMonthDiff) {
        lunarDate.month = diff + 10;
        if (diff == leapMonthDiff) {
          lunarDate.leap = true;
        }
      }
    }
    if (lunarDate.month > 12) {
      lunarDate.month -= 12;
    }
    if (lunarDate.month >= 11 && diff < 4) {
      lunarDate.gregorianYear -= 1;
    }
    return lunarDate;
  }
}
