const { default: mongoose } = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: { type: String, enum: ["like", "comment", "follow"], required: true },
    relatedUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    relatedPost: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
