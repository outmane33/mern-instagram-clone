const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const ApiError = require("../utils/apiError");
const User = require("../models/userModel.js");
const { generateToken } = require("../utils/generateToken");
const { sanitizeUser } = require("../utils/sanitizeData");
const cloudinary = require("../utils/coudinary.js");
const Notification = require("../models/notificationModel.js");
const Post = require("../models/postModel.js");

exports.register = expressAsyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;
  const user = await User.create({
    username,
    email,
    password,
  });

  const token = generateToken(user._id);
  res
    .status(201)
    .cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
    })
    .json({
      status: "success",
      message: "User created successfully",
      user: sanitizeUser(user),
    });
});

exports.login = expressAsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new ApiError("Invalid email or password", 401));
  }

  const token = generateToken(user._id);

  // populate each post if in the posts array
  const populatedPosts = await Promise.all(
    user.posts.map(async (postId) => {
      const post = await Post.findById(postId);
      if (post.author.equals(user._id)) {
        return post;
      }
      return null;
    })
  );

  user.posts = populatedPosts.filter((post) => post !== null);

  res
    .status(200)
    .cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
    })
    .json({
      status: "success",
      message: "Logged in successfully",
      user: sanitizeUser(user),
    });
});

exports.checkAuth = expressAsyncHandler(async (req, res, next) => {
  res.status(200).json({
    status: "success",
    user: sanitizeUser(req.user),
  });
});

exports.logout = expressAsyncHandler(async (req, res, next) => {
  res.status(200).clearCookie("access_token").json({
    status: "success",
    message: "Logged out successfully",
  });
});

exports.getProfile = expressAsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id)
    .populate({ path: "posts", createdAt: -1 })
    .populate("bookmarks");
  res.status(200).json({
    status: "success",
    user: sanitizeUser(user),
  });
});

exports.editProfile = expressAsyncHandler(async (req, res, next) => {
  if (req.body.profilePicture) {
    const uploadResponse = await cloudinary.uploader.upload(
      req.body.profilePicture
    );
    req.body.profilePicture = uploadResponse.secure_url;
  }
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      profilePicture: req.body.profilePicture,
      bio: req.body.bio,
      gender: req.body.gender,
    },
    {
      new: true,
    }
  );
  res.status(200).json({
    status: "success",
    message: "Profile updated successfully",
    user: sanitizeUser(user),
  });
});

exports.suggestedUsers = expressAsyncHandler(async (req, res, next) => {
  const users = await User.find({
    _id: { $nin: [req.user._id, ...req.user.following] },
  })
    .limit(5)
    .select("-password");
  res.status(200).json({
    status: "success",
    users,
  });
});

exports.followUnfollowUser = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userToModify = await User.findById(id);
  const currentUser = await User.findById(req.user._id);

  if (id === req.user._id.toString()) {
    return res
      .status(400)
      .json({ error: "You can't follow/unfollow yourself" });
  }

  if (!userToModify || !currentUser)
    return res.status(400).json({ error: "User not found" });

  const isFollowing = currentUser.following.includes(id);

  if (isFollowing) {
    await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { following: id } },
      { new: true } // Return updated document
    );
    res.status(200).json({
      status: "success",
      message: "User unfollowed successfully",
      user: sanitizeUser(updatedUser),
    });
  } else {
    await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $push: { following: id } },
      { new: true }
    );
    // Rest of follow logic...
    res.status(200).json({
      status: "success",
      message: "User followed successfully",
      user: sanitizeUser(updatedUser),
    });
  }
});

exports.getUsers = expressAsyncHandler(async (req, res, next) => {
  const users = await User.find({ _id: { $nin: [req.user._id] } }).select(
    "_id username profilePicture"
  );
  res.status(200).json({
    status: "success",
    users,
  });
});

exports.searchUsers = expressAsyncHandler(async (req, res, next) => {
  if (!req.query.username) {
    return res.status(200).json({
      status: "success",
      users: [],
    });
  }
  const users = await User.find({
    username: { $regex: new RegExp("^" + req.query.username, "i") },
  }).select("_id username profilePicture");
  res.status(200).json({
    status: "success",
    users,
  });
});
