import { IncomingMessage, ServerResponse } from "http";
import { check } from "./helperFunctions";
import photosRouter from "./router-photos";
import tagsRouter from "./router-tags";

/**
 * Function with router which routes reqests to other routers
 * or returns error message
 */
export default async function router(
  req: IncomingMessage,
  res: ServerResponse
) {
  if (!req.url) {
    res.writeHead(500);
    res.write("Something went wrong");
    res.end();

    return;
  }

  switch (true) {
    case check(req, /^\/api\/photos/):
      await photosRouter(req, res);
      break;

    case check(req, /^\/api\/tags/):
      await tagsRouter(req, res);
      break;

    default:
      res.writeHead(404);
      res.write("Page not found");
      res.end();
  }
}
