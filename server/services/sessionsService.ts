import bcrypt from "bcrypt";
import crypto from "crypto";
import { addDays } from "date-fns";
import createHttpError from "http-errors";
import { prisma } from "../lib/prisma.js";

export const sessionsService = {
  async authenticate(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw createHttpError(401, "Invalid email or password");
    }

    if (!user.password) {
      throw createHttpError(401, "User has no password");
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      throw createHttpError(401, "Invalid email or password");
    }

    return user;
  },

  async createSession(userId: number) {
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = addDays(new Date(), 30);

    return prisma.session.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
  },

  async deleteSession(token: string) {
    return prisma.session.delete({
      where: { token },
    });
  },

  async findSession(token: string) {
    return prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });
  },

  async register(email: string, password: string, name: string) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw createHttpError(400, "User already exists");
    }

    const user = await prisma.user.create({
      data: {
        email,
        password: await bcrypt.hash(password, 10),
        name,
      },
    });
    
    const session = await this.createSession(user.id);
    return { user, session };
  }
};