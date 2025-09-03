"use client";

import { User, Mail, Calendar, Activity } from "lucide-react";
import { useChatStore } from "@/store/chat-store";
import ProtectedRoute from "./protected-route";
import { useAuthStore } from "@/store/auth-store";
import Link from "next/link";

export function SelectedUserProfilePage() {
  const { selectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  // If no selected user, show a fallback UI
  if (!selectedUser) {
    return (
      <ProtectedRoute redirectTo="/signin">
        <div className="flex min-h-screen items-center justify-center bg-black">
          <p className="text-lg text-gray-400">
            No user selected. Please choose a chat.
          </p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute redirectTo="/signin">
      <section className="min-h-screen w-full">
        <div
          className="absolute min-h-screen w-full bg-black"
          style={{
            background: `
              radial-gradient(ellipse 120% 80% at 70% 20%, rgba(255, 20, 147, 0.15), transparent 50%),
              radial-gradient(ellipse 100% 60% at 30% 10%, rgba(0, 255, 255, 0.12), transparent 60%),
              radial-gradient(ellipse 90% 70% at 50% 0%, rgba(138, 43, 226, 0.18), transparent 65%),
              radial-gradient(ellipse 110% 50% at 80% 30%, rgba(255, 215, 0, 0.08), transparent 40%),
              #000000
            `,
          }}
        />

        <div className="relative z-10 flex min-h-screen w-full items-center justify-center px-4">
          <div className="w-full max-w-2xl rounded-2xl bg-black/30 p-8 shadow-2xl shadow-purple-700/40 backdrop-blur-xl">
            {/* Header */}
            <div className="mb-6 text-center">
              <h1 className="text-3xl font-bold tracking-wide text-purple-400">
                User Profile
              </h1>
              <p className="text-gray-400">
                Viewing {selectedUser.firstName}'s profile
              </p>
            </div>

            {/* Avatar Display */}
            <div className="mb-8 flex flex-col items-center gap-4">
              <div className="relative">
                <img
                  src={selectedUser?.profilePic || "/assets/images/avatar.webp"}
                  alt="Profile"
                  className="size-32 rounded-full border-4 border-purple-600/40 object-cover shadow-lg shadow-purple-500/50"
                />

                {/* Online / Offline Badge */}
                <span
                  className={`absolute right-2 bottom-2 block h-4 w-4 rounded-full border border-black ${
                    onlineUsers.includes(selectedUser._id)
                      ? "bg-green-500 shadow-md shadow-green-400"
                      : "bg-gray-500 shadow-md shadow-gray-400"
                  }`}
                />
              </div>

              <p className="text-sm text-gray-400">
                {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
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
                <div className="rounded-xl bg-gray-900/40 px-4 py-3 text-sm font-medium text-gray-200 shadow-inner shadow-purple-700/30">
                  {selectedUser?.firstName} {selectedUser?.lastName}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-1 flex items-center gap-2 text-sm text-purple-400">
                  <Mail className="h-4 w-4" />
                  Email Address
                </label>
                <div className="rounded-xl bg-gray-900/40 px-4 py-3 text-sm font-medium text-gray-200 shadow-inner shadow-purple-700/30">
                  {selectedUser?.email}
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
                  <span className="flex items-center gap-1 text-gray-400">
                    <Calendar className="h-4 w-4" /> Member Since
                  </span>
                  <span className="font-medium text-gray-200">
                    {selectedUser?.createdAt
                      ? selectedUser?.createdAt.split("T")[0]
                      : "N/A"}
                  </span>
                </div>

                {/* Account Status */}
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-gray-400">
                    <Activity className="h-4 w-4" /> Status
                  </span>
                  <span
                    className={`font-medium ${
                      onlineUsers.includes(selectedUser._id)
                        ? "text-green-400"
                        : "text-gray-400"
                    }`}
                  >
                    {onlineUsers.includes(selectedUser._id)
                      ? "Active Now"
                      : "Offline"}
                  </span>
                </div>
              </div>
            </div>

            {/* Back Button */}
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
