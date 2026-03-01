import { JobStatus } from "@/generated/prisma/enums.js";
import { prisma } from "../lib/prisma.js";
import createHttpError from "http-errors";
import storageService from "./storageServices.js";

export const jobBoardEntriesService = {
  async getJobBoardEntries(userId: number) {
    return await prisma.jobBoardEntry.findMany({ 
      where: { 
        userId 
      }, 
      include: { 
        jobBoardTags: true 
      } 
    });
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
    const { _max } = await prisma.jobBoardEntry.aggregate({
      where: { userId, status },
      _max: { number: true },
    });
    const number = ((_max?.number ?? 0) + 1);

    return await prisma.jobBoardEntry.create({
      data: {
        userId,
        title,
        company,
        location,
        salary,
        url,
        description,
        status,
        number: number + 1,
      },
    });
  },

  async bulkImportJobBoardEntries(
    userId: number,
    entries: { title: string; company: string; location?: string; salary?: string; url?: string; description?: string; status: JobStatus }[]
  ) {
    return await prisma.$transaction(async (tx) => {
      const created: Awaited<ReturnType<typeof tx.jobBoardEntry.create>>[] = [];
      const statusMaxNumber = new Map<JobStatus, number>();

      for (const entry of entries) {
        const status = entry.status ?? JobStatus.PENDING;
        let nextNumber: number;

        if (statusMaxNumber.has(status)) {
          nextNumber = statusMaxNumber.get(status)! + 1;
        } else {
          const { _max } = await tx.jobBoardEntry.aggregate({
            where: { userId, status },
            _max: { number: true },
          });

          nextNumber = ((_max?.number ?? 0) + 1);
        }
        statusMaxNumber.set(status, nextNumber);

        const createdEntry = await tx.jobBoardEntry.create({
          data: {
            userId,
            title: entry.title,
            company: entry.company,
            location: entry.location ?? "",
            salary: entry.salary ?? "",
            url: entry.url ?? "",
            description: entry.description ?? "",
            status,
            number: nextNumber,
          },
        });
        created.push(createdEntry);
      }

      return created;
    });
  },

  async updateJobBoardEntry(userId: number, id: number, title: string, company: string, location: string, salary: string, url: string, description: string, status: JobStatus, number: number, tagNames?: string[]) {
    const currentEntry = await prisma.jobBoardEntry.findUnique({ where: { id } });

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

    const updateData: Parameters<typeof prisma.jobBoardEntry.update>[0]["data"] = {
      title,
      company,
      location,
      salary,
      url,
      description,
      status,
      number: number,
    };

    if (tagNames !== undefined) {
      const tagNamesTrimmed = tagNames.map((n) => n.trim()).filter(Boolean);
      const tags = await Promise.all(
        tagNamesTrimmed.map(async (name) => {
          const existing = await prisma.jobBoardTag.findUnique({
            where: { userId_name: { userId, name } },
          });
          if (existing) return existing;
          return prisma.jobBoardTag.create({
            data: { userId, name },
          });
        })
      );
      updateData.jobBoardTags = { set: tags.map((t) => ({ id: t.id })) };
    }

    return await prisma.jobBoardEntry.update({
      where: { id },
      data: updateData,
      include: { jobBoardTags: true },
    });
  },

  async deleteJobBoardEntry(userId: number, id: number) {
    const currentEntry = await prisma.jobBoardEntry.findUnique({ where: { id } });

    if (!currentEntry) {
      throw createHttpError(404, "Job board entry not found");
    }

    if (currentEntry.userId !== userId) {
      throw createHttpError(403, "You are not authorized to delete this job board entry");
    }

    const { status, number: deletedNumber } = currentEntry;

    await prisma.$transaction(async (tx) => {
      await tx.jobBoardEntry.delete({ where: { id } });

      const entriesToRenumber = await tx.jobBoardEntry.findMany({
        where: { userId, status, number: { gt: deletedNumber } },
        orderBy: { number: "asc" },
      });

      for (const [i, entry] of entriesToRenumber.entries()) {
        await tx.jobBoardEntry.update({
          where: { id: entry.id },
          data: { number: deletedNumber + i },
        });
      }
    });

    return currentEntry;
  },

  async uploadCv(userId: number, id: number, cvText?: string, cvFile?: Express.Multer.File) {
    const currentEntry = await prisma.jobBoardEntry.findUnique({ where: { id }});

    if (!currentEntry) {
      throw createHttpError(404, "Job board entry not found");
    }

    if (currentEntry.userId !== userId) {
      throw createHttpError(403, "You are not authorized to upload a CV for this job board entry");
    }

    if (cvText) {
      return await prisma.jobBoardEntry.update({
        where: { id },
        data: {
          cvText,
          cvFilename: null,
          cvKey: null,
        },
      });
    } else if (cvFile) {
      const ext = cvFile.originalname?.split(".").pop() ?? "pdf";
      const key = `${Date.now()}-${Math.round(Math.random() * 1E9)}.${ext}`;
      const cvOriginalFilename = cvFile.originalname;

      if (ext !== "pdf") {
        throw createHttpError(400, "Please upload a valid PDF file");
      }

      await storageService.upload(key, cvFile.buffer);

      return await prisma.jobBoardEntry.update({
        where: { id },
        data: {
          cvText: null,
          cvKey: key,
          cvFilename: cvOriginalFilename ?? null,
        },
      });
    } else {
      return await prisma.jobBoardEntry.update({
        where: { id },
        data: {
          cvText: null,
          cvFilename: null,
          cvKey: null,
        },
      });
    }
  },

  async uploadCoverLetter(userId: number, id: number, coverLetterText?: string, coverLetterFile?: Express.Multer.File) {
    const currentEntry = await prisma.jobBoardEntry.findUnique({ where: { id }});

    if (!currentEntry) {
      throw createHttpError(404, "Job board entry not found");
    }

    if (currentEntry.userId !== userId) {
      throw createHttpError(403, "You are not authorized to upload a CV for this job board entry");
    }

    if (coverLetterText) {
      return await prisma.jobBoardEntry.update({
        where: { id },
        data: {
          coverLetterText,
          coverLetterFilename: null,
          coverLetterKey: null,
        },
      });
    } else if (coverLetterFile) {
      const ext = coverLetterFile.originalname?.split(".").pop() ?? "pdf";
      const key = `${Date.now()}-${Math.round(Math.random() * 1E9)}.${ext}`;
      const coverLetterOriginalFilename = coverLetterFile.originalname;

      if (ext !== "pdf") {
        throw createHttpError(400, "Please upload a valid PDF file");
      }

      await storageService.upload(key, coverLetterFile.buffer);

      return await prisma.jobBoardEntry.update({
        where: { id },
        data: {
          coverLetterText: null,
          coverLetterKey: key,
          coverLetterFilename: coverLetterOriginalFilename ?? null,
        },
      });
    } else {
      return await prisma.jobBoardEntry.update({
        where: { id },
        data: {
          coverLetterText: null,
          coverLetterFilename: null,
          coverLetterKey: null,
        },
      });
    }
  },
};