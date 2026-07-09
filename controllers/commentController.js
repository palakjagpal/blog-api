import Comment from "../models/Comment.js";
import Blog from "../models/Blog.js";

// 1. Add a Comment or Reply
export const addComment = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { content, parentCommentId } = req.body;
    const userId = req.user.id;

    const blog = await Blog.findById(blogId);
    if (!blog || blog.status === "draft") {
      return res.status(404).json({ message: "Blog not found or is a draft" });
    }

    const comment = new Comment({
      blog: blogId,
      author: userId,
      content,
      parentComment: parentCommentId || null, 
    });

    await comment.save();
    
    const populatedComment = await comment.populate("author", "name email");

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBlogComments = async (req, res) => {
  try {
    const { blogId } = req.params;

    const comments = await Comment.find({ blog: blogId })
      .populate("author", "name email")
      .sort({ createdAt: 1 }); // Oldest first

    const commentMap = {};
    const rootComments = [];

    comments.forEach((comment) => {
      commentMap[comment._id] = { ...comment._doc, replies: [] };
    });

    comments.forEach((comment) => {
      const mappedComment = commentMap[comment._id];
      if (comment.parentComment) {
        if (commentMap[comment.parentComment]) {
          commentMap[comment.parentComment].replies.push(mappedComment);
        }
      } else {
        rootComments.push(mappedComment);
      }
    });

    res.status(200).json(rootComments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};