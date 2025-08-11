import express from "express";
import { convertRouter } from "./routers/convert.router";
import { helpRouter } from "./routers/help.router";

export const v01Router = express
  .Router()
  .use("/convert", convertRouter)
  .use("/help", helpRouter);
