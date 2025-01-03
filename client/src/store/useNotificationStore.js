import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  loading: false,
  error: null,
  unreadNotifications: 0,
  setUnreadNotifications: (count) => set({ unreadNotifications: count }),
  getNotifications: async () => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.get("/api/v1/notification");
      if (res.data.status === "success") {
        set({ notifications: res.data.notifications });
        set({ unreadNotifications: res.data.unreadNotifications });
        set({ loading: false, error: null });
      } else {
        set({ loading: false, error: res.data.message });
      }
    } catch (error) {
      set({ loading: false, error: error.response.data.message });
    }
  },
  makeNotificationsRead: async () => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.put("/api/v1/notification/read");
      if (res.data.status === "success") {
        set({ unreadNotifications: 0 });
        set({ loading: false, error: null });
      } else {
        set({ loading: false, error: res.data.message });
      }
    } catch (error) {
      set({ loading: false, error: error.response.data.message });
    }
  },

  subscribeToNotifications: () => {
    const socket = useAuthStore.getState().socket;

    socket.on("notification", (notification) => {
      if (notification.recipient !== useAuthStore.getState().user._id) return;
      set({
        notifications: [...get().notifications, notification],
        unreadNotifications: get().unreadNotifications + 1,
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket?.off("notification");
  },
}));
