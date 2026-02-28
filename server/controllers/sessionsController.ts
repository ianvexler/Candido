import type { Request, Response } from "express";
import { sessionsService } from "../services/sessionsService.js";
import { getToken } from "@/middleware/requireAuth.js";

const AUTH_TOKEN = "auth_token";

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

  const { user } = await sessionsService.register(email, password, name);
  const { password: _p, verificationToken: _vt, verificationExpiresAt: _ve, ...safeUser } = user;

  return res.status(201).json({
    user: safeUser,
    message: "Please check your email to verify your account",
  });
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.query;

  if (!token || typeof token !== "string") {
    return res.status(400).json({ error: "Verification token is required" });
  }

  const user = await sessionsService.verifyEmail(token);
  const { password: _p, verificationToken: _vt, verificationExpiresAt: _ve, ...safeUser } = user;

  return res.status(200).json({
    user: safeUser,
    message: "Email verified successfully",
  });
};

export const logout = async (req: Request, res: Response) => {
  const token = getToken(req);
  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
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
