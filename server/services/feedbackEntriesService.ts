import type { FeedbackType } from "@/generated/prisma/enums.js";
import { sendNewFeedbackEmail } from "@/lib/email.js";
import { prisma } from "@/lib/prisma.js";

export const feedbackEntriesService = {
  async createFeedbackEntry(userId: number, title: string, content: string, type: FeedbackType) {
    const feedbackEntry = await prisma.feedbackEntry.create({
      data: { userId, title, content, type },
      include: { user: true },
    });

    await sendNewFeedbackEmail(
      feedbackEntry.user.name ?? feedbackEntry.user.email,
      feedbackEntry.type,
      feedbackEntry.title,
      feedbackEntry.content
    );

    return feedbackEntry;
  },
};
