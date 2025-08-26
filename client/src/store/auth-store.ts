import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "@/lib/axios";

interface AuthUserData {
  firstName: string;
  lastName: string;
  email: String;
  password: String;
}

interface AuthStore {
  authUser: null | AuthUserData;
  isSigningUp: boolean;
  signup: (data: AuthUserData) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  authUser: null,
  isSigningUp: false,

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
}));
