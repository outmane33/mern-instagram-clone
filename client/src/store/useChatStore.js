import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import { toast } from "sonner";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/api/v1/user/chat-users");
      set({ users: res.data.users });
      console.log(res.data.users);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (id) => {
    set({ isMessagesLoading: true });
    try {
      if (id) {
        const res = await axiosInstance.get(`/api/v1/message/all/${id}`);
        set({ messages: res.data.messages });
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (receiverId, messageData) => {
    const { messages } = get();
    try {
      const res = await axiosInstance.post(
        `/api/v1/message/send/${receiverId}`,
        messageData
      );
      set({ messages: [...messages, res.data.message] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket?.off("newMessage");
  },
}));
