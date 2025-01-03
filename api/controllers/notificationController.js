const expressAsyncHandler = require("express-async-handler");
const Notification = require("../models/notificationModel");

exports.getUserNotifications = expressAsyncHandler(async (req, res) => {
  const notifications = await Notification.find({
    recipient: req.user._id,
  })
    .sort({ createdAt: -1 })
    .populate("relatedUser", "username profilePicture");

  //number of unread notifications
  const unreadNotifications = await Notification.find({
    recipient: req.user._id,
    read: false,
  }).countDocuments();

  res
    .status(200)
    .json({ status: "success", unreadNotifications, notifications });
});

exports.makeNotificationRead = expressAsyncHandler(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user._id, read: false },
    { read: true }
  );
  res.status(200).json({ status: "success", message: "Notifications read" });
});
