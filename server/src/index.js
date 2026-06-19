import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import { createApp } from "./app.js";
import { connectDB } from "./config/db.js";
import { registerSocketHandlers } from "./socket/index.js";

const port = process.env.PORT || 5000;
const app = createApp();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }
});

registerSocketHandlers(io);
await connectDB();

server.listen(port, () => {
  console.log(`IntellMeet API running on http://localhost:${port}`);
});
