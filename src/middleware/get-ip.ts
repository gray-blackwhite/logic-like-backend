import { NextFunction, Request, Response } from "express";

const extractIp = function (req: Request): string | undefined {
  let ipRaw =
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.headers["cf-connecting-ip"] ||
    req.socket?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.socket?.remoteAddress;

  if (typeof ipRaw === "string") {
    return ipRaw;
  }

  if (Array.isArray(ipRaw) && ipRaw.length > 0) {
    return ipRaw[0];
  }

  return undefined;
};

const getIPInternal = function (req: Request): string | undefined {
  const ip = extractIp(req);
  if (!ip) {
    return ip;
  }

  if (ip.indexOf(":") > -1 && ip.indexOf(".") > 0) {
    return ip.replace("::ffff:", "");
  }

  return ip;
};

export const getIP = function (req: Request, _res: Response, next: NextFunction): void {
  const ip = getIPInternal(req);
  if (!ip) {
    _res.status(400).send("Bad Request").end();
  } else {
    req.clientIp = ip;
    next();
  }
};
