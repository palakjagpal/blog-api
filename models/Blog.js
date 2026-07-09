import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "BlogUser", required: true },
  content: { type: String, required: true },
  coverImage: { type: String, default: "" },
  tags: [String],
  status: { 
    type: String, 
    enum: ["draft", "published"], 
    default: "draft" 
  },
  views: { type: Number, default: 0 }, 
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "BlogUser" }], 
  createdAt: { type: Date, default: Date.now },
});

blogSchema.index({ title: "text", content: "text" });

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;