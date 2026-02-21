import { Router } from "express";
import * as jobBoardEntriesController from "../controllers/jobBoardEntriesController.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

router.use(requireAuth);

router.get("/", jobBoardEntriesController.getJobBoardEntries);
router.get("/:id", jobBoardEntriesController.getJobBoardEntry);
router.post("/", jobBoardEntriesController.createJobBoardEntry);
router.put("/:id", jobBoardEntriesController.updateJobBoardEntry);
router.delete("/:id", jobBoardEntriesController.deleteJobBoardEntry);

export default router;