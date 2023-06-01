import { IncomingMessage, ServerResponse } from "http";
import { check, getBody, returnJSON } from "./helperFunctions";
import users from "../models/users";

export default async function usersRouter(
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
    case check(req, /^\/api\/users\/register$/, "POST"): {
      const body = (await getBody(req)) as {
        name?: string;
        surname?: string;
        email?: string;
        password?: string;
      };

      if (body.name === undefined) {
        returnJSON(res, {
          error: true,
          httpCode: 400,
          message: "[name] not provided or in wrong format",
        });
        break;
      }
      if (body.surname === undefined) {
        returnJSON(res, {
          error: true,
          httpCode: 400,
          message: "[surname] not provided or in wrong format",
        });
        break;
      }
      if (body.email === undefined) {
        returnJSON(res, {
          error: true,
          httpCode: 400,
          message: "[email] not provided or in wrong format",
        });
        break;
      }
      if (body.password === undefined) {
        returnJSON(res, {
          error: true,
          httpCode: 400,
          message: "[password] not provided or in wrong format",
        });
        break;
      }

      returnJSON(
        res,
        await users.registerUser(
          body.name,
          body.surname,
          body.email,
          body.password
        )
      );
      break;
    }

    case check(req, /^\/api\/users\/confirm\//, "GET"): {
      const token = req.url.replace(/^\/api\/users\/confirm\//, "");
      returnJSON(res, users.confirmUser(token));
      break;
    }

    case check(req, /^\/api\/users\/login$/, "POST"): {
      const body = (await getBody(req)) as { email: string; password: string };
      const response = await users.loginUser(body.email, body.password);
      let code: number = 200;

      if (response.hasOwnProperty("httpCode") && response.httpCode != undefined) {
        code = response.httpCode!;
        delete response.httpCode;
      } else {
        res.setHeader("Authorization", "Bearer " + response.returnValue);
      }

      res.writeHead(code, { "content-type": "application/json;charset=utf-8" });
      res.end(JSON.stringify(response));
      break;
    }

    default:
      res.writeHead(404);
      res.write("Page not found");
      res.end();
  }
}
