import { deepStrictEqual } from "assert";
import test, { describe } from "node:test";
import request from "supertest";
import { app } from "../src/app";

describe("Lunar Calendar API Tests", () => {
  test("Gregorian date to Lunar (Traditional Chinese representation)", async () => {
    const year = 1975;
    const month = 4;
    const day = 30;
    const tz = 8;
    const res = await request(app).get(
      `/v0/2/g2l?y=${year}&m=${month}&d=${day}&z=${tz}&lang=zh`
    );
    deepStrictEqual(res.statusCode, 200);
    deepStrictEqual(res.body, {
      date: {
        year: 1975,
        month: 3,
        monthSize: 29,
        leap: false,
        day: 19,
      },
      text: "乙卯年三月（小）十九日",
    });
  });

  test("Gregorian date to Lunar (Vietnamese representation)", async () => {
    const year = 2025;
    const month = 3;
    const day = 27;
    const tz = 7;
    const res = await request(app).get(
      `/v0/2/g2l?y=${year}&m=${month}&d=${day}&z=${tz}&lang=vi`
    );
    deepStrictEqual(res.statusCode, 200);
    deepStrictEqual(res.body, {
      date: {
        year: 2025,
        month: 2,
        monthSize: 29,
        leap: false,
        day: 28,
      },
      text: "ngày 28 tháng 2 (nhỏ) năm Ất Tỵ",
    });
  });

  test("Lunar date to Gregorian (1)", async () => {
    const year = 2024;
    const month = 2;
    const leap = false;
    const day = 8;
    const tz = 7;
    const res = await request(app).get(
      `/v0/2/l2g?y=${year}&m=${month}&l=${leap ? 1 : 0}&d=${day}&z=${tz}`
    );
    deepStrictEqual(res.statusCode, 200);
    deepStrictEqual(res.body, {
      date: {
        year: 2024,
        month: 3,
        day: 17,
      },
    });
  });

  test("Lunar date to Gregorian (2)", async () => {
    const year = 2025;
    const month = 2;
    const leap = false;
    const day = 28;
    const tz = 7;
    const res = await request(app).get(
      `/v0/2/l2g?y=${year}&m=${month}&l=${leap ? 1 : 0}&d=${day}&z=${tz}`
    );
    deepStrictEqual(res.statusCode, 200);
    deepStrictEqual(res.body, {
      date: {
        year: 2025,
        month: 3,
        day: 27,
      },
    });
  });
});
