// controllers/blogController.js

import Blog from "../models/Blog.js";

/**
 * Controller functions for Blog routes
 * Handles business logic between Model and Routes
 */

export const createBlog = async (req, res) => {
  try {
    const { title, author, content, tags } = req.body;

    // Using Mongoose
    const blog = new Blog({ title, author, content, tags });
    await blog.save();

    res.status(201).json(blog);

    /* 
    -------------------------------------------
    WITHOUT MONGOOSE:
    const result = await blogsCollection.insertOne({ title, author, content, tags, createdAt: new Date() });
    res.status(201).json(result);
    -------------------------------------------
    */
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find(); // Mongoose
    res.status(200).json(blogs);

    /*
    WITHOUT MONGOOSE:
    const blogs = await blogsCollection.find().toArray();
    res.status(200).json(blogs);
    */
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id); // Mongoose
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json(blog);

    /*
    WITHOUT MONGOOSE:
    import { ObjectId } from "mongodb";
    const blog = await blogsCollection.findOne({ _id: new ObjectId(id) });
    */
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedBlog)
      return res.status(404).json({ message: "Blog not found" });
    res.status(200).json(updatedBlog);

    /*
    WITHOUT MONGOOSE:
    const { ObjectId } = require("mongodb");
    const result = await blogsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: req.body }
    );
    */
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBlog = await Blog.findByIdAndDelete(id);
    if (!deletedBlog)
      return res.status(404).json({ message: "Blog not found" });
    res.status(200).json({ message: "Blog deleted successfully" });

    /*
    WITHOUT MONGOOSE:
    const { ObjectId } = require("mongodb");
    await blogsCollection.deleteOne({ _id: new ObjectId(id) });
    */
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
