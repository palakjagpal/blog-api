// routes/blogRoutes.js

import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
} from "../controllers/blogController.js";

import express from "express";

const router = express.Router();

// CRUD routes
router.post("/", createBlog); // Create blog
router.get("/", getAllBlogs); // Read all blogs
router.get("/:id", getBlogById); // Read single blog
router.put("/:id", updateBlog); // Update blog
router.delete("/:id", deleteBlog); // Delete blog

export default router;
