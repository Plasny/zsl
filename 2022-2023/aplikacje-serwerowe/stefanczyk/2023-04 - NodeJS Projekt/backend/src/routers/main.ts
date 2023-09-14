import { IncomingMessage, ServerResponse } from "http";
import { check } from "./helperFunctions";
import photosRouter from "./router-photos";
import tagsRouter from "./router-tags";
import usersRouter from "./router-users";
import { verifyRequest } from "../models/users";
import config from "../models/config";
import profilesRouter from "./router-profiles";

function checkAccess(req: IncomingMessage): boolean {
  if(config.noAuth) return true;

  if (req.headers.authorization === undefined) return false;

  const token = req.headers.authorization.replace("Bearer ", "");
  if (verifyRequest(token)) return true;

  return false;
}

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

  if (check(req, /^\/api\/users/)) {
    await usersRouter(req, res);
  } else if (!checkAccess(req)) {
    res.writeHead(401);
    res.write("You are unauthorized.");
    res.end();
  } else if (check(req, /^\/api\/photos/)) {
    await photosRouter(req, res);
  } else if (check(req, /^\/api\/tags/)) {
    await tagsRouter(req, res);
  } else if (check(req, /^\/api\/profile/)) {
    await profilesRouter(req, res);
  } else {
    res.writeHead(404);
    res.write("Page not found");
    res.end();
  }
}
