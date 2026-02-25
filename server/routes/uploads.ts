import { Router } from "express";
import * as uploadsController from "../controllers/uploadsController.js";
import { requireAuth } from "@/middleware/requireAuth.js";

const router = Router();

router.use(requireAuth);

router.get("/:filename", uploadsController.getUpload);

export default router;