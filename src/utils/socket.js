const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");
const User = require("../models/user");
const { Connection } = require("mongoose");
const ConnectionRequest = require("../models/connections");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_chat_"))
    .digest("hex");
};

const initiateSocket = (server) => {
  const io = socket(server, {
    cors: { origin: "http://localhost:5173" },
  });

  io.on("connection", async (socket) => {

    // Join chat room
    socket.on("joinChat", ({ userId, selectedUserId }) => {
      const roomId = getSecretRoomId(userId, selectedUserId);
      socket.join(roomId);
    });

    // Handle sending messages
    socket.on("sendMessage", async ({ userId, selectedUserId, text }) => {
      try {
        const roomId = getSecretRoomId(userId, selectedUserId);
        const existingConnections = await ConnectionRequest.find({
          $or :[
            {_id: { $in: [userId, selectedUserId] }},
          
            {_id: { $in: [selectedUserId, userId] }
          }]
          , status: "accepted"
        });
        if (!existingConnections) {
          throw new Error("You cannot send message to this user");
        }
        let chat = await Chat.findOne({ participants: { $all: [userId, selectedUserId] } });

        if (!chat) {
          chat = new Chat({ participants: [userId, selectedUserId], messages: [] });
        }

        const messageData = { senderId: userId, text };
        chat.messages.push(messageData);
        await chat.save();

        io.to(roomId).emit("messageReceived", {
          _id: Date.now(),
          senderId: userId,
          text,
          time: new Date().toLocaleTimeString(),
        });
      } catch (err) {
        console.error(err);
      }
    });


    // Disconnect
    socket.on("disconnect", () => {
    });
  });
};

module.exports = { initiateSocket };
