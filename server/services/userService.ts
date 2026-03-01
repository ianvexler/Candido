import { prisma } from "@/lib/prisma.js";

export const userService = {
  async updateUser(userId: number, setupCompleted: boolean) {
    return await prisma.user.update({
      where: { id: userId },
      data: { setupCompleted },
    });
  },
}