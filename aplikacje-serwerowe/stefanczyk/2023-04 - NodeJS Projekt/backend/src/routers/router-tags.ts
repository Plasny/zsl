import { IncomingMessage, ServerResponse } from "http";
import { check, getBody, returnJSON, returnMessage } from "./helperFunctions";
import tagsStore from "../models/tagsStore";

/**
 * Function with router for tags api
 */
export default async function tagsRouter(
  req: IncomingMessage,
  res: ServerResponse
) {
  if (!req.url) {
    res.writeHead(500);
    res.write("Something went wrong");
    res.end();

    return;
  }

  let id;
  let body;

  switch (true) {
    case check(req, /^\/api\/tags$/, "POST"):
      body = (await getBody(req)) as { name?: string };

      if (body.name) {
        returnJSON(res, tagsStore.newTag(body.name));
      } else {
        returnMessage(res, "Tag name not provided!", 400);
      }

      break;

    case check(req, /^\/api\/tags$/, "GET"):
      returnJSON(res, tagsStore.getAllTags());
      break;

    case check(req, /^\/api\/tags\/raw$/, "GET"):
      returnJSON(res, tagsStore.getRawTags());
      break;

    case check(req, /^\/api\/tags/, "GET"):
      id = parseInt(req.url.replace(/^\/api\/tags\//, ""));
      returnJSON(res, tagsStore.getTagById(id));
      break;

    default:
      res.writeHead(404);
      res.write("Page not found");
      res.end();
  }
}
