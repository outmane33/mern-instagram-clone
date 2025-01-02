const { check } = require("express-validator");
const User = require("../../models/userModel");
const ApiError = require("../apiError");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.registerValidator = [
  check("username")
    .not()
    .isEmpty()
    .withMessage("Username is required")
    .custom(async (username) => {
      const user = await User.findOne({ username });
      if (user) {
        throw new ApiError("Username already exists", 400);
      }
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) {
        throw new ApiError("Email already exists", 400);
      }
      return true;
    }),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  validatorMiddleware,
];

exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  validatorMiddleware,
];

exports.getProfileValidator = [
  check("id")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid user ID"),
  validatorMiddleware,
];

exports.editProfileValidator = [
  check("username")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long")
    .custom(async (username, { req }) => {
      const user = await User.findOne({ username });
      if (user && user._id.toString() !== req.user._id.toString()) {
        throw new ApiError("Username already exists", 400);
      }
      return true;
    }),
  check("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email address")
    .custom(async (email, { req }) => {
      const user = await User.findOne({ email });
      if (user && user._id.toString() !== req.user._id.toString()) {
        throw new ApiError("Email already exists", 400);
      }
      return true;
    }),
  check("gender")
    .optional()
    .isIn(["male", "female"])
    .withMessage("Invalid gender"),
  validatorMiddleware,
];

exports.followUnfollowUserValidator = [
  check("id")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid user ID"),
  validatorMiddleware,
];
