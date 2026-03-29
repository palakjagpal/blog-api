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
router.post("/createBlog", createBlog); // Create blog
router.get("/readAll", getAllBlogs); // Read all blogs
router.get("/read/:id", getBlogById); // Read single blog
router.put("/updateBlog/:id", updateBlog); // Update blog
router.delete("/deleteBlog/:id", deleteBlog); // Delete blog

export default router;
