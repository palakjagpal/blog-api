import express from "express";
import { getUserProfile, toggleFollowUser, getFollowingFeed, getFollowers,
  getFollowing } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/feed", protect, getFollowingFeed);

router.get("/profile/:userId", getUserProfile);

router.put("/follow/:userId", protect, toggleFollowUser);

router.get("/followers/:userId", getFollowers);
router.get("/following/:userId", getFollowing);


export default router;