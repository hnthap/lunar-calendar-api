import cors from "cors";
import { config } from "dotenv";
import express from "express";
import { convertRouter } from "./routers/convert.router";
import { helpRouter } from "./routers/help.router";

config();
const PORT = process.env.PORT ?? "3000";

// Export for testing
export const app = express()
  .use(cors())
  .use("/convert", convertRouter)
  .use("/help", helpRouter); 

const server = app.listen(PORT).on("listening", () => {
  console.log("Server listening at", server.address());
});
