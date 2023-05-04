import config from "../models/config";
import { IncomingMessage, ServerResponse } from "http";
import { check, returnJSON } from "./helperFunctions";
import formidable from "formidable";
import photoStore from "../models/photoStore";
import { logger } from "../app";

/**
 * Function with router for photos api
 */
export default async function photosRouter(
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
  const form = formidable({
    keepExtensions: true,
    uploadDir: config.storageDir,
  });

  switch (true) {
    case check(req, /^\/api\/photos$/, "POST"):
      form.parse(req, (err, fields, files) => {
        if (err) {
          logger.error(err);
          return;
        }

        returnJSON(
          res,
          photoStore.registerPhoto(
            files.file as formidable.File,
            fields.album as string
          )
        );
      });
      break;

    case check(req, /^\/api\/photos$/, "GET"):
      returnJSON(res, photoStore.getAllPhotos());
      break;

    case check(req, /^\/api\/photos/, "GET"):
      id = req.url.replace(/^\/api\/photos\//, "");
      returnJSON(res, photoStore.getPhoto(id));
      break;

    case check(req, /^\/api\/photos/, "DELETE"):
      id = req.url.replace(/^\/api\/photos\//, "");
      returnJSON(res, photoStore.deletePhoto(id));
      break;

    case check(req, /^\/api\/photos/, "PATCH"):
      id = req.url.replace(/^\/api\/photos\//, "");
      form.parse(req, (err, fields, files) => {
        if (err) {
          logger.error(err);
          return;
        }

        returnJSON(
          res,
          photoStore.changePhoto(
            fields.id as string,
            fields.status as string,
            files.file as formidable.File
          )
        );
      });
      break;

    default:
      res.writeHead(404);
      res.write("Page not found");
      res.end();
  }
}
