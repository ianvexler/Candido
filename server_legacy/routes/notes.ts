import { getNotes, createNote, updateNote, deleteNote } from "@/controllers/notesController.js";
import { requireAuth } from "@/middleware/requireAuth.js";
import { Router } from "express";

const router = Router();

router.use(requireAuth);

router.get("/:jobBoardEntryId", getNotes);
router.post("/", createNote);
router.put("/", updateNote);
router.delete("/", deleteNote);

export default router;