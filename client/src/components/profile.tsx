"use client";

import { Camera, User, Mail } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import ProtectedRoute from "./protected-route";
import { useState } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function ProfilePage() {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result as string;
      setSelectedImage(base64Image);
      try {
        await updateProfile({ profilePic: base64Image });
        toast.success("Profile updated successfully!");
      } catch (err) {
        if (err instanceof Error) {
          toast.error(err.message);
        }
      }
    };
  };

  return (
    <ProtectedRoute redirectTo="/signin">
      <section className="min-h-screen w-full">
        <div
          className="absolute min-h-screen w-full bg-black"
          style={{
            background: `
              radial-gradient(ellipse 120% 80% at 70% 20%, rgba(255, 20, 147, 0.12), transparent 50%),
              radial-gradient(ellipse 100% 60% at 30% 10%, rgba(0, 255, 255, 0.1), transparent 60%),
              radial-gradient(ellipse 90% 70% at 50% 0%, rgba(138, 43, 226, 0.18), transparent 65%),
              radial-gradient(ellipse 110% 50% at 80% 30%, rgba(255, 215, 0, 0.08), transparent 40%),
              #000000
            `,
          }}
        />

        <div className="relative z-10 flex min-h-screen w-full items-center justify-center px-4">
          <div className="w-full max-w-2xl rounded-2xl bg-black/40 p-8 shadow-2xl shadow-purple-700/50 backdrop-blur-xl">
            {/* Header */}
            <div className="mb-6 text-center">
              <h1 className="text-3xl font-bold tracking-wide text-purple-400">
                Profile Settings
              </h1>
              <p className="text-gray-400">Manage your account details</p>
            </div>

            {/* Avatar Upload */}
            <div className="mb-8 flex flex-col items-center gap-4">
              <div className="relative">
                <img
                  src={
                    selectedImage ||
                    authUser?.profilePic ||
                    "/assets/images/avatar.webp"
                  }
                  alt="Profile"
                  className="size-32 rounded-full border-4 border-purple-600/40 object-cover shadow-lg shadow-purple-500/50"
                />

                {/* Upload Button */}
                <label
                  htmlFor="avatar-upload"
                  className={`absolute right-0 bottom-0 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-purple-600/70 shadow-lg shadow-purple-500/50 transition-all duration-300 hover:scale-105 hover:bg-purple-700/80 ${
                    isUpdatingProfile
                      ? "pointer-events-none animate-pulse opacity-60"
                      : ""
                  }`}
                >
                  <Camera className="h-5 w-5 text-white" />
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUpdatingProfile}
                  />
                </label>
              </div>

              <p className="text-sm text-gray-400">
                {isUpdatingProfile
                  ? "Uploading..."
                  : "Click the camera icon to update your photo"}
              </p>
            </div>

            {/* User Info */}
            <div className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="mb-1 flex items-center gap-2 text-sm text-purple-400">
                  <User className="h-4 w-4" />
                  Full Name
                </label>
                <div className="rounded-xl bg-gray-900/50 px-4 py-3 text-sm font-medium text-gray-200 shadow-inner shadow-purple-700/30">
                  {authUser?.firstName} {authUser?.lastName}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-1 flex items-center gap-2 text-sm text-purple-400">
                  <Mail className="h-4 w-4" />
                  Email Address
                </label>
                <div className="rounded-xl bg-gray-900/50 px-4 py-3 text-sm font-medium text-gray-200 shadow-inner shadow-purple-700/30">
                  {authUser?.email}
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div className="mt-8 rounded-2xl border border-purple-700/30 bg-gray-900/30 p-6 shadow-lg shadow-purple-600/20 backdrop-blur-md">
              <h2 className="mb-4 text-lg font-semibold text-purple-400">
                Account Information
              </h2>
              <div className="space-y-3 text-sm">
                {/* Member Since */}
                <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                  <span className="text-gray-400">Member Since</span>
                  <span className="font-medium text-gray-200">
                    {authUser?.createdAt?.split("T")[0]}
                  </span>
                </div>

                {/* Account Status */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Account Status</span>
                  <span className="font-medium text-green-400">Active</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <Link
                href="/"
                className="rounded-full bg-gradient-to-r from-purple-600 to-purple-800 px-6 py-2 text-white shadow-lg shadow-purple-700/40 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/60"
              >
                Back to Chats
              </Link>
            </div>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
