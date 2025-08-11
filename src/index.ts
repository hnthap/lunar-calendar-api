import cors from "cors";
import { config } from "dotenv";
import express from "express";
import { v01Router } from "./v0/1";
import { convertRouter } from "./v0/1/routers/convert.router";
import { helpRouter } from "./v0/1/routers/help.router";
import { v02Router } from "./v0/2";

config();
const PORT = process.env.PORT ?? "3000";

// Export for testing
export const app = express()
  .use(cors())
  .use("/v0/1", v01Router)
  .use("/v0/2", v02Router);

// For backward compatibility with v0.1
app.use("/convert", convertRouter).use("/help", helpRouter); 

const server = app.listen(PORT).on("listening", () => {
  const addressInfo = server.address();
  let address;
  if (typeof addressInfo === "string" || addressInfo === null) {
    // This case handles a Unix socket or a named pipe.
    address = addressInfo;
  } else {
    // This is the common case for a TCP server.
    const host =
      addressInfo.address === "::" ? "localhost" : addressInfo.address;
    address = `http://${host}:${addressInfo.port}`;
  }
  console.log("Server listening at", address);
});
