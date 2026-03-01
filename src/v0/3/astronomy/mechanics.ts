import { GregorianTime } from "../types/calendar";
import { normalizeDeg, sinDeg } from "./trigonometry";

/**
 * See more: Chapter 24 "Solar Coordinates" in
 * Jean Meuus, Astronomical Algorithms, 1991.
 * 
 * @param jdTD JD in Dynamic Time
 * @returns The true geometric longitude of the Sun for the given time in
 * degrees
 */
export function getSunTrueLongitude(jdTD: number): number {
  // T: Julian centuries from the epoch J2000.0.
  const T = (jdTD - 2451545) / 36525;
  const T2 = T * T;
  // L0: The geometric mean longitude of the Sun in degrees.
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
  // M: The mean anomaly of the Sun in degrees.
  const M = 357.52910 + 35999.05030 * T + 0.0001559 * T2 - 0.00000048 * T2 * T;
  // C: Center C of the Sun in degrees.
  const C = (
    (1.914600 - 0.004817 * T - 0.000014 * T2) * sinDeg(M)
    + (0.019993 - 0.000101 * T) * sinDeg(2 * M)
    + 0.000290 * sinDeg(3 * M)
  );
  // Theta: The Sun's true longitude in degrees.
  return normalizeDeg(L0 + C);
}

/**
 * See more: Chapter 47 "Phases of the Moon"
 * in Jean Meuus, Astronomical Algorithms, 1991.
 * 
 * @param k Lunation number (k=0 is roughly around the year 2000); k must be an
 * integer to be able to represent a New Moon
 * @returns The exact JD in Dynamic Time of the k-th New Moon
 */
export function getNewMoonJDTD(k: number): number {
  // T: Julian centuries from the epoch J2000.0.
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  const T4 = T3 * T;
  // E: Eccentricity of the Earth's orbit around the Sun
  const E = 1 - 0.002516 * T - 0.0000074 * T2;
  // JDE: The mean time of the phase
  const JDE = (
    2451550.09765
    + 29.530588853 * k
    + 0.0001337 * T2
    - 0.000000150 * T3
    + 0.00000000073 * T4
  );
  // M: Sun's mean anomaly at time JDE
  const M = (
    2.5534
    + 29.10535669 * k
    - 0.0000218 * T2
    - 0.00000011 * T3
  );
  // M': Moon's mean anomaly at time JDE
  const MPrime = (
    201.5643
    + 385.81693528 * k
    + 0.0107438 * T2
    + 0.00001239 * T3
    - 0.000000058 * T4
  );
  // F: Moon's argument of latitude
  const F = (
    160.7108
    + 390.67050274 * k
    - 0.0016341 * T2
    - 0.00000227 * T3
    + 0.000000011 * T4
  );
  // Omega: Longitude of the ascending node of the lunar orbit
  const Omega = (
    124.7746
    - 1.56375580 * k
    + 0.0020691 * T2
    + 0.00000215 * T3
  );
  const corrections = (
    0
    - 0.40720 * sinDeg(MPrime)
    + 0.17241 * E * sinDeg(M)
    + 0.01608 * sinDeg(2 * MPrime)
    + 0.01039 * sinDeg(2 * F)
    + 0.00739 * E * sinDeg(MPrime - M)
    - 0.00514 * E * sinDeg(MPrime + M)
    + 0.00208 * E * E * sinDeg(2 * M)
    - 0.00111 * sinDeg(MPrime - 2 * F)
    - 0.00057 * sinDeg(MPrime + 2 * F)
    + 0.00056 * E * sinDeg(2 * MPrime + M)
    - 0.00042 * sinDeg(3 * MPrime)
    + 0.00042 * E * sinDeg(M + 2 * F)
    + 0.00038 * E * sinDeg(M - 2 * F)
    - 0.00024 * E * sinDeg(2 * MPrime - M)
    - 0.00017 * sinDeg(Omega)
    - 0.00007 * sinDeg(MPrime + 2 * M)
    + 0.00004 * sinDeg(2 * MPrime - 2 * F)
    + 0.00004 * sinDeg(3 * M)
    + 0.00003 * sinDeg(MPrime + M - 2 * F)
    + 0.00003 * sinDeg(2 * MPrime + 2 * F)
    - 0.00003 * sinDeg(MPrime + M + 2 * F)
    + 0.00003 * sinDeg(MPrime - M + 2 * F)
    - 0.00002 * sinDeg(MPrime - M - 2 * F)
    - 0.00002 * sinDeg(3 * MPrime + M)
    + 0.00002 * sinDeg(4 * MPrime)
    + 0.000325 * sinDeg(299.77 + 0.107408 * k - 0.009173 * T2)
    + 0.000165 * sinDeg(251.88 + 0.016321 * k)
    + 0.000164 * sinDeg(251.83 + 26.651886 * k)
    + 0.000126 * sinDeg(349.42 + 36.412478 * k)
    + 0.000110 * sinDeg(84.66 + 18.206239 * k)
    + 0.000062 * sinDeg(141.74 + 53.303771 * k)
    + 0.000060 * sinDeg(207.14 + 2.453732 * k)
    + 0.000056 * sinDeg(154.84 + 7.306860 * k)
    + 0.000047 * sinDeg(34.52 + 27.261239 * k)
    + 0.000042 * sinDeg(207.19 + 0.121824 * k)
    + 0.000040 * sinDeg(291.34 + 1.844379 * k)
    + 0.000037 * sinDeg(161.72 + 24.198154 * k)
    + 0.000035 * sinDeg(239.56 + 25.513099 * k)
    + 0.000023 * sinDeg(331.55 + 3.592518 * k)
  );
  return JDE + corrections;
}

/**
 * 
 * @param g The Gregorian date with hour, minute, second, and timezone offset
 * @returns The approximated k given the provided decimal year
 */
export function approximateK(g: GregorianTime): number {
  const { year: y, month: m, day: d } = g;
  const K = (y % 400 === 0 || (y % 4 === 0 && y % 100 !== 0)) ? 1 : 2;
  const dayOfYear = (
    Math.floor(275 * m / 9) 
    - K * Math.floor((m + 9) / 12) 
    + d
    - 30
  );
  const F = (g.hour - g.tz + (g.minute + g.second / 60.0) / 60.0) / 24.0;
  return ((dayOfYear - 1 + F) / (K == 1 ? 366 : 365) + y - 2000) * 12.3685;
}
