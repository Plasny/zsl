import http from "http";
import tracer from "tracer";
import router from "./routers/main";
import config from "./models/config";

export const logger = tracer.colorConsole();
logger.info(config);

http
  .createServer((req, res) => router(req, res))
  .listen(config.port, () => logger.info("Server running on port:", config.port));
