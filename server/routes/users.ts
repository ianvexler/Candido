import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import * as userController from "../controllers/userController.js";

const router = Router();

router.use(requireAuth);

router.put("/", userController.updateUser);

export default router;