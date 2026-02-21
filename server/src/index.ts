import "dotenv/config";
import express from "express";
import type { Request, Response } from "express";
import sessionsRouter from "../routes/sessions.js";

const app = express();

app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send("API is running");
});

app.use("/api/sessions", sessionsRouter);

const PORT = process.env["PORT"] ?? 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
