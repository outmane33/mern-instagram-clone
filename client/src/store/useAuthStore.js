import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:8000";

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: false,
  error: null,
  onlineUsers: [],
  socket: null,
  login: async (data) => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.post("/api/v1/user/login", data);
      if (res.data.status === "success") {
        set({ user: res.data.user });
        set({ loading: false, error: null });
        toast.success(res.data.message);
        get().connectSocket();
      } else {
        set({ loading: false, error: res.data.message });
      }
    } catch (error) {
      set({ loading: false, error: error.response.data.message });
    }
  },
  register: async (data) => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.post("/api/v1/user/register", data);
      if (res.data.status === "success") {
        set({ user: res.data.user });
        set({ loading: false, error: null });
        toast.success(res.data.message);
        get().connectSocket();
      } else {
        set({ loading: false, error: res.data.message });
      }
    } catch (error) {
      set({ loading: false, error: error.response.data.message });
    }
  },
  checkAuth: async () => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.get("/api/v1/user/checkauth");
      if (res.data.status === "success") {
        set({ user: res.data.user });
        set({ loading: false, error: null });
        get().connectSocket();
      } else {
        set({ loading: false, error: res.data.message });
      }
    } catch (error) {
      set({ loading: false, error: error.response.data.message });
    }
  },
  logout: async () => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.get("/api/v1/user/logout");
      if (res.data.status === "success") {
        set({ user: null });
        set({ loading: false, error: null });
        toast.success(res.data.message);
        get().disconnectSocket();
      } else {
        set({ loading: false, error: res.data.message });
      }
    } catch (error) {
      set({ loading: false, error: error.response.data.message });
    }
  },
  connectSocket: () => {
    const { user } = get();
    if (!user || get().socket?.connected) return;
    const socket = io(BASE_URL, {
      query: {
        userId: user._id,
      },
    });
    socket.connect();
    set({ socket });
    socket.on("getOnlineUsers", (onlineUsers) => {
      set({ onlineUsers });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
  followUnfollowUser: async (id) => {
    try {
      const res = await axiosInstance.post(
        `/api/v1/user/followorunfollow/${id}`
      );
      if (res.data.status === "success") {
        // Update user in store with new following array
        set({ user: res.data.user });
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to update follow status");
    }
  },
}));
