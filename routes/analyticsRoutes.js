import express from "express";
import { getOwnerDashboardAnalytics } from "../controllers/analyticsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", protect, getOwnerDashboardAnalytics);

export default router;