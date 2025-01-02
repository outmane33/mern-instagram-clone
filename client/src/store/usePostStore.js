import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";

export const usePostStore = create((set, get) => ({
  posts: [],
  loading: false,
  error: null,
  selctedPost: null,
  comments: [],
  setSelectedPost: (post) => set({ selctedPost: post }),
  getAllPosts: async () => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.get("/api/v1/post/all");
      if (res.data.status === "success") {
        set({ posts: res.data.posts });
        set({ loading: false, error: null });
      } else {
        set({ loading: false, error: res.data.message });
      }
    } catch (error) {
      set({ loading: false, error: error.response.data.message });
    }
  },
  createPost: async (data) => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.post("/api/v1/post", data);
      if (res.data.status === "success") {
        set({ loading: false, error: null });
        set({ posts: [...get().posts, res.data.post] });
        toast.success(res.data.message);
      } else {
        set({ loading: false, error: res.data.message });
      }
    } catch (error) {
      set({ loading: false, error: error.response.data.message });
    }
  },
  likePost: async (id) => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.put(`/api/v1/post/${id}/like`);
      if (res.data.status === "success") {
        set({ loading: false, error: null });
        set({
          posts: get().posts.map((post) =>
            post._id === id ? { ...post, likes: res.data.updatedLikes } : post
          ),
        });
      } else {
        set({ loading: false, error: res.data.message });
      }
    } catch (error) {
      set({ loading: false, error: error.response.data.message });
    }
  },
  commentPost: async (id, data) => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.post(`/api/v1/post/${id}/comment`, data);
      if (res.data.status === "success") {
        set({ loading: false, error: null });
        set({ comments: [...get().comments, res.data.comment] });
        set({
          posts: get().posts.map((post) =>
            post._id === id
              ? { ...post, comments: [...post.comments, res.data.comment._id] }
              : post
          ),
        });
      } else {
        set({ loading: false, error: res.data.message });
      }
    } catch (error) {
      set({ loading: false, error: error.response.data.message });
    }
  },
  getCommentsOfPost: async (id) => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.get(`/api/v1/post/${id}/comments`);
      if (res.data.status === "success") {
        set({ comments: res.data.comments });
        set({ loading: false, error: null });
      } else {
        set({ loading: false, error: res.data.message });
      }
    } catch (error) {
      set({ loading: false, error: error.response.data.message });
    }
  },
  deletePost: async (id) => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.delete(`/api/v1/post/${id}`);
      if (res.data.status === "success") {
        set({ loading: false, error: null });
        set({
          posts: [...get().posts.filter((post) => post._id !== id)],
        });
        toast.success(res.data.message);
      } else {
        set({ loading: false, error: res.data.message });
      }
    } catch (error) {
      set({ loading: false, error: error.response.data.message });
    }
  },
  bookMarkPost: async (id) => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.put(`/api/v1/post/${id}/bookmark`);
      if (res.data.status === "success") {
        set({ loading: false, error: null });
        toast.success(res.data.message);
      } else {
        set({ loading: false, error: res.data.message });
      }
    } catch (error) {
      set({ loading: false, error: error.response.data.message });
    }
  },
}));
