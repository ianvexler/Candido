import { Router } from "express";
import * as sessionsController from "../controllers/sessionsController.js";

const router = Router();

router.post("/", sessionsController.login);
router.delete("/", sessionsController.logout);

export default router;