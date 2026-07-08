import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  blog: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "BlogUser", required: true },
  content: { type: String, required: true },
  // If this is a reply, parentComment will point to the comment being replied to
  parentComment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null },
  createdAt: { type: Date, default: Date.now },
});

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;