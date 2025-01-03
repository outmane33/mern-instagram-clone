const expressAsyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const User = require("../models/userModel.js");
const cloudinary = require("../utils/coudinary.js");
const Post = require("../models/postModel.js");
const Comment = require("../models/commentModel.js");
const Notification = require("../models/notificationModel.js");
const { getReceiverSocketId, io } = require("../utils/socket.js");

exports.createPost = expressAsyncHandler(async (req, res) => {
  const { caption } = req.body;
  let { image } = req.body;
  const userId = req.user._id.toString();

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (!caption && !image) {
    return res.status(400).json({ error: "Post must have caption or image" });
  }

  if (image) {
    const uploadedResponse = await cloudinary.uploader.upload(image);
    image = uploadedResponse.secure_url;
  }

  const newPost = new Post({
    author: userId,
    caption,
    image,
  });

  user.posts.push(newPost._id);
  await user.save();

  await newPost.save();
  await newPost.populate("author", "username profilePicture");
  res.status(201).json({
    status: "success",
    message: "Post created successfully",
    post: newPost,
  });
});

exports.getAllPosts = expressAsyncHandler(async (req, res) => {
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .populate({ path: "author", select: "username profilePicture" });

  res.status(200).json({
    status: "success",
    posts,
  });
});

exports.getUserPosts = expressAsyncHandler(async (req, res) => {
  const posts = await Post.find({ author: req.user._id })
    .sort({ createdAt: -1 })
    .populate({ path: "author", select: "username profilePicture" })
    .populate({
      path: "comments",
      sort: { createdAt: -1 },
      populate: { path: "author", select: "username profilePicture" },
    });

  res.status(200).json({
    status: "success",
    posts,
  });
});

exports.likeUnlikePost = expressAsyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { id: postId } = req.params;

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  const userLikedPost = post.likes.includes(userId);

  if (userLikedPost) {
    // Unlike post
    await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
    const updatedLikes = post.likes.filter(
      (id) => id.toString() !== userId.toString()
    );

    res.status(200).json({
      status: "success",
      updatedLikes,
    });
  } else {
    // Like post
    post.likes.push(userId);
    await post.save();

    if (post.author.toString() !== userId.toString()) {
      let notification = await Notification.create({
        relatedUser: userId,
        recipient: post.author,
        relatedPost: postId,
        type: "like",
      });
      notification = await notification.populate(
        "relatedUser",
        "username profilePicture"
      );
      const receiverSocketId = getReceiverSocketId(post.author);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("notification", notification || {});
      }
    }

    const updatedLikes = post.likes;
    res.status(200).json({
      status: "success",
      message: "Post liked successfully",
      updatedLikes,
    });
  }
});

exports.createComment = expressAsyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { id: postId } = req.params;
  const { text } = req.body;

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  const newComment = await Comment.create({
    text: text,
    author: userId,
    post: postId,
  });

  post.comments.push(newComment._id);
  await post.save();

  await newComment.populate("author", "username profilePicture");

  if (post.author.toString() !== userId.toString()) {
    const notification = new Notification({
      relatedUser: userId,
      recipient: post.author,
      relatedPost: postId,
      type: "comment",
    });
    notification.populate("relatedUser", "username profilePicture");
    await notification.save();

    const receiverSocketId = getReceiverSocketId(post.author);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("notification", notification || {});
    }
  }

  res.status(201).json({
    status: "success",
    message: "Comment created successfully",
    comment: newComment,
  });
});

exports.getCommentsOfPost = expressAsyncHandler(async (req, res) => {
  const { id: postId } = req.params;
  const comments = await Comment.find({ post: postId })
    .sort({ createdAt: -1 })
    .populate("author", "username profilePicture");

  res.status(200).json({
    status: "success",
    comments,
  });
});

exports.deletePost = expressAsyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  if (post.author.toString() !== req.user._id.toString()) {
    return res
      .status(401)
      .json({ error: "You are not authorized to delete this post" });
  }

  if (post.img) {
    const imgId = post.img.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(imgId);
  }

  await Post.findByIdAndDelete(req.params.id);

  await Comment.deleteMany({ post: req.params.id });

  res.status(200).json({
    status: "success",
    message: "Post deleted successfully",
  });
});

exports.bookmarkPost = expressAsyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { id: postId } = req.params;

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  const user = await User.findById(userId);
  if (user.bookmarks.includes(postId)) {
    await User.findByIdAndUpdate(userId, { $pull: { bookmarks: postId } });
    res
      .status(200)
      .json({ status: "success", message: "Post unbookmarked successfully" });
  } else {
    await User.findByIdAndUpdate(userId, { $push: { bookmarks: postId } });
    res
      .status(200)
      .json({ status: "success", message: "Post bookmarked successfully" });
  }
});
