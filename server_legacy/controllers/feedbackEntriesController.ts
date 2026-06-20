import { feedbackEntriesService } from "@/services/feedbackEntriesService.js";
import type { Request, Response } from "express";

export const createFeedbackEntry = async (req: Request, res: Response) => {
  const { title, content, type } = req.body;
  const userId = req.user!.id;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const feedbackEntry = await feedbackEntriesService.createFeedbackEntry(userId, title, content, type);
  return res.status(200).json({ feedbackEntry });
};

export const getFeedbackEntries = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const feedbackEntries = await feedbackEntriesService.getFeedbackEntries(userId);
  return res.status(200).json({ feedbackEntries });
};