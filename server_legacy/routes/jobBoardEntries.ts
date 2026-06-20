import { Router } from "express";
import * as jobBoardEntriesController from "../controllers/jobBoardEntriesController.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { uploadMiddleware } from "../middleware/upload.js";

const router = Router();

router.use(requireAuth);

router.get("/", jobBoardEntriesController.getJobBoardEntries);
router.post("/import", jobBoardEntriesController.bulkImportJobBoardEntries);
router.post("/", jobBoardEntriesController.createJobBoardEntry);
router.get("/stats", jobBoardEntriesController.getJobBoardEntryStats);
router.get("/:id", jobBoardEntriesController.getJobBoardEntry);
router.put("/:id", jobBoardEntriesController.updateJobBoardEntry);
router.delete("/:id", jobBoardEntriesController.deleteJobBoardEntry);
router.post("/:id/cv", uploadMiddleware, jobBoardEntriesController.uploadCv);
router.post("/:id/cover-letter", uploadMiddleware, jobBoardEntriesController.uploadCoverLetter);

export default router;