import bcrypt from "bcrypt";
import crypto from "crypto";
import { addDays } from "date-fns";
import createHttpError from "http-errors";
import { prisma } from "../lib/prisma.js";
import { sendVerificationEmail } from "../lib/email.js";

export const sessionsService = {
  async authenticate(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw createHttpError(401, "Invalid email or password");
    }

    if (!user.password) {
      throw createHttpError(401, "User has no password");
    }

    if (!user.verified) {
      throw createHttpError(403, "Please verify your email before signing in");
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      throw createHttpError(401, "Invalid email or password");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return user;
  },

  async createSession(userId: number) {
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = addDays(new Date(), 30);

    const session = await prisma.session.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() },
    });

    return session;
  },

  async deleteSession(token: string) {
    return prisma.session.delete({
      where: { token },
    });
  },

  async findSession(token: string) {    
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      throw createHttpError(401, "Invalid or expired session");
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { lastLoginAt: new Date() },
    });

    return session;
  },

  async register(email: string, password: string, name: string) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw createHttpError(400, "User already exists");
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpiresAt = addDays(new Date(), 1);

    const user = await prisma.user.create({
      data: {
        email,
        password: await bcrypt.hash(password, 10),
        name,
        verificationToken,
        verificationExpiresAt,
      },
    });

    const clientUrl = process.env["CORS_ORIGIN"] ?? "http://localhost:3000";
    const verificationUrl = `${clientUrl}/verify?token=${verificationToken}`;
    await sendVerificationEmail(email, name, verificationUrl);

    return { user };
  },

  async verifyEmail(token: string) {
    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user) {
      throw createHttpError(400, "Invalid or expired verification link");
    }

    if (user.verificationExpiresAt && user.verificationExpiresAt < new Date()) {
      throw createHttpError(400, "Verification link has expired");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verified: true,
        verificationToken: null,
        verificationExpiresAt: null,
      },
    });

    return user;
  },
};