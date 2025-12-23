import { Request, Response, NextFunction } from "express";

export function apiKeyAuth(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.header("Authorization") || req.query.api_key;
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Invalid or missing API key" });
  }
  next();
}
