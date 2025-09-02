import express from "express";
import { g2lRouter } from "./routers/g2l.router";
import { helpRouter, redirectToHelp } from "./routers/help.router";
import { l2gRouter } from "./routers/l2g.router";

export const v02Router = express
  .Router()
  .use("/", redirectToHelp)
  .use("/g2l", g2lRouter)
  .use("/l2g", l2gRouter)
  .use("/help", helpRouter);
