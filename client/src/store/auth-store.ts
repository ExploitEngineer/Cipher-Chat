import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "@/lib/axios";
import { AxiosError } from "axios";
import { io, Socket } from "socket.io-client";
import type { AuthUserData } from "../types/user-types.ts";

interface ResetParameters {
  password: string;
  token: string;
}

interface AuthReturn {
  success: boolean;
}

interface AuthStore {
  authUser: AuthUserData | null;
  isSigningUp: boolean;
  isSigningIn: boolean;
  isSendingEmail: boolean;
  isPasswordResetting: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  socket: Socket | null;
  onlineUsers: string[];

  checkAuth: () => Promise<void>;
  signup: (data: AuthUserData) => Promise<AuthReturn>;
  signin: (
    data: Pick<AuthUserData, "email" | "password">,
  ) => Promise<AuthReturn>;
  sendEmail: (email: string) => Promise<void>;
  reset: (data: ResetParameters) => Promise<AuthReturn>;
  updateProfile: (data: Partial<AuthUserData>) => Promise<void>;
  connectSocket: () => void;
  disconnectSocket: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  authUser: null,
  socket: null,
  isSigningUp: false,
  isSigningIn: false,
  isSendingEmail: false,
  isPasswordResetting: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get<AuthUserData>("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (err) {
      console.error("Error in checkAuth:", err);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });

    try {
      const res = await axiosInstance.post<AuthUserData>("/auth/signup", data);

      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();

      return {
        success: true,
      };
    } catch (err) {
      set({ authUser: null });

      const error = err as AxiosError<{ message: string }>;
      const errorMessage = error.response?.data?.message || "Error signing up";

      toast.error(errorMessage);

      return {
        success: false,
      };
    } finally {
      set({ isSigningUp: false });
    }
  },

  signin: async (data) => {
    set({ isSigningIn: true });

    try {
      const res = await axiosInstance.post<AuthUserData>("/auth/signin", data);

      set({ authUser: res.data });
      toast.success("Logged in successfully");
      get().connectSocket();

      return {
        success: true,
      };
    } catch (err) {
      set({ authUser: null });

      const error = err as AxiosError<{ message: string }>;
      const errorMessage =
        error.response?.data?.message || "Invalid credentials";

      toast.error(errorMessage);

      return {
        success: false,
      };
    } finally {
      set({ isSigningIn: false });
    }
  },

  sendEmail: async (email) => {
    set({ isSendingEmail: true });

    try {
      await axiosInstance.post("/auth/forgot-password", { email });
      toast.success("Email sent successfully");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const errorMessage =
        error.response?.data?.message || "Error sending Email";

      toast.error(errorMessage);
    } finally {
      set({ isSendingEmail: false });
    }
  },

  reset: async (data) => {
    set({ isPasswordResetting: true });

    try {
      await axiosInstance.post("/auth/reset-password", data);
      toast.success("Password reset successfully");

      return {
        success: true,
      };
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const errorMessage =
        error.response?.data?.message || "Error resetting password";

      toast.error(errorMessage);

      return {
        success: false,
      };
    } finally {
      set({ isPasswordResetting: false });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });

    try {
      const res = await axiosInstance.put<AuthUserData>(
        "/auth/update-profile",
        data,
      );
      set({ authUser: res.data });

      toast.success("Profile updated successfully");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const errorMessage =
        error.response?.data?.message || "Error updating Profile";

      toast.error(errorMessage);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser, socket } = get();
    if (!authUser || socket?.connected) return;

    const newSocket = io("http://localhost:4000", {
      query: {
        userId: authUser._id,
      },
    });

    newSocket.connect();
    set({ socket: newSocket });

    newSocket.on("getOnlineUsers", (userIds: string[]) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket?.connected) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));
