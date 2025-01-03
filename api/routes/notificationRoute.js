const express = require("express");
const {
  getUserNotifications,
  makeNotificationRead,
} = require("../controllers/notificationController");
const { protect } = require("../middlewares/isAuthenticated");
const router = express.Router();

router.route("/").get(protect, getUserNotifications);
router.route("/read").put(protect, makeNotificationRead);

module.exports = router;
