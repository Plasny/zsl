import * as http from "http";
import * as tracer from "tracer";
import router from "./routers/main";
import config from "./models/config";

const PORT = 5555;
export const logger = tracer.colorConsole();
logger.info(config)

http
  .createServer((req, res) => router(req, res))
  .listen(PORT, () => logger.info("Server running on port:", PORT));
