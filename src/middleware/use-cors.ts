import { NextFunction, Request, Response } from "express";

export const cors = (origins = "*") => {
  const cors = (_req: Request, res: Response, next: NextFunction) => {
    res.set("Access-Control-Allow-Origin", origins);
    next();
  };

  return cors;
};
