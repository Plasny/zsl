import { IncomingMessage, ServerResponse } from "http";
import { check, getBody, returnJSON } from "./helperFunctions";
import users from "../models/users";
import type { bufferAndMime, returnMsg } from "../models/types";
import formidable from "formidable";
import config from "../models/config";
import { logger } from "../app";

const form = formidable({
  keepExtensions: true,
  uploadDir: config.storageDir,
});

export default async function profilesRouter(
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
    case check(req, /^\/api\/profile\/picture\//, "GET"): {
      const email = req.url.replace(/^\/api\/profile\/picture\//, "");
      const obj = await users.retriveProfilePicture(email);

      if((obj as returnMsg).message !== undefined) {
        returnJSON(res, obj);
        break;
      }

      res.writeHead(200, {
        "Content-Type": (obj as bufferAndMime).mime!,
        "Content-Disposition":
          "attachment;filename=" + (obj as bufferAndMime).name,
      });
      res.write((obj as bufferAndMime).file);
      res.end();
      break;
    }

    case check(req, /^\/api\/profile\/picture$/, "POST"):
      const token = req.headers.authorization!.replace("Bearer ", "");
      form.parse(req, (err, fields, files) => {
        if (err) {
          logger.error(err);
          return;
        }

        returnJSON(
          res,
          users.setProfilePicture(
            token,
            (files.file as formidable.File).mimetype ?? "",
            (files.file as formidable.File).newFilename,
          )
        );
      });
      break;

    case check(req, /^\/api\/profile\//, "GET"): {
      const email = req.url.replace(/^\/api\/profile\//, "");
      returnJSON(res, users.retriveProfileData(email));
      break;
    }

    case check(req, /^\/api\/profile$/, "PATCH"): {
      const token = req.headers.authorization!.replace("Bearer ", "");
      const body = await getBody(req) as {newName: string, newSurname: string, newEmail: string, newAboutMe: string}
      console.log(body)
      returnJSON(res, users.changeData(token, body.newName, body.newSurname, body.newEmail, body.newAboutMe));
      break;
    }

    default:
      res.writeHead(404);
      res.write("Page not found");
      res.end();
  }
}
