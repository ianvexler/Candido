import type { Request, Response } from "express";
import { sessionsServices } from "../services/sessionsServices.js";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const user = await sessionsServices.authenticate(email, password);
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const session = await sessionsServices.createSession(user.id);
  return res.status(201).json({ 
    user: user,
    token: session.token,
    expiresAt: session.expiresAt,
  });
}

export const logout = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  await sessionsServices.deleteSession(email);
  return res.status(200).json({ message: "Logged out successfully" });
}