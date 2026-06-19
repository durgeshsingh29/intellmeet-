import jwt from "jsonwebtoken";
import { Message } from "../models/Message.js";
import { User } from "../models/User.js";

export function registerSocketHandlers(io) {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Missing token"));
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(payload.id);
      if (!user) return next(new Error("Invalid user"));
      socket.user = user;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("meeting:join", ({ meetingId }) => {
      socket.join(meetingId);
      socket.to(meetingId).emit("presence:joined", { user: publicUser(socket.user) });
    });

    socket.on("meeting:leave", ({ meetingId }) => {
      socket.leave(meetingId);
      socket.to(meetingId).emit("presence:left", { userId: socket.user._id });
    });

    socket.on("chat:send", async ({ meetingId, text }) => {
      const message = await Message.create({ meeting: meetingId, sender: socket.user._id, text });
      const payload = { ...message.toObject(), sender: publicUser(socket.user) };
      io.to(meetingId).emit("chat:new", payload);
    });

    socket.on("webrtc:offer", ({ meetingId, offer, to }) => socket.to(to || meetingId).emit("webrtc:offer", { from: socket.id, offer }));
    socket.on("webrtc:answer", ({ meetingId, answer, to }) => socket.to(to || meetingId).emit("webrtc:answer", { from: socket.id, answer }));
    socket.on("webrtc:ice", ({ meetingId, candidate, to }) => socket.to(to || meetingId).emit("webrtc:ice", { from: socket.id, candidate }));
    socket.on("typing", ({ meetingId, isTyping }) => socket.to(meetingId).emit("typing", { user: publicUser(socket.user), isTyping }));
  });
}

function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email, avatar: user.avatar };
}
