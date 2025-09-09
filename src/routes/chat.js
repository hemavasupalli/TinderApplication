const express = require("express");
const { Chat } = require("../models/chat");
const { userAuth } = require("../middlewares/auth");

const chatRouter = express.Router();

chatRouter.get("/chat/:selectedUserId", userAuth, async (req, res) => {
  const { selectedUserId } = req.params;
  const userId = req.user._id;
  try {
    let chat = await Chat.findOne({
      participants: { $all: [userId, selectedUserId] },
    }).populate({
      path: "messages.senderId",
      select: "firstName lastName",
    });
    if (!chat) {
      chat = new Chat({
        participants: [userId, selectedUserId],
        messages: [],
      });
      await chat.save();
    }
    res.status(200).json(chat);
  } catch (error) {
    console.error("Error fetching chats:", error);
  }
});

module.exports = { chatRouter };
