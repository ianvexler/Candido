import { Router } from "express";
import * as feedbackEntriesController from "../controllers/feedbackEntriesController.js";
import { requireAuth } from "@/middleware/requireAuth.js";

const router = Router();

router.use(requireAuth);

router.post("/", feedbackEntriesController.createFeedbackEntry);
router.get("/", feedbackEntriesController.getFeedbackEntries);

export default router;