const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_chat_"))
    .digest("hex");
};
const initiateSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, userId, selectedUserId }) => {
      const roomId = getSecretRoomId(userId, selectedUserId);
      socket.join(roomId);
    });
    socket.on(
      "sendMessage",
      async ({ firstName, userId, selectedUserId, text }) => {
        try {
    
          // Ensure required fields exist
          if (!userId || !selectedUserId) {
            throw new Error("userId or selectedUserId is missing");
          }
          if (!text || text.trim() === "") {
            throw new Error("Message text is required");
          }
    
          const roomId = getSecretRoomId(userId, selectedUserId);
    
          let chat = await Chat.findOne({
            participants: { $all: [userId, selectedUserId] },
          });
    
          if (!chat) {
            chat = new Chat({
              participants: [userId, selectedUserId],
              messages: [],
            });
          }
    
          // Push a valid message
          chat.messages.push({
            senderId: userId,
            text,
          });
    
          await chat.save();
    
          io.to(roomId).emit("messageReceived", {
            _id: Date.now(),
            senderId: userId,
            text,
            time: new Date().toLocaleTimeString(),
          });
    
        } catch (err) {
          console.error("Error generating room ID:", err);
        }
      }
    );
    
    socket.on("disconnect", () => {});
  });
};
module.exports = { initiateSocket };
