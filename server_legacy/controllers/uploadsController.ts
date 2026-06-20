import type { Request, Response } from "express";
import storageService from "@/services/storageServices.js";

export const getUpload = async (req: Request, res: Response) => {
  const filename = req.params["filename"] as string;

  if (!filename) {
    return res.status(400).json({ error: "Filename is required" });
  }

  const buffer = await storageService.getFile(filename);
  if (!buffer) {
    return res.status(404).json({ error: "File not found" });
  }

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  return res.send(buffer);
};
