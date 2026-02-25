import { Router } from "express";
import * as jobBoardEntriesController from "../controllers/jobBoardEntriesController.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { uploadMiddleware } from "../middleware/upload.js";

const router = Router();

router.use(requireAuth);

router.get("/", jobBoardEntriesController.getJobBoardEntries);
router.get("/:id", jobBoardEntriesController.getJobBoardEntry);
router.post("/", jobBoardEntriesController.createJobBoardEntry);
router.put("/:id", jobBoardEntriesController.updateJobBoardEntry);
router.delete("/:id", jobBoardEntriesController.deleteJobBoardEntry);
router.post("/:id/cv", uploadMiddleware, jobBoardEntriesController.uploadCv);
router.post("/:id/cover-letter", uploadMiddleware, jobBoardEntriesController.uploadCoverLetter);

export default router;