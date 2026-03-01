/**
 * 
 * @param deg Degrees
 * @returns Normalized degrees in the range from 0 degrees (inclusive) to 360
 * degrees (exclusive).
 */
export function normalizeDeg(deg: number) {
  return (deg % 360 + 360) % 360;
}

/**
 * 
 * @param deg Degrees
 * @returns Sine of the specified degrees
 */
export function sinDeg(deg: number) {
  return Math.sin(deg * Math.PI / 180.0)
}
