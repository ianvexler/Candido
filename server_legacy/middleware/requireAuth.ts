import type { Request, Response, NextFunction } from "express";
import { sessionsService } from "../services/sessionsService.js";

const AUTH_TOKEN = "auth_token";

export const getToken = (req: Request): string | undefined => {
  return (
    req.headers.authorization?.replace("Bearer ", "") ??
    req.cookies?.[AUTH_TOKEN]
  );
};

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const token = getToken(req);
  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  req.token = token;

  const session = await sessionsService.findSession(token);
  if (!session) {
    return res.status(401).json({ error: "Invalid or expired session" });
  }

  // Attach user to request
  req.user = session.user;
  return next();
};