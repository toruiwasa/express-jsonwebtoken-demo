import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "./authService";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.accesstoken as string;
  try {
    const payload = verifyAccessToken(token);
    req.userId = payload.userId as string;
    next();
  } catch {
    res.status(401).send("Unauthorized");
  }
};
