import mongoose from "mongoose";

const blogUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  bio: { type: String, default: "" }, 
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "BlogUser" }], 
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "BlogUser" }],
  createdAt: { type: Date, default: Date.now },
});

const BlogUser = mongoose.model("BlogUser", blogUserSchema);
export default BlogUser;