import { jobBoardEntriesService } from "@/services/jobBoardEntriesService.js";
import type { Request, Response } from "express";

export const getJobBoardEntries = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const jobBoardEntries = await jobBoardEntriesService.getJobBoardEntries(userId);
  return res.status(200).json({ jobBoardEntries });
};

export const getJobBoardEntry = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;

  const idNumber = parseInt(id as string);
  const jobBoardEntry = await jobBoardEntriesService.getJobBoardEntry(userId, idNumber);
  return res.status(200).json({ jobBoardEntry });
};

export const createJobBoardEntry = async (req: Request, res: Response) => {
  const { title, company, location, salary, url, description, status } = req.body;
  const userId = req.user!.id;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const jobBoardEntry = await jobBoardEntriesService.createJobBoardEntry(userId, title, company, location, salary, url, description, status);
  return res.status(200).json({ jobBoardEntry });
};

export const updateJobBoardEntry = async (req: Request, res: Response) => {
  const { id, title, company, location, salary, url, description, status, number } = req.body;
  const userId = req.user!.id;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const jobBoardEntry = await jobBoardEntriesService.updateJobBoardEntry(userId, id, title, company, location, salary, url, description, status, number);
  return res.status(200).json({ jobBoardEntry });
};

export const deleteJobBoardEntry = async (req: Request, res: Response) => {
  const { id } = req.body;
  const userId = req.user!.id;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const jobBoardEntry = await jobBoardEntriesService.deleteJobBoardEntry(userId, id);
  return res.status(200).json({ jobBoardEntry });
};

export const uploadCv = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { cvText } = req.body;
  const cvFile = req.file;
  const userId = req.user!.id;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const idNumber = parseInt(id as string);
  const jobBoardEntry = await jobBoardEntriesService.uploadCv(
    userId,
    idNumber,
    cvText,
    cvFile?.filename,
    cvFile?.originalname
  );

  return res.status(200).json({ jobBoardEntry });
};

export const uploadCoverLetter = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { coverLetterText } = req.body;
  const coverLetterFile = req.file;
  const userId = req.user!.id;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const idNumber = parseInt(id as string);
  const jobBoardEntry = await jobBoardEntriesService.uploadCoverLetter(
    userId,
    idNumber,
    coverLetterText,
    coverLetterFile?.filename,
    coverLetterFile?.originalname
  );

  return res.status(200).json({ jobBoardEntry });
};