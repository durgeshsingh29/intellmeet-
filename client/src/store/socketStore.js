import { io } from "socket.io-client";
import { create } from "zustand";

export const useSocketStore = create((set, get) => ({
  socket: null,
  connect: () => {
    if (get().socket) return get().socket;
    const token = localStorage.getItem("intellmeet_token");
    const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", { auth: { token } });
    set({ socket });
    return socket;
  },
  disconnect: () => {
    get().socket?.disconnect();
    set({ socket: null });
  }
}));
