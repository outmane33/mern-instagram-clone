import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";

export const useUserStore = create((set, get) => ({
  suggestedUsers: null,
  loading: false,
  error: null,
  userProfile: null,
  searchUsers: [],

  getSuggestedUsers: async () => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.get("/api/v1/user/suggested");
      if (res.data.status === "success") {
        set({ suggestedUsers: res.data.users });
        set({ loading: false, error: null });
      } else {
        set({ loading: false, error: res.data.message });
      }
    } catch (error) {
      set({ loading: false, error: error.response.data.message });
    }
  },
  getUserProfile: async (id) => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.get(`/api/v1/user/${id}/profile`);
      if (res.data.status === "success") {
        set({ userProfile: res.data.user });
        set({ loading: false, error: null });
      } else {
        set({ loading: false, error: res.data.message });
      }
    } catch (error) {
      set({ loading: false, error: error.response.data.message });
    }
  },
  updateProfile: async (data) => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.post("/api/v1/user/profile/edit", data);
      if (res.data.status === "success") {
        set({ userProfile: res.data.user });
        set({ loading: false, error: null });
        toast.success(res.data.message);
      } else {
        set({ loading: false, error: res.data.message });
      }
    } catch (error) {
      set({ loading: false, error: error.response.data.message });
    }
  },
  searchForUsers: async (username) => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.get(
        `/api/v1/user/search-users?username=${username}`
      );
      if (res.data.status === "success") {
        set({ searchUsers: res.data.users });
        set({ loading: false, error: null });
      } else {
        set({ loading: false, error: res.data.message });
      }
    } catch (error) {
      set({ loading: false, error: error.response.data.message });
    }
  },
}));
