import { create } from "zustand";
import type { AuthUserData } from "@/types/user-types";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./auth-store";

interface SendMessagePayload {
  text: string;
  image?: string | null;
}

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  text?: string;
  image?: string;
  isEdited?: boolean;
  createdAt: string;
}

interface ChatStore {
  selectedUser: AuthUserData | null;
  messages: Message[];
  users: AuthUserData[];
  isLoading: boolean;
  isSendingMessage: boolean;
  isDeletingMessage: boolean;
  usersFetching: boolean;
  error: string | null;

  // Actions
  fetchUsers: () => Promise<void>;
  setSelectedUser: (userId: AuthUserData | null) => void;
  getMessages: (userId: string) => Promise<void>;
  sendMessage: (data: SendMessagePayload) => Promise<void>;
  editMessage: (messageId: string, newText: string) => Promise<void>;
  deleteMessageFunc: (messageId: string) => Promise<void>;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  selectedUser: null,
  messages: [],
  users: [],
  isLoading: false,
  isSendingMessage: false,
  isDeletingMessage: false,
  usersFetching: true,
  error: null,

  fetchUsers: async () => {
    set({ usersFetching: true, error: null });
    try {
      const res = await axiosInstance.get<AuthUserData[]>("/users");
      set({ users: res.data });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to fetch users",
      });
    } finally {
      set({ usersFetching: false });
    }
  },

  editMessage: async (messageId, newText) => {
    try {
      await axiosInstance.patch<Message>(`/messages/${messageId}`, {
        text: newText,
      });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Faild to edit message");
    }
  },

  deleteMessageFunc: async (messageId) => {
    set({ isDeletingMessage: true, error: null });
    try {
      await axiosInstance.delete(`/messages/${messageId}`);
    } catch (err: any) {
      toast.error("Failed to delete message");
      set({
        error: err.response?.data?.message || "Failed to fetch users",
      });
    } finally {
      set({ isDeletingMessage: false });
    }
  },

  setSelectedUser: (user) => set({ selectedUser: user }),

  getMessages: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get<Message[]>(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch messages",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("newMessage", (newMessage: Message) => {
      set({ messages: [...get().messages, newMessage] });

      if (newMessage.senderId !== useAuthStore.getState().authUser?._id) {
        const sound = new Audio("/assets/sounds/notification.mp3");
        sound.play().catch((err) => console.log("Audio play failed:", err));
      }
    });

    socket.on("messageEdited", (updateMessage: Message) => {
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === updateMessage._id ? updateMessage : msg,
        ),
      }));
    });

    socket.on("messageDeleted", (deletedMessage: Message) => {
      set((state) => ({
        messages: state.messages.filter(
          (msg) => msg._id !== deletedMessage._id,
        ),
      }));

      const sound = new Audio("/assets/sounds/delete.wav");
      sound.play().catch((err) => console.log("Audio play failed:", err));
    });
  },

  // Unsubscribe from Socket.IO events to prevent memory leaks
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket?.off("newMessage");
  },

  sendMessage: async ({ text, image }: SendMessagePayload) => {
    const { selectedUser, messages } = get();

    if (!selectedUser) {
      toast.error("Please select a user first");
      return;
    }

    set({ isSendingMessage: true });

    try {
      const res = await axiosInstance.post<Message>(
        `/messages/send/${selectedUser._id}`,
        { text, image },
      );

      set({ messages: [...messages, res.data] });

      const socket = useAuthStore.getState().socket;
      socket?.emit("sendMessage", res.data);
    } catch (err) {
      if (err instanceof Error) toast.error(err.message);
    } finally {
      set({ isSendingMessage: false });
    }
  },
}));
