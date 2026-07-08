import express from "express";
import { getUserProfile, toggleFollowUser, getFollowingFeed } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected Route: Feed compiled based on user preferences
router.get("/feed", protect, getFollowingFeed);

// Public Route: Read public profile data
router.get("/profile/:userId", getUserProfile);

// Protected Route: Toggle following state
router.put("/follow/:userId", protect, toggleFollowUser);

export default router;