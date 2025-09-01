import http from "http";
import express from "express";
import { Server } from "socket.io";
import User from "../models/user.model.ts";
import type { Application } from "express";
import type { Server as HTTPServer } from "http";
import type { Server as SocketIOServer, Socket } from "socket.io";

const app: Application = express();
const server: HTTPServer = http.createServer(app);

const io: SocketIOServer = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    credentials: true,
  },
});

// Used to store online users
const userSocketMap: Record<string, string> = {}; // {userId: socketId}

export function getReceiverSocketId(userId: string): string | undefined {
  return userSocketMap[userId];
}

io.on("connection", async (socket: Socket) => {
  console.log("User connected:", socket.id);

  const userId = socket.handshake.query.userId;

  // Safely handle undefined or array cases
  if (typeof userId === "string") {
    userSocketMap[userId] = socket.id;

    await User.findByIdAndUpdate(userId, {
      status: "online",
    });
  }

  // Send online users to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", async () => {
    console.log("User disconnected:", socket.id);

    if (typeof userId === "string") {
      delete userSocketMap[userId];

      await User.findByIdAndUpdate(userId, {
        status: "offline",
        lastSeen: Date.now(),
      });
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
