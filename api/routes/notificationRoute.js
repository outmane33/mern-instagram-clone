const express = require("express");
const {
  getUserNotifications,
} = require("../controllers/notificationController");
const { protect } = require("../middlewares/isAuthenticated");
const router = express.Router();

router.route("/").get(protect, getUserNotifications);

module.exports = router;
