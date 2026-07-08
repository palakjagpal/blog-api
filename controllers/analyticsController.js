import ViewLog from "../models/ViewLog.js";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";

export const getOwnerDashboardAnalytics = async (req, res) => {
  try {
    const authorId = req.user.id; // From auth middleware

    // 1. Fetch all blogs owned by this author
    const authorBlogs = await Blog.find({ author: authorId });
    const blogIds = authorBlogs.map(blog => blog._id);

    if (authorBlogs.length === 0) {
      return res.status(200).json({
        message: "No blog data available yet. Create your first post!",
        summary: { totalPosts: 0, totalViews: 0, totalLikes: 0, totalComments: 0 },
        dailyViewsTimeline: [],
        articlesBreakdown: []
      });
    }

    // 2. Calculate Cumulative Lifetime Summary Metrics
    const totalPosts = authorBlogs.length;
    const totalViews = authorBlogs.reduce((sum, blog) => sum + (blog.views || 0), 0);
    const totalLikes = authorBlogs.reduce((sum, blog) => sum + (blog.likes?.length || 0), 0);
    
    // Count total comments across all author's blogs
    const totalComments = await Comment.countDocuments({ blog: { $in: blogIds } });

    // 3. 7-Day Daily Traffic Timeline Aggregation
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyViewsTimeline = await ViewLog.aggregate([
      {
        $match: {
          blog: { $in: blogIds },
          viewedAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$viewedAt" } },
          views: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } } // Sort chronologically (Oldest to Newest)
    ]);

    // 4. Detailed Article-by-Article Breakdown Matrix
    // Compiles comments count per article alongside views and likes
    const articlesBreakdown = await Promise.all(
      authorBlogs.map(async (blog) => {
        const commentCount = await Comment.countDocuments({ blog: blog._id });
        return {
          id: blog._id,
          title: blog.title,
          status: blog.status,
          createdAt: blog.createdAt,
          views: blog.views || 0,
          likes: blog.likes?.length || 0,
          comments: commentCount
        };
      })
    );

    // 5. Top Tags Engagement Distribution
    const tagCloudMap = {};
    authorBlogs.forEach(blog => {
      blog.tags.forEach(tag => {
        tagCloudMap[tag] = (tagCloudMap[tag] || 0) + (blog.views || 0);
      });
    });
    const topTags = Object.entries(tagCloudMap)
      .map(([tag, views]) => ({ tag, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    // Return the comprehensive dashboard payload
    res.status(200).json({
      summary: {
        totalPosts,
        totalViews,
        totalLikes,
        totalComments
      },
      topTags,
      dailyViewsTimeline,
      articlesBreakdown
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};