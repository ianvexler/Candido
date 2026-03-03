import { prisma } from "@/lib/prisma.js";
import createHttpError from "http-errors";

const notesService = {
  async getNotes(userId: number, jobBoardEntryId: number) {
    const jobBoardEntry = await prisma.jobBoardEntry.findUnique({ 
      where: { id: jobBoardEntryId },
      include: {
        jobBoardEntryNotes: true,
      },
    });

    if (!jobBoardEntry) {
      throw createHttpError(404, "Job board entry not found");
    }

    if (jobBoardEntry.userId !== userId) {
      throw createHttpError(403, "You are not authorized to view this job board entry");
    }

    return jobBoardEntry.jobBoardEntryNotes;
  },

  async createNote(userId: number, jobBoardEntryId: number, content: string) {
    return await prisma.jobBoardEntryNotes.create({
      data: { userId, jobBoardEntryId, content },
    });
  },

  async updateNote(id: number, content: string) {
    return await prisma.jobBoardEntryNotes.update({ where: { id }, data: { content } });
  },

  async deleteNote(id: number) {
    return await prisma.jobBoardEntryNotes.delete({ where: { id } });
  }, 
};

export default notesService;