import config from "../models/config";
import { IncomingMessage, ServerResponse } from "http";
import { check, getBody, returnJSON } from "./helperFunctions";
import formidable from "formidable";
import photoStore from "../models/photoStore";
import { logger } from "../app";
import type { applyFilter, bufferAndMime, returnMsg } from "../models/types";
import { getUserFromToken } from "../models/users";

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

  const form = formidable({
    keepExtensions: true,
    uploadDir: config.storageDir,
  });

  let id;
  let body;
  let url;
  let obj;

  switch (true) {
    /// ---------- tags ----------
    case check(req, /^\/api\/photos\/tags$/, "PATCH"):
      body = (await getBody(req)) as { id: string; tags: string[] };
      returnJSON(res, photoStore.addTagsToPhoto(body.id, body.tags));
      break;

    // probably won't be used
    case check(req, /^\/api\/photos\/tags\/add$/, "PATCH"):
      body = (await getBody(req)) as { id: string; tags: string[] };
      returnJSON(res, photoStore.addTagsToPhoto(body.id, body.tags, false));
      break;

    case check(req, /^\/api\/photos\/tags/, "GET"):
      id = req.url.replace(/^\/api\/photos\/tags\//, "");
      returnJSON(res, photoStore.getPhotosTags(id));
      break;

    /// ---------- metadata ----------
    case check(req, /^\/api\/photos\/metadata/, "GET"):
      id = req.url.replace(/^\/api\/photos\/metadata\//, "");
      id = id.replace(/\?history=.*$/, "");
      url = new URL("http://" + req.headers.host + req.url);

      if (url.searchParams.has("history")) {
        const history = url.searchParams.get("history")!
        obj = await photoStore.getMetadata(id, parseInt(history));
      } else {
        obj = await photoStore.getMetadata(id);
      }

      returnJSON(res, obj)
      break;

    /// ---------- albums ----------
    case check(req, /^\/api\/photos\/album/, "GET"):
      const album = req.url.replace(/^\/api\/photos\/album\//, "");
      returnJSON(res, photoStore.getPhotosInAlbum(album))
      break;

    /// ---------- user ----------
    case check(req, /^\/api\/photos\/user/, "GET"):
      const user = req.url.replace(/^\/api\/photos\/user\//, "");
      returnJSON(res, photoStore.getUsersPhotos(user))
      break;

    /// ---------- filters ----------
    case check(req, /^\/api\/photos\/filters/, "PATCH"):
      body = await getBody(req);
      returnJSON(res, await photoStore.applyFilter((body as applyFilter).photoId, (body as applyFilter).filter, (body as applyFilter).filterArgs))
      break;

    /// ---------- getfile ----------
    case check(req, /^\/api\/photos\/img/, "GET"):
      id = req.url.replace(/^\/api\/photos\/img\//, "");
      id = id.replace(/\?history=.*$/, "");
      url = new URL("http://" + req.headers.host + req.url);

      if (url.searchParams.has("history")) {
        const history = url.searchParams.get("history")!
        obj = await photoStore.getFile(id, parseInt(history));
      } else {
        obj = await photoStore.getFile(id);
      }

      if (obj.hasOwnProperty("error")) {
        delete (obj as returnMsg).error;
        res.writeHead(403, {
          "content-type": "application/json;charset=utf-8",
        });
        res.end(JSON.stringify(obj));
        break;
      }

      res.writeHead(200, {
        "Content-Type": (obj as bufferAndMime).mime ?? "",
        "Content-Disposition":
          "attachment;filename=" + (obj as bufferAndMime).name,
      });
      res.write((obj as bufferAndMime).file);
      res.end();
      break;

    /// ---------- base ----------
    case check(req, /^\/api\/photos$/, "POST"):
      const userId = getUserFromToken(req.headers.authorization!.replace("Bearer ", ""));

      form.parse(req, (err, fields, files) => {
        if (err) {
          logger.error(err);
          return;
        }

        returnJSON(
          res,
          photoStore.registerPhoto(
            files.file as formidable.File,
            fields.album as string,
            userId,
            fields.description as string
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
