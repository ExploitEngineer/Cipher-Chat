import { create } from "zustand";
import type { AuthUserData } from "@/types/user-types";
import axios from "axios";
import { axiosInstance } from "@/lib/axios";

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
  users: AuthUserData[];
  isLoading: boolean;
  usersFetching: boolean;
  error: string | null;

  // Actions
  fetchUsers: () => Promise<void>;
  setSelectedUser: (userId: string | undefined) => void;
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
  users: [],
  isLoading: false,
  usersFetching: true,
  error: null,

  fetchUsers: async () => {
    set({ usersFetching: true, error: null });
    try {
      const res = await axiosInstance.get<AuthUserData[]>("/users");
      set({ users: res.data, usersFetching: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to fetch users",
        usersFetching: false,
      });
    }
  },

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
