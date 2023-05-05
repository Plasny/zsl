import { IncomingMessage, ServerResponse } from "http";
import { returnMsg } from "../models/types";

// export type ReqExtensioned = IncomingMessage & {
//   body: unknown;
// }

/**
 * Function which sends stringified object as a response
 * @param res
 * @param object Object to convert to json string
 * @param code http response code to use
 */
export function returnJSON(
  res: ServerResponse,
  object: Object,
  code: number = -1
) {
  if (code === -1) {
    // check wheter object is an error message
    if (object.hasOwnProperty('error')) {
      code = 403;
      delete (object as returnMsg).error;
    } else code = 200;
  }

  res.writeHead(code, { "content-type": "application/json;charset=utf-8" });
  res.end(JSON.stringify(object));
}

/**
 * Function which sends formatted message as a response
 * @param res
 * @param message String message
 * @param code HTTP status code to send
 */
export function returnMessage(res: ServerResponse, message: string, code: number = 200) {
  res.writeHead(code, { "content-type": "application/json;charset=utf-8" });
  res.end(JSON.stringify({ message: message }));
}

/**
 * Function which checks whether requests path and method maches with given
 * params
 * @param req
 * @param regex regex for checking path
 * @param method http method
 * @returns true if path and method matches or false if not
 */
export function check(
  req: IncomingMessage,
  regex: RegExp,
  method: string = "NONE"
): boolean {
  const url = new URL("http://" + req.headers.host + req.url);
  const path = url.pathname.replace(/\/$/, "");

  if (method === "NONE" && path.match(regex)) return true;
  if (req.method === method && path.match(regex)) return true;
  return false;
}

/**
 * Function which returns requests body
 * @param req
 * @returns requests body
 */
export async function getBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    try {
      let body = "";

      req.on("data", (part) => {
        body += part.toString();
      });

      req.on("end", () => {
        let json: unknown;
        try {
          json = JSON.parse(body);
        } catch {
          json = {};
        }

        resolve(json);
      });
    } catch (error) {
      reject(error);
    }
  });
}
