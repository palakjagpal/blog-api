import express from "express";
import { addComment, getBlogComments } from "../controllers/commentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public: view discussion threads
router.get("/:blogId", getBlogComments);

// Protected: must be logged in to leave a comment/reply
router.post("/:blogId", protect, addComment);

export default router;