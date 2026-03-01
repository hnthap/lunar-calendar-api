import cors from "cors";
import express from "express";
import { v03Router } from "./v0/3";

export const app = express().use(cors());

// API v0.3
app.use("/v0/3", v03Router);
