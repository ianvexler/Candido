import "dotenv/config";
import express from "express";
import type { Request, Response } from "express";
import { prisma } from "./lib/prisma.js";

const app = express();

app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send("API is running");
});

app.get("/api/users", async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

const PORT = process.env['PORT'] ?? 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});