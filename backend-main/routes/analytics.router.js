import { Router } from "express";
import { getRepositoryAnalytics } from "../controllers/analyticsController.js";
import { getRepositoryHealth } from "../controllers/healthController.js";

const router = Router();

router.get("/:repoId", getRepositoryAnalytics);
router.get("/:repoId/health", getRepositoryHealth);

export default router;
