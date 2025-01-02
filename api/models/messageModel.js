const { default: mongoose } = require("mongoose");

const messageShema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  message: {
    type: String,
    required: true,
  },
});

const Message = mongoose.model("Message", messageShema);

module.exports = Message;
