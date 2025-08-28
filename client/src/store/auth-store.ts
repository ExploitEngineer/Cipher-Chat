import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "@/lib/axios";
import { AxiosError } from "axios";

interface AuthUserData {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profilePic?: string;
  resetPasswordExpires?: Date | undefined;
  resetPasswordToken?: string | undefined;
}

interface ResetParameters {
  password: string;
  token: string;
}

interface AuthStore {
  readonly authUser: null | AuthUserData;
  isSigningUp: boolean;
  isSigningIn: boolean;
  isSendingEmail: boolean;
  isPasswordResetting: boolean;

  signup: (data: AuthUserData) => Promise<void>;
  signin: (data: Pick<AuthUserData, "email" | "password">) => Promise<void>;
  sendEmail: (email: string) => Promise<void>;
  reset: (data: ResetParameters) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  authUser: null,
  isSigningUp: false,
  isSigningIn: false,
  isSendingEmail: false,
  isPasswordResetting: false,

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post<AuthUserData>("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
    } catch (err) {
      set({ authUser: null });
      toast.error("Error signing up");
      const error = err as AxiosError<{ message: string }>;
      console.error(error.response?.data || err);
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
    } catch (err) {
      set({ authUser: null });
      toast.error("Invalid credentials");
      const error = err as AxiosError<{ message: string }>;
      console.error(error.response?.data || err);
    } finally {
      set({ isSigningIn: false });
    }
  },

  sendEmail: async (email) => {
    set({ isSendingEmail: true });
    try {
      const res = await axiosInstance.post("/auth/forgot-password", { email });
      console.log("Response", res);
      toast.success("Email sent successfully");
    } catch (err) {
      toast.error("Error sending email");
      const error = err as AxiosError<{ message: string }>;
      console.error(error.response?.data || err);
    } finally {
      set({ isSendingEmail: false });
    }
  },

  reset: async (data) => {
    set({ isPasswordResetting: true });
    try {
      await axiosInstance.post("/auth/reset-password", data);
      toast.success("Password reset successfully");
    } catch (err) {
      toast.error("Error resetting password");
      const error = err as AxiosError<{ message: string }>;
      console.error(error.response?.data || err);
    } finally {
      set({ isPasswordResetting: false });
    }
  },
}));
