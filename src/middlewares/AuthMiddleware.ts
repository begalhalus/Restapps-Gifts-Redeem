import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import response from "../helpers/response";

export const auth = (req: Request, res: Response, next: NextFunction): any => {
  if (!req.headers.authorization) {
    return response.auth("", "Required Token", res);
  }

  let secretKey = process.env.TOKEN_SECRET || "secret";
  const token: string = req.headers.authorization.split(" ")[1];

  try {
    const credential: string | object = jwt.verify(token, secretKey);

    if (credential) {
      req.app.locals.credential = credential;
      return next();
    }

    return response.auth("", "Invalid Token", res);
  } catch (error) {
    return response.failed(error, "Error Token", res);
  }
};
