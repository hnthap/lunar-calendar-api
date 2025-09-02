import cors from "cors";
import express from "express";
import { v01Router } from "./v0/1";
import { convertRouter } from "./v0/1/routers/convert.router";
import { helpRouter } from "./v0/1/routers/help.router";
import { v02Router } from "./v0/2";

export const app = express()
  .use(cors())
  .use("/v0/1", v01Router)
  .use("/v0/2", v02Router);

// For backward compatibility with v0.1
app.use("/convert", convertRouter).use("/help", helpRouter);
