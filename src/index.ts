import { config } from "dotenv";
import { app } from "./app";

config();
const PORT = process.env.PORT ?? "3000";

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
