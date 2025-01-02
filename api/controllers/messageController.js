const expressAsyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const Conversation = require("../models/conversationModel.js");
const Message = require("../models/messageModel.js");
const { getReceiverSocketId, io } = require("../utils/socket.js");

exports.sendMessage = expressAsyncHandler(async (req, res, next) => {
  const senderId = req.user._id;
  const receiverId = req.params.id;
  const { textMessage: message } = req.body;

  let conversation = await Conversation.findOne({
    participants: { $all: [senderId, receiverId] },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [senderId, receiverId],
    });
  }
  const newMessage = await Message.create({
    senderId,
    receiverId,
    message,
  });
  if (newMessage) conversation.messages.push(newMessage._id);

  await Promise.all([conversation.save(), newMessage.save()]);

  // implement socket io for real time data transfer
  const receiverSocketId = getReceiverSocketId(receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", newMessage);
  }

  return res.status(201).json({
    status: "success",
    message: newMessage,
  });
});

exports.getMessage = expressAsyncHandler(async (req, res, next) => {
  const senderId = req.user._id;
  const receiverId = req.params.id;
  const conversation = await Conversation.findOne({
    participants: { $all: [senderId, receiverId] },
  }).populate("messages");
  if (!conversation)
    return res.status(200).json({ status: "success", messages: [] });

  return res
    .status(200)
    .json({ status: "success", messages: conversation?.messages });
});
