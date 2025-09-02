import cors from "cors";
import express from "express";
import { v01Router } from "./v0/1";
import { convertRouter } from "./v0/1/routers/convert.router";
import { helpRouter } from "./v0/1/routers/help.router";
import { v02Router } from "./v0/2";
import { redirectToHelp } from "./v0/2/routers/help.router";

export const app = express().use(cors());

// API v0.2
app.use("/", redirectToHelp).use("/v0/2", v02Router);

// For backward compatibility with v0.1
app
  .use("/v0/1", v01Router)
  .use("/convert", convertRouter)
  .use("/help", helpRouter);
