const express = require("express");
const {
  register,
  login,
  logout,
  getProfile,
  editProfile,
  suggestedUsers,
  followUnfollowUser,
  checkAuth,
  getUsers,
  searchUsers,
} = require("../controllers/userController");
const { protect } = require("../middlewares/isAuthenticated");
const {
  registerValidator,
  loginValidator,
  getProfileValidator,
  editProfileValidator,
  followUnfollowUserValidator,
} = require("../utils/validators/userValidators");
const router = express.Router();

router.route("/register").post(registerValidator, register);
router.route("/login").post(loginValidator, login);
router.route("/logout").get(logout);
router.route("/checkauth").get(protect, checkAuth);
router.route("/:id/profile").get(protect, getProfileValidator, getProfile);
router.route("/profile/edit").post(protect, editProfileValidator, editProfile);
router.route("/suggested").get(protect, suggestedUsers);
router
  .route("/followorunfollow/:id")
  .post(protect, followUnfollowUserValidator, followUnfollowUser);
router.route("/chat-users").get(protect, getUsers);
router.route("/search-users").get(protect, searchUsers);

module.exports = router;
