import type { Request, Response } from "express";
import notesService from "@/services/notesService.js";

export const getNotes = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { jobBoardEntryId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const jobBoardEntryIdNumber = parseInt(jobBoardEntryId as string);
  const notes = await notesService.getNotes(userId, jobBoardEntryIdNumber);
  return res.status(200).json({ notes });
};

export const createNote = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { jobBoardEntryId, content } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const note = await notesService.createNote(userId, jobBoardEntryId, content);
  return res.status(200).json({ note });
};

export const updateNote = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { id, content } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const note = await notesService.updateNote(id, content);
  return res.status(200).json({ note });
};

export const deleteNote = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { id } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  if (!id) {
    return res.status(400).json({ error: "Note ID is required" });
  }

  const noteId = parseInt(id as string);
  const note = await notesService.deleteNote(noteId);
  return res.status(200).json({ note });
}