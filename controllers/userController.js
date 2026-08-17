import BlogUser from "../models/BlogUser.js";
import Blog from "../models/Blog.js";

//Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await BlogUser.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const profileData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      followersCount: user.followers.length,
      followingCount: user.following.length,
    };

    res.status(200).json(profileData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Follow / Unfollow a Writer
export const toggleFollowUser = async (req, res) => {
  try {
    //targetUserId: The ID of the person you want to follow (from the URL path)
    const targetUserId = req.params.userId; 
    //currentUserId: Your own ID (extracted from the logged-in session/token)
    const currentUserId = req.user.id;

    //Stops the operation if you try to follow your own account
    if (targetUserId === currentUserId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    //Looks up both accounts in the BlogUser collection
    //Fails safely if either account does not exist
    const targetUser = await BlogUser.findById(targetUserId);
    const currentUser = await BlogUser.findById(currentUserId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    //Checks if the target user is already in your following array
    const isFollowing = currentUser.following.includes(targetUserId);

    //If true, it filters out (removes) the IDs from both users' profiles
    if (isFollowing) {
      currentUser.following = currentUser.following.filter(id => id.toString() !== targetUserId);
      targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUserId);
      
      await currentUser.save();
      await targetUser.save();
      
      return res.status(200).json({ message: "Successfully unfollowed user" });
    } else {
      //If false, it pushes (adds) the IDs into the respective arrays
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);
      
      await currentUser.save();
      await targetUser.save();
      
      return res.status(200).json({ message: "Successfully followed user" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



//Fetch Personalized Feed 
export const getFollowingFeed = async (req, res) => {
  try {

    //Looks up the logged-in user's profile to access their following list (the array of user IDs they follow
    const currentUser = await BlogUser.findById(req.user.id);

    if (!currentUser) return res.status(404).json({ message: "User not found" });

    // Use Mongoose '$in' operator to discover blogs where author matches any ID in following array
    //author: { $in: ... }: Tells MongoDB to find blogs where the author match any ID inside the currentUser.following array
    //status: "published": Ensures the user only sees live posts, hiding drafts
    const feedBlogs = await Blog.find({
      author: { $in: currentUser.following },
      status: "published"
    })
    //populate: Replaces the raw author ID string with the author's real data (specifically just their name, email, and bio for security)
    //sort({ createdAt: -1 }): Arranges the posts in reverse chronological order so the newest posts appear at the top
    .populate("author", "name email bio")
    .sort({ createdAt: -1 }); //Newest articles first

    res.status(200).json(feedBlogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Get Followers List
export const getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await BlogUser.findById(userId)
      .populate("followers", "name email bio")
      .select("followers");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user.followers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Get Following List
export const getFollowing = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await BlogUser.findById(userId)
      .populate("following", "name email bio")
      .select("following");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user.following);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*
export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch user profile data, explicitly omitting the password field
    const user = await BlogUser.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Transform response to include counts instead of leaking whole arrays of IDs
    const profileData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      followersCount: user.followers.length,
      followingCount: user.following.length,
    };

    res.status(200).json(profileData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Follow / Unfollow a Writer
export const toggleFollowUser = async (req, res) => {
  try {
    const targetUserId = req.params.userId; // The author to follow
    const currentUserId = req.user.id;     // Logged-in user from token

    if (targetUserId === currentUserId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const targetUser = await BlogUser.findById(targetUserId);
    const currentUser = await BlogUser.findById(currentUserId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if currently following
    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
      // Unfollow: Remove matching IDs from both users' arrays
      currentUser.following = currentUser.following.filter(id => id.toString() !== targetUserId);
      targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUserId);
      
      await currentUser.save();
      await targetUser.save();
      
      return res.status(200).json({ message: "Successfully unfollowed user" });
    } else {
      // Follow: Push matching IDs to respective arrays
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);
      
      await currentUser.save();
      await targetUser.save();
      
      return res.status(200).json({ message: "Successfully followed user" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Fetch Personalized Feed (Blogs written by authors the current user follows)
export const getFollowingFeed = async (req, res) => {
  try {
    const currentUser = await BlogUser.findById(req.user.id);
    
    if (!currentUser) return res.status(404).json({ message: "User not found" });

    // Use Mongoose '$in' operator to discover blogs where author matches any ID in following array
    const feedBlogs = await Blog.find({
      author: { $in: currentUser.following },
      status: "published"
    })
    .populate("author", "name email bio")
    .sort({ createdAt: -1 }); // Newest articles first

    res.status(200).json(feedBlogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
*/