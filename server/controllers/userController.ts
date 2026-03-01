import { userService } from "@/services/userService.js";
import type { Request, Response } from "express";

export const updateUser = async (req: Request, res: Response) => {
  const { setupCompleted } = req.body;
  const id = req.user!.id;
  
  const userId = req.user!.id;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const user = await userService.updateUser(id, setupCompleted);
  return res.status(200).json({ user });
};

export const getUsers = async (req: Request, res: Response) => {
  const id = req.user!.id;

  const users = await userService.getUsers(id);
  return res.status(200).json({ users });
};