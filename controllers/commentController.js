import Comment from "../models/Comment.js";
import Blog from "../models/Blog.js";

// 1. Add a Comment or Reply
export const addComment = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { content, parentCommentId } = req.body;
    const userId = req.user.id;

    // Verify the blog exists and is published
    const blog = await Blog.findById(blogId);
    if (!blog || blog.status === "draft") {
      return res.status(404).json({ message: "Blog not found or is a draft" });
    }

    const comment = new Comment({
      blog: blogId,
      author: userId,
      content,
      parentComment: parentCommentId || null, // Stores parent ID if it's a reply
    });

    await comment.save();
    
    // Populate author details before sending back
    const populatedComment = await comment.populate("author", "name email");

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Get Threaded Comments for a Blog
export const getBlogComments = async (req, res) => {
  try {
    const { blogId } = req.params;

    // Fetch all comments for this blog
    const comments = await Comment.find({ blog: blogId })
      .populate("author", "name email")
      .sort({ createdAt: 1 }); // Oldest first

    // Turn flat array into a nested tree structure
    const commentMap = {};
    const rootComments = [];

    // Map all comments by their ID
    comments.forEach((comment) => {
      commentMap[comment._id] = { ...comment._doc, replies: [] };
    });

    // Structure into parents and nested replies
    comments.forEach((comment) => {
      const mappedComment = commentMap[comment._id];
      if (comment.parentComment) {
        // If it has a parent, push it into the parent's replies array
        if (commentMap[comment.parentComment]) {
          commentMap[comment.parentComment].replies.push(mappedComment);
        }
      } else {
        // If no parent, it's a top-level comment
        rootComments.push(mappedComment);
      }
    });

    res.status(200).json(rootComments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};