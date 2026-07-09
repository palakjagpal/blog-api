import express from "express";
import { addComment, getBlogComments } from "../controllers/commentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:blogId", getBlogComments);

router.post("/:blogId", protect, addComment);

export default router;