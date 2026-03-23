// models/Blog.js

import mongoose from "mongoose";

/**
 * Blog Schema using Mongoose
 * Mongoose automatically provides schema validation, middleware support, and
 * easy CRUD methods like save(), find(), findById(), updateOne(), deleteOne()
 */
const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  content: { type: String, required: true },
  tags: [String], // array of strings
  createdAt: { type: Date, default: Date.now },
});

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;

/* 
-------------------------------------------
HOW TO DO THE SAME WITHOUT MONGOOSE:

import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("blogDB");
const blogsCollection = db.collection("blogs");

Example: Insert a blog:
await blogsCollection.insertOne({
  title: "My First Blog",
  author: "Rameshwer",
  content: "Hello World",
  tags: ["tech", "nodejs"],
  createdAt: new Date()
});

Other CRUD:
- find() => db.collection("blogs").find()
- findOne({ _id: ObjectId(id) })
- updateOne({ _id: ObjectId(id) }, { $set: { ... } })
- deleteOne({ _id: ObjectId(id) })
-------------------------------------------
*/
