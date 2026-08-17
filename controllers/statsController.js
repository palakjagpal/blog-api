import Blog from "../models/Blog.js";
import BlogUser from "../models/BlogUser.js";
import ViewLog from "../models/ViewLog.js";

export const getPublicStats = async (req, res) => {
  try {
    // Get total published blogs
    const totalBlogs = await Blog.countDocuments({ status: "published" });
    
    // Get total users
    const totalUsers = await BlogUser.countDocuments();
    
    // Get total views from ViewLog collection or from blogs
    // Using ViewLog collection for more accurate view counting
    const totalViews = await ViewLog.countDocuments();
    
    // Alternative: sum views from blogs if you prefer
    // const blogViewsAggregation = await Blog.aggregate([
    //   { $match: { status: "published" } },
    //   { $group: { _id: null, total: { $sum: "$views" } } }
    // ]);
    // const totalViews = blogViewsAggregation[0]?.total || 0;

    res.status(200).json({
      totalBlogs,
      totalUsers,
      totalViews
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};