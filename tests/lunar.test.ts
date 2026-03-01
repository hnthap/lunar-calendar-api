import { deepStrictEqual, strictEqual, ok } from "assert";
import test, { describe } from "node:test";
import request from "supertest";
import { app } from "../src/app";

describe("Lunar Calendar API Tests", () => {

  // ----------------------------------------------------------------------
  // 1. GREGORIAN TO LUNAR (g2l)
  // ----------------------------------------------------------------------
  describe("GET /v0/3/g2l - Gregorian to Lunar Core & Formatting", () => {
    test("Gregorian date to Lunar (Traditional Chinese representation)", async () => {
      const res = await request(app).get(`/v0/3/g2l?y=1975&m=4&d=30&z=8&lang=zh`);
      strictEqual(res.statusCode, 200);
      deepStrictEqual(res.body.date, { year: 1975, month: 3, monthSize: 29, leap: false, day: 19 });
      strictEqual(res.body.text, "乙卯年三月（小）十九日");
    });

    test("Gregorian date to Lunar (Vietnamese representation)", async () => {
      const res = await request(app).get(`/v0/3/g2l?y=2025&m=3&d=27&z=7&lang=vi`);
      strictEqual(res.statusCode, 200);
      deepStrictEqual(res.body.date, { year: 2025, month: 2, monthSize: 29, leap: false, day: 28 });
      strictEqual(res.body.text, "ngày 28 tháng 2 (thiếu) năm Ất Tỵ");
    });

    test("Gregorian date to Lunar (Simplified Chinese representation)", async () => {
      const res = await request(app).get(`/v0/3/g2l?y=2025&m=8&d=31&z=8&lang=zh-cn`);
      strictEqual(res.statusCode, 200);
      deepStrictEqual(res.body.date, { year: 2025, month: 7, monthSize: 30, leap: false, day: 9 });
      strictEqual(res.body.text, "乙巳年七月（大）初九日");
    });

    test("Gregorian date to Lunar (English/Modern default representation)", async () => {
      const res = await request(app).get(`/v0/3/g2l?y=2024&m=7&d=19&z=7`);
      strictEqual(res.statusCode, 200);
      deepStrictEqual(res.body.date, { year: 2024, month: 6, monthSize: 29, leap: false, day: 14 });
      strictEqual(res.body.text, "2024.06s.14");
    });
  });

  describe("GET /v0/3/g2l - Boundaries & Edge Cases", () => {
    test("Gregorian Jan 1st - Maps to the previous Lunar Year", async () => {
      const res = await request(app).get(`/v0/3/g2l?y=2024&m=1&d=1&z=7`);
      strictEqual(res.statusCode, 200);
      // Jan 1, 2024 is definitely still the 2023 Lunar Year
      strictEqual(res.body.date.year, 2023); 
    });

    test("Leap Year Transition Date", async () => {
      // Test a known Gregorian date that falls *inside* a leap month to ensure 
      // the 'leap: true' flag is triggered natively by the engine.
      const res = await request(app).get(`/v0/3/g2l?y=2025&m=7&d=26&z=7`); // Known leap month in 2025
      strictEqual(res.statusCode, 200);
      strictEqual(res.body.date.leap, true);
    });
  });

  describe("GET /v0/3/g2l - Validation & Error Handling", () => {
    test("Fails gracefully (400) when required parameters are missing", async () => {
      const res = await request(app).get(`/v0/3/g2l?y=2024&m=7&d=19`); // Missing 'z'
      strictEqual(res.statusCode, 400);
      ok(res.body.message.includes("z"));
    });

    test("Fails gracefully (400) for mathematically invalid Gregorian dates (Feb 30th)", async () => {
      const res = await request(app).get(`/v0/3/g2l?y=2024&m=2&d=30&z=7`);
      strictEqual(res.statusCode, 400);
    });

    test("Fails gracefully (400) for malformed types (Strings instead of Numbers)", async () => {
      const res = await request(app).get(`/v0/3/g2l?y=twenty&m=2&d=15&z=7`);
      strictEqual(res.statusCode, 400);
    });
  });

  // ----------------------------------------------------------------------
  // 2. LUNAR TO GREGORIAN (l2g)
  // ----------------------------------------------------------------------
  describe("GET /v0/3/l2g - Lunar to Gregorian Core", () => {
    test("Lunar date to Gregorian (Standard Month)", async () => {
      const res = await request(app).get(`/v0/3/l2g?y=2024&m=8&leap=false&d=15&z=7`);
      strictEqual(res.statusCode, 200);
      deepStrictEqual(res.body.date, { year: 2024, month: 9, day: 17 });
    });

    test("Lunar date to Gregorian (Leap Month)", async () => {
      const res = await request(app).get(`/v0/3/l2g?y=2025&m=6&leap=true&d=18&z=7`);
      strictEqual(res.statusCode, 200);
      deepStrictEqual(res.body.date, { year: 2025, month: 8, day: 11 });
    });
  });

  describe("GET /v0/3/l2g - Lunar Paradoxes & Strict Validation", () => {
    test("Fails gracefully (400) when requesting an impossible Lunar Day (Day 31)", async () => {
      // Lunar months can never be 31 days.
      const res = await request(app).get(`/v0/3/l2g?y=2024&m=5&leap=false&d=31&z=7`);
      strictEqual(res.statusCode, 400);
    });

    test("Fails gracefully (400) when requesting a leap month in a year that has none", async () => {
      // 2026 does not have a leap month 5. The engine should throw an error.
      const res = await request(app).get(`/v0/3/l2g?y=2026&m=5&leap=true&d=15&z=7`);
      strictEqual(res.statusCode, 400);
      ok(res.body.message.toLowerCase().includes("invalid lunar month") || res.body.message.toLowerCase().includes("leap status"));
    });

    test("Fails gracefully (400) when 'leap' parameter is missing", async () => {
      const res = await request(app).get(`/v0/3/l2g?y=2024&m=8&d=15&z=7`);
      strictEqual(res.statusCode, 400);
      ok(res.body.message.includes("leap"));
    });
  });

  // ----------------------------------------------------------------------
  // 3. HELP ENDPOINT
  // ----------------------------------------------------------------------
  describe("GET /v0/3/help - System Info", () => {
    test("Returns 200 and a documented array of endpoints", async () => {
      const res = await request(app).get(`/v0/3/help`);
      strictEqual(res.statusCode, 200);
      strictEqual(Array.isArray(res.body), true);
      strictEqual(res.body.length > 0, true);
      ok(res.body[0].action);
      ok(res.body[0].endpoint);
    });
  });

});
