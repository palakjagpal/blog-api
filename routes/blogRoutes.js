import express from "express";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  toggleLikeBlog, // New Import
} from "../controllers/blogController.js";
import { protect } from "../middleware/authMiddleware.js";
import jwt from "jsonwebtoken";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

const optionalProtect = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: decoded.id };
    } catch (err) {}
  }
  next();
};

router.get("/readAll", getAllBlogs); 
router.get("/read/:id", optionalProtect, getBlogById); 

router.post("/createBlog", protect,upload.single("coverImage"), createBlog); 
router.put("/updateBlog/:id", protect, updateBlog); 
router.delete("/deleteBlog/:id", protect, deleteBlog); 
router.put("/like/:id", protect, toggleLikeBlog); // New Like/Unlike Route

export default router;