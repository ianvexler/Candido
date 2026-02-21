import { JobStatus } from "@/generated/prisma/enums.js";
import { prisma } from "../lib/prisma.js";
import createHttpError from "http-errors";

export const jobBoardEntriesService = {
  async getJobBoardEntries(userId: number, status: JobStatus) {
    return await prisma.jobBoardEntry.findMany({ where: { userId, status } });
  },

  async getJobBoardEntry(userId: number, id: number) {
    const entry = await prisma.jobBoardEntry.findUnique({ where: { id } });

    if (!entry) {
      throw createHttpError(404, "Job board entry not found");
    }

    if (entry.userId !== userId) {
      throw createHttpError(403, "You are not authorized to view this job board entry");
    }

    return entry;
  },

  async createJobBoardEntry(userId: number, title: string, company: string, location: string, salary: string, url: string, description: string, status: JobStatus = JobStatus.PENDING) {
    const number = await prisma.jobBoardEntry.count({ where: { userId, status } });

    return await prisma.jobBoardEntry.create({
      data: {
        userId,
        title,
        company,
        location,
        salary,
        url,
        description,
        number: number,
      },
    });
  },

  async updateJobBoardEntry(userId: number, id: number, title: string, company: string, location: string, salary: string, url: string, description: string, status: JobStatus) {
    const currentEntry = await prisma.jobBoardEntry.findUnique({ where: { id }});

    if (!currentEntry) {
      throw createHttpError(404, "Job board entry not found");
    }

    if (currentEntry.userId !== userId) {
      throw createHttpError(403, "You are not authorized to update this job board entry");
    }

    let newNumber: number = currentEntry.number;
    if (currentEntry.status !== status) {
      const number = await prisma.jobBoardEntry.count({ where: { userId, status } });
      newNumber = number;
    }

    return await prisma.jobBoardEntry.update({
      where: { id },
      data: {
        title,
        company,
        location,
        salary,
        url,
        description,
        status,
        number: newNumber,
      },
    });
  },

  async deleteJobBoardEntry(userId: number, id: number) {
    const currentEntry = await prisma.jobBoardEntry.findUnique({ where: { id }});

    if (!currentEntry) {
      throw createHttpError(404, "Job board entry not found");
    }

    if (currentEntry.userId !== userId) {
      throw createHttpError(403, "You are not authorized to delete this job board entry");
    }

    return await prisma.jobBoardEntry.delete({ where: { id }});
  }
};