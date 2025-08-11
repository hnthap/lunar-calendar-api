import express from "express";

export function respondMissingParameter(
  paramName: string,
  res: express.Response,
  req: express.Request
) {
  return res.status(400).send({
    message: `Please specify "${paramName}". See ${req.protocol}://${req.get(
      "host"
    )}/help for more.`,
  });
}

export function respondInvalidParameter(
  paramName: string | null,
  res: express.Response,
  req: express.Request
) {
  let message;
  if (paramName) {
    message = "Invalid parameters.";
  } else {
    message = `Parameter "${paramName}"'s value is invalid.`;
  }
  return res.status(400).send({
    message:
      message + ` See ${req.protocol}://${req.get("host")}/help for more.`,
  });
}

/**
 *
 * @param s
 * @returns Whether `s` is parsable to integer
 */
export function isParsableToInt(s: unknown): s is string {
  return typeof s === "string" && /[+-]?[0-9]+/.test(s);
}

/**
 *
 * @param s
 * @returns Whether `s` is parsable to boolean
 */
export function isParsableToBoolean(s: unknown): s is string {
  return typeof s === "string" && /true|false|0|1/i.test(s);
}
