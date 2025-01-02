const express = require("express");
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getUserPosts,
  likeUnlikePost,
  createComment,
  getCommentsOfPost,
  deletePost,
  bookmarkPost,
} = require("../controllers/postController");
const { protect } = require("../middlewares/isAuthenticated");

router.post("/", protect, createPost);
router.get("/all", protect, getAllPosts);
router.get("/user", protect, getUserPosts);
router.put("/:id/like", protect, likeUnlikePost);
router.post("/:id/comment", protect, createComment);
router.get("/:id/comments", protect, getCommentsOfPost);
router.delete("/:id", protect, deletePost);
router.put("/:id/bookmark", protect, bookmarkPost);

module.exports = router;
