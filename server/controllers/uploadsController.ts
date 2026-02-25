import type { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const getUpload = async (req: Request, res: Response) => {
  const { filename } = req.params;

  if (!filename) {
    return res.status(400).json({ error: "Filename is required" });
  }

  const filePath = path.join(__dirname, "../uploads", filename as string);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "File not found" });
  }

  return res.download(filePath);
};
