import { Router } from "express";
import { getHistoryByRepo, postFallbackMessage } from "../chat/chatController.js";

const router = Router();

router.get("/:repoId", getHistoryByRepo);
router.post("/:repoId", postFallbackMessage);

export default router;
