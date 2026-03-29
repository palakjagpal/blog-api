// app.js

import blogRoutes from "./routes/blogRoutes.js";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors()); // Enable CORS for all routes
  
// Middleware
app.use(express.json()); // Parse JSON bodies

const MONGODB_URI = process.env.MONGO_URL;
const PORT = process.env.PORT || 3000;

// Connect to MongoDB using Mongoose
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully ! (via Mongoose)"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/blogs", blogRoutes);

app.get("/",(req,res) =>{
  res.send("<h1>Blog API running....</h1>");
  console.log("Blog API running");
})

// Start server
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));

/*
-------------------------------------------
WITHOUT MONGOOSE:

import { MongoClient } from "mongodb";
const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("blogDB");
const blogsCollection = db.collection("blogs");
-------------------------------------------
*/
