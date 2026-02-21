import "dotenv/config";
import cors from "cors";
import express from "express";
import type { Request, Response } from "express";
import sessionsRouter from "../routes/sessions.js";
import jobBoardEntriesRouter from "../routes/jobBoardEntries.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

app.use(cookieParser());

app.get("/", (_req: Request, res: Response) => {
  res.send("API is running");
});

app.use("/api/sessions", sessionsRouter);
app.use("/api/job-board-entries", jobBoardEntriesRouter);

const PORT = process.env["PORT"] ?? 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
