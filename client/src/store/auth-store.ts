import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "@/lib/axios";

interface AuthUserData {
  firstName: string;
  lastName: string;
  email: String;
  password: String;
  profilePic?: String;
  _id?: String;
}

interface AuthStore {
  readonly authUser: null | AuthUserData;
  isSigningUp: boolean;
  isSigningIn: boolean;
  isSendingEmail: boolean;
  isPasswordResetting: boolean;

  signup: (data: AuthUserData) => Promise<void>;
  signin: (data: Pick<AuthUserData, "email" | "password">) => Promise<void>;
  sendEmail: (data: string) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  authUser: null,
  isSigningUp: false,
  isSigningIn: false,
  isSendingEmail: false,
  isPasswordResetting: false,

  signup: async (data: AuthUserData) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post<AuthUserData>("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    } finally {
      set({ isSigningUp: false });
    }
  },

  signin: async (data: Pick<AuthUserData, "email" | "password">) => {
    set({ isSigningIn: true });
    try {
      const res = await axiosInstance.post<AuthUserData>("/auth/signin", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    } finally {
      set({ isSigningIn: false });
    }
  },

  sendEmail: async (email: string) => {
    set({ isSendingEmail: true });
    try {
      const res = await axiosInstance.post("/auth/forgot-password", { email });
      console.log("Response", res);
      toast.success("Email send successfully");
    } catch (err) {
      if (err instanceof Error) {
        toast.error(`server error ${err.message}`);
      }
    } finally {
      set({ isSendingEmail: false });
    }
  },
}));
