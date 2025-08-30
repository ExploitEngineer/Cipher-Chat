import { create } from "zustand";
import axios from "axios";

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  text?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

interface ChatStore {
  selectedUser: string | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setSelectedUser: (userId: string | null) => void;
  fetchMessages: (receiverId: string) => Promise<void>;
  sendMessage: (
    receiverId: string,
    text?: string,
    image?: string,
  ) => Promise<void>;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  selectedUser: null,
  messages: [],
  isLoading: false,
  error: null,

  setSelectedUser: (userId) => set({ selectedUser: userId, messages: [] }),

  fetchMessages: async (receiverId) => {
    try {
      set({ isLoading: true, error: null });
      const res = await axios.get(`/api/messages/${receiverId}`);
      set({ messages: res.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch messages",
        isLoading: false,
      });
    }
  },

  sendMessage: async (receiverId, text, image) => {
    try {
      const res = await axios.post(`/api/messages`, {
        receiverId,
        text,
        image,
      });

      set({ messages: [...get().messages, res.data] });
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to send message" });
    }
  },
}));
