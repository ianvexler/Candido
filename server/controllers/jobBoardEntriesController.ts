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

export const bulkImportJobBoardEntries = async (req: Request, res: Response) => {
  const { entries } = req.body;
  const userId = req.user!.id;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  if (!Array.isArray(entries) || entries.length === 0) {
    return res.status(400).json({ error: "Entries array is required and must not be empty" });
  }

  const jobBoardEntries = await jobBoardEntriesService.bulkImportJobBoardEntries(userId, entries);
  return res.status(200).json({ jobBoardEntries });
};

export const updateJobBoardEntry = async (req: Request, res: Response) => {
  const { id, title, company, location, salary, url, description, status, number, tagNames } = req.body;
  const userId = req.user!.id;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const jobBoardEntry = await jobBoardEntriesService.updateJobBoardEntry(userId, id, title, company, location, salary, url, description, status, number, tagNames);
  return res.status(200).json({ jobBoardEntry });
};

export const deleteJobBoardEntry = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const idNumber = parseInt(id as string);
  const jobBoardEntry = await jobBoardEntriesService.deleteJobBoardEntry(userId, idNumber);
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
    cvFile
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
    coverLetterFile
  );

  return res.status(200).json({ jobBoardEntry });
};