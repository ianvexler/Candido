import { JobStatus } from "@/generated/prisma/enums.js";
import { prisma } from "../lib/prisma.js";
import createHttpError from "http-errors";

export const jobBoardEntriesService = {
  async getJobBoardEntries(userId: number) {
    return await prisma.jobBoardEntry.findMany({ where: { userId } });
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
        number: number + 1,
      },
    });
  },

  async updateJobBoardEntry(userId: number, id: number, title: string, company: string, location: string, salary: string, url: string, description: string, status: JobStatus, number: number) {
    const currentEntry = await prisma.jobBoardEntry.findUnique({ where: { id }});

    if (!currentEntry) {
      throw createHttpError(404, "Job board entry not found");
    }

    if (currentEntry.userId !== userId) {
      throw createHttpError(403, "You are not authorized to update this job board entry");
    }

    const needsReorder = status !== currentEntry.status || number !== currentEntry.number;

    if (needsReorder) {
      // If reordering within the same status, temporarily set to -1 to avoid conflicts
      if (status === currentEntry.status && number !== currentEntry.number) {
        await prisma.jobBoardEntry.update({
          where: { id },
          data: {
            number: -1
          }
        });
      }

      const greaterStatusEntries = await prisma.jobBoardEntry.findMany({
        where: {
          userId,
          status,
          number: { gte: number },
          id: { not: id },
        },
        orderBy: { number: "desc" },
      });

      for (const entry of greaterStatusEntries) {
        await prisma.jobBoardEntry.update({
          where: { id: entry.id },
          data: {
            number: entry.number + 1,
          },
        });
      }
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
        number: number,
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