import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  loading: false,
  error: null,
  getNotifications: async () => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.get("/api/v1/notification");
      if (res.data.status === "success") {
        set({ notifications: res.data.notifications });
        set({ loading: false, error: null });
      } else {
        set({ loading: false, error: res.data.message });
      }
    } catch (error) {
      set({ loading: false, error: error.response.data.message });
    }
  },
}));
