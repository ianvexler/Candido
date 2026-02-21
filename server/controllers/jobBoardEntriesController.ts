import { JobStatus } from "@/generated/prisma/enums.js";
import { jobBoardEntriesService } from "@/services/jobBoardEntriesService.js";
import type { Request, Response } from "express";

export const getJobBoardEntries = async (req: Request, res: Response) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const jobBoardEntries = await jobBoardEntriesService.getJobBoardEntries(userId, JobStatus.PENDING);
  return res.status(200).json({ jobBoardEntries });
};

export const getJobBoardEntry = async (req: Request, res: Response) => {
  const { id, userId } = req.body;

  const jobBoardEntry = await jobBoardEntriesService.getJobBoardEntry(userId, id);
  return res.status(200).json({ jobBoardEntry });
};

export const createJobBoardEntry = async (req: Request, res: Response) => {
  const { userId, title, company, location, salary, url, description, status } = req.body;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const jobBoardEntry = await jobBoardEntriesService.createJobBoardEntry(userId, title, company, location, salary, url, description, status);
  return res.status(200).json({ jobBoardEntry });
};

export const updateJobBoardEntry = async (req: Request, res: Response) => {
  const { userId, id, title, company, location, salary, url, description, status } = req.body;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const jobBoardEntry = await jobBoardEntriesService.updateJobBoardEntry(userId, id, title, company, location, salary, url, description, status);
  return res.status(200).json({ jobBoardEntry });
};

export const deleteJobBoardEntry = async (req: Request, res: Response) => {
  const { userId, id } = req.body;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const jobBoardEntry = await jobBoardEntriesService.deleteJobBoardEntry(userId, id);
  return res.status(200).json({ jobBoardEntry });
};
