// controllers/blogController.js


import ViewLog from "../models/ViewLog.js"; // Must include .js
import Blog from "../models/Blog.js";
import dotenv from "dotenv";

const calculateReadingTime = (content) => {
  if (!content) return 0;
  const wordsPerMinute = 200; // Average human adult reading speed
  const words = content.trim().split(/\s+/).length; // Split by spaces to count words
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
};

export const createBlog = async (req, res) => {
  try {
    const { title, content, tags, status, coverImage } = req.body;

    /*
    let finalCoverImage = "";
    if (req.file && req.file.path) {
      finalCoverImage = req.file.path;
    } else if (coverImage) {
      finalCoverImage = coverImage;
    }
      */
    // Multer-storage-cloudinary usually populates req.file.path or req.file.path
    let finalCoverImage = "";
    if (req.file) {
      finalCoverImage = req.file.path || req.file.secure_url; 
    } else if (coverImage) {
      finalCoverImage = coverImage;
    }

    // --- TAG HANDLING BLOCK ---
    let processedTags = [];

    if (tags) {
      if (typeof tags === "string") {
        try {
          // If Option A was used: Try to parse it as a valid JSON array
          processedTags = JSON.parse(tags);
        } catch (e) {
          // If Option B was used: Split the string by commas and clean up trailing spaces
          processedTags = tags.split(",").map(tag => tag.trim());
        }
      } else if (Array.isArray(tags)) {
        // Fallback case if data comes through as a native array (e.g., standard JSON testing in Postman)
        processedTags = tags;
      }
    }

    const blog = new Blog({ 
      title, 
      content, 
      tags : processedTags, 
      status: status || "draft", 
      coverImage: finalCoverImage,
      author: req.user.id 
    });
    
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ status: "published" }).populate("author", "name email"); 
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};*/

export const getAllBlogs = async (req, res) => {
  try {
    const { search, tag, page, limit } = req.query;
    let filterQuery = { status: "published" };

    if (search) filterQuery.$text = { $search: search };
    if (tag) filterQuery.tags = tag;

    const isPaginationEnabled = page && limit;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skipNum = (pageNum - 1) * limitNum;

    const totalBlogs = await Blog.countDocuments(filterQuery);

    const pipeline = [
      { $match: filterQuery },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "blog",
          as: "commentData"
        }
      },
      {
        $addFields: {
          commentsCount: { $size: "$commentData" }
        }
      },
      {
        $project: {
          commentData: 0 
        }
      },
      {
        $lookup: {
          from: "blogusers",
          localField: "author",
          foreignField: "_id",
          as: "author"
        }
      },
      {
        $unwind: {
          path: "$author",
          preserveNullAndEmptyArrays: true
        }
      }
    ];

    if (search) {
      pipeline.push({ $sort: { score: { $meta: "textScore" } } });
    } else {
      pipeline.push({ $sort: { createdAt: -1 } });
    }

    if (isPaginationEnabled) {
      pipeline.push({ $skip: skipNum });
      pipeline.push({ $limit: limitNum });
    }

    const blogs = await Blog.aggregate(pipeline);

    const blogsWithDetails = blogs.map((blog) => ({
      ...blog,
      readingTime: `${calculateReadingTime(blog.content)} min read`
    }));

    res.status(200).json({
      blogs: blogsWithDetails,
      pagination: isPaginationEnabled ? {
        totalItems: totalBlogs,
        currentPage: pageNum,
        totalPages: Math.ceil(totalBlogs / limitNum),
        limit: limitNum,
        hasNextPage: pageNum * limitNum < totalBlogs,
        hasPrevPage: pageNum > 1
      } : null
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/*
export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id).populate("author", "name email"); 
    
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Privacy Guard: If it's a draft, only the author can see it
    if (blog.status === "draft") {
      // If no user is logged in OR logged in user is NOT the author
      if (!req.user || blog.author._id.toString() !== req.user.id) {
        return res.status(403).json({ message: "This draft is private to the author" });
      }
    }

    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};*/


//getBlogById 
export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id).populate("author", "name email"); 
    
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Privacy Guard for drafts
    if (blog.status === "draft") {
      if (!req.user || blog.author._id.toString() !== req.user.id) {
        return res.status(403).json({ message: "This draft is private to the author" });
      }
    } else {
      // Check if we should count this view
      let shouldCountView = false;
      let userId = null;
      
      // If user is logged in
      if (req.user) {
        userId = req.user.id;
        // Don't count if the viewer is the author
        if (blog.author._id.toString() === userId) {
          shouldCountView = false;
        } else {
          // Check if this user has already viewed this blog
          const existingView = await ViewLog.findOne({
            blog: blog._id,
            user: userId
          });
          
          if (!existingView) {
            shouldCountView = true;
          }
        }
      } else {
        // For unauthenticated users, check by IP address or session
        // Simple approach: use IP address
        const clientIp = req.ip || req.connection.remoteAddress;
        
        // Check if this IP has viewed this blog in the last 24 hours
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
        
        const existingView = await ViewLog.findOne({
          blog: blog._id,
          ip: clientIp,
          viewedAt: { $gte: twentyFourHoursAgo }
        });
        
        if (!existingView) {
          shouldCountView = true;
        }
      }
      
      // Only increment views if we should count this view
      if (shouldCountView) {
        blog.views += 1;
        await blog.save();
        
        // Log the view for future deduplication
        try {
          const viewLogData = {
            blog: blog._id,
            viewedAt: new Date()
          };
          
          // Add user ID if logged in
          if (userId) {
            viewLogData.user = userId;
          } else {
            // Add IP for unauthenticated users
            viewLogData.ip = req.ip || req.connection.remoteAddress;
          }
          
          const viewLog = new ViewLog(viewLogData);
          await viewLog.save();
        } catch (logError) {
          console.error('Error logging view:', logError);
        }
      }
    }

    const blogResponse = {
      ...blog._doc,
      readingTime: `${calculateReadingTime(blog.content)} min read`
    };

    res.status(200).json(blogResponse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Like / Unlike a blog post
export const toggleLikeBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // From auth token

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    if (blog.status === "draft") return res.status(400).json({ message: "Cannot like a draft post" });

    // Check if the user has already liked the blog
    const isLiked = blog.likes.includes(userId);

    if (isLiked) {
      // If already liked, remove the user ID from the array (Unlike)
      blog.likes = blog.likes.filter((id) => id.toString() !== userId);
      await blog.save();
      return res.status(200).json({ message: "Blog unliked successfully", likesCount: blog.likes.length });
    } else {
      // If not liked, push the user ID into the array (Like)
      blog.likes.push(userId);
      await blog.save();
      return res.status(200).json({ message: "Blog liked successfully", likesCount: blog.likes.length });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// 4. Update Blog (No changes needed, but handles status modifications perfectly)
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (!blog.author || blog.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "User not authorized to update this blog" });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updatedBlog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 5. Delete Blog
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (!blog.author || blog.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "User not authorized to delete this blog" });
    }

    await Blog.findByIdAndDelete(id);
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};