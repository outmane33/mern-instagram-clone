const expressAsyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const Notification = require("../models/notificationModel");

exports.getUserNotifications = expressAsyncHandler(async (req, res) => {
  const notifications = await Notification.find({
    recipient: req.user._id,
  })
    .sort({ createdAt: -1 })
    .populate("relatedUser", "username profilePicture");
  res.status(200).json({ status: "success", notifications });
});
