const express = require("express");
const { Chat } = require("../models/chat");
const { userAuth } = require("../middlewares/auth");

const chatRouter = express.Router();

chatRouter.get("/chat/:selectedUserId", userAuth, async (req, res) => {
  const { selectedUserId } = req.params;
  const userId = req.user._id;

  const limit = parseInt(req.query.limit) || 20;
  const skip = parseInt(req.query.skip) || 0;

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
      return res.status(200).json({ messages: [] });
    }

    // Slice messages array with pagination (newest at bottom)
    const totalMessages = chat.messages.length;

    const messages = chat.messages
      .slice(Math.max(totalMessages - skip - limit, 0), totalMessages - skip)
      .map((msg) => ({
        ...msg.toObject(),
      }));

    res.status(200).json({
      messages,
      totalMessages,
    });
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = { chatRouter };
