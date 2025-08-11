import { deepStrictEqual } from "assert";
import test from "node:test";
import request from "supertest";
import { app } from "../src";

test("Gregorian date to Lunar (1)", async () => {
  const year = 1975;
  const month = 4;
  const day = 30;
  const tz = 8;
  const res = await request(app).get(
    `/v1/convert/?source=g&target=l&y=${year}&m=${month}&d=${day}&z=${tz}`
  );
  deepStrictEqual(res.statusCode, 200);
  deepStrictEqual(res.body, {
    year: 1975,
    month: 3,
    monthSize: 29,
    leap: false,
    day: 19,
  });
});

test("Gregorian date to Lunar (2)", async () => {
  const year = 2025;
  const month = 3;
  const day = 27;
  const tz = 7;
  const res = await request(app).get(
    `/convert/?source=g&target=l&y=${year}&m=${month}&d=${day}&z=${tz}`
  );
  deepStrictEqual(res.statusCode, 200);
  deepStrictEqual(res.body, {
    year: 2025,
    month: 2,
    monthSize: 29,
    leap: false,
    day: 28,
  });
});

test("Lunar date to Gregorian (1)", async () => {
  const year = 2024;
  const month = 2;
  const leap = false;
  const day = 8;
  const tz = 7;
  const res = await request(app).get(
    `/convert/?source=l&target=g&y=${year}&m=${month}&l=${
      leap ? 1 : 0
    }&d=${day}&z=${tz}`
  );
  deepStrictEqual(res.statusCode, 200);
  deepStrictEqual(res.body, {
    year: 2024,
    month: 3,
    day: 17,
  });
});

test("Lunar date to Gregorian (2)", async () => {
  const year = 2025;
  const month = 2;
  const leap = false;
  const day = 28;
  const tz = 7;
  const res = await request(app).get(
    `/convert/?source=l&target=g&y=${year}&m=${month}&l=${
      leap ? 1 : 0
    }&d=${day}&z=${tz}`
  );
  deepStrictEqual(res.statusCode, 200);
  deepStrictEqual(res.body, {
    year: 2025,
    month: 3,
    day: 27,
  });
});
