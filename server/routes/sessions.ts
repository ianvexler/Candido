import { Router } from "express";
import * as sessionsController from "../controllers/sessionsController.js";

const router = Router();

router.post("/", sessionsController.login);
router.delete("/", sessionsController.logout);
router.get("/me", sessionsController.me);
router.post("/register", sessionsController.register);

export default router;