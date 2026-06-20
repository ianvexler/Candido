import { Router } from "express";
import * as sessionsController from "../controllers/sessionsController.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

// Public routes
router.post("/", sessionsController.login);
router.post("/register", sessionsController.register);
router.get("/verify", sessionsController.verifyEmail);

// Protected routes
router.delete("/", requireAuth, sessionsController.logout);
router.get("/me", requireAuth, sessionsController.me);

export default router;