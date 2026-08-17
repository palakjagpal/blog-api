
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import blogRoutes from "./routes/blogRoutes.js";
import authRoutes from "./routes/authRoutes.js"; 
import commentRoutes from "./routes/commentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";

dotenv.config();

const app = express();

app.use(cors()); 
app.use(express.json()); 

const MONGODB_URI = process.env.MONGO_URL;
const PORT = process.env.PORT || 3000;

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully ! (via Mongoose)"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/auth", authRoutes); 
app.use("/api/blogs", blogRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/stats", statsRoutes); 

app.get("/", (req, res) => {
  res.send("<h1>Blog API running....</h1>");
});

app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));