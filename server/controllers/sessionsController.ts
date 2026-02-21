import type { Request, Response } from "express";
import { sessionsService } from "../services/sessionsService.js";

const AUTH_TOKEN = "auth_token";

const getToken = (req: Request): string | undefined => {
  return (
    req.headers.authorization?.replace("Bearer ", "") ??
    req.cookies?.[AUTH_TOKEN]
  );
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const user = await sessionsService.authenticate(email, password);
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const session = await sessionsService.createSession(user.id);
  const { password: _p, ...safeUser } = user;

  res.cookie(AUTH_TOKEN, session.token, {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30 * 1000,
    path: "/",
  });

  return res.status(201).json({
    user: safeUser,
    token: session.token,
    expiresAt: session.expiresAt,
  });
};

export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: "Email, password and name are required" });
  }

  const { user, session } = await sessionsService.register(email, password, name);
  res.cookie(AUTH_TOKEN, session.token, {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30 * 1000,
    path: "/",
  });

  return res.status(201).json({
    user: user,
    token: session.token,
    expiresAt: session.expiresAt,
  });
};

export const logout = async (req: Request, res: Response) => {
  const token = getToken(req);
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  await sessionsService.deleteSession(token);
  res.clearCookie(AUTH_TOKEN, { path: "/" });
  return res.status(200).json({ message: "Logged out successfully" });
};

export const me = async (req: Request, res: Response) => {
  const token = getToken(req);
  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const session = await sessionsService.findSession(token);
  if (!session) {
    return res.status(401).json({ error: "Invalid or expired session" });
  }

  const { password: _p, ...safeUser } = session.user;
  return res.status(200).json({ user: safeUser });
};