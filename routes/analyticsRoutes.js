import express from "express";
import { getOwnerDashboardAnalytics } from "../controllers/analyticsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Fetch data for the entire dashboard
router.get("/dashboard", protect, getOwnerDashboardAnalytics);

export default router;