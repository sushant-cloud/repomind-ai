import { Server as SocketIOServer } from "socket.io";
import { datastore } from "../models/datastore.js";

// Track online users in memory per room
// Room mapping: repoId -> Set of usernames
const roomActiveUsers = {};

export function initSocket(server) {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket) => {
    let currentRepoId = null;
    let currentUsername = null;

    // Join room
    socket.on("join_room", ({ repoId, username, name, avatar }) => {
      // Leave previous room first
      if (currentRepoId) {
        socket.leave(currentRepoId);
        removeUserFromRoom(currentRepoId, username);
        io.to(currentRepoId).emit("online_users", getOnlineUsersInRoom(currentRepoId));
      }

      currentRepoId = repoId;
      currentUsername = username;

      socket.join(repoId);

      // Add user to room tracking
      if (!roomActiveUsers[repoId]) {
        roomActiveUsers[repoId] = new Map();
      }
      roomActiveUsers[repoId].set(username, { username, name, avatar });

      // Notify room about online users
      io.to(repoId).emit("online_users", getOnlineUsersInRoom(repoId));

      console.log(`User ${username} joined chat room: ${repoId}`);
    });

    // Send Message
    socket.on("send_message", ({ repoId, username, content }) => {
      if (!repoId || !username || !content.trim()) return;

      const savedMessage = datastore.addMessage(repoId, username, content);
      if (savedMessage) {
        // Broadcast the real persisted message
        io.to(repoId).emit("new_message", savedMessage);
      }
    });

    // Typing behaviors
    socket.on("typing", ({ repoId, username, isTyping }) => {
      if (!repoId || !username) return;
      socket.to(repoId).emit("user_typing", { username, isTyping });
    });

    // Handle Disconnections
    socket.on("disconnect", () => {
      if (currentRepoId && currentUsername) {
        removeUserFromRoom(currentRepoId, currentUsername);
        io.to(currentRepoId).emit("online_users", getOnlineUsersInRoom(currentRepoId));
        console.log(`User ${currentUsername} disconnected from room: ${currentRepoId}`);
      }
    });
  });

  return io;
}

function removeUserFromRoom(repoId, username) {
  if (roomActiveUsers[repoId]) {
    roomActiveUsers[repoId].delete(username);
    if (roomActiveUsers[repoId].size === 0) {
      delete roomActiveUsers[repoId];
    }
  }
}

function getOnlineUsersInRoom(repoId) {
  if (!roomActiveUsers[repoId]) return [];
  return Array.from(roomActiveUsers[repoId].values());
}
