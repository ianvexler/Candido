import { prisma } from "@/lib/prisma.js";
import type { User } from "@/generated/prisma/client.js";
import createHttpError from "http-errors";

export const userService = {
  async updateUser(userId: number, setupCompleted: boolean): Promise<User> {
    return await prisma.user.update({
      where: { id: userId },
      data: { setupCompleted },
    });
  },

  async getUsers(currentUserId: number): Promise<User[]> {
    const currentUser = await prisma.user.findUnique({ 
      where: { 
        id: currentUserId 
      }
    });

    if (!currentUser?.admin) {
      throw createHttpError(403, "You are not authorized to access this resource");
    }

    return await prisma.user.findMany();
  },
};