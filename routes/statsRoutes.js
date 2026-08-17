import express from "express";
import { getPublicStats } from "../controllers/statsController.js";
import { publicLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.get("/public", publicLimiter, getPublicStats);

export default router;