"use client";

import { useState, useEffect, useRef, ChangeEvent, FormEvent } from "react";
import { useChatStore } from "@/store/chat-store";
import NoMessagesPage from "./no-messages-page";
import Image from "next/image";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Line } from "./line";
import { Image as ImageIcon, X } from "lucide-react";
import { formatMessageTime } from "@/lib/format-time";

export default function ChatLayout() {
  const {
    selectedUser,
    setSelectedUser,
    messages,
    getMessages,
    usersFetching,
    fetchUsers,
    users,
    sendMessage,
    isLoading,
  } = useChatStore();

  const [text, setText] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  // ✅ Handle image preview
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // ✅ Remove selected image
  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ✅ Handle message sending
  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // ✅ Fetch users initially
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ✅ Fetch messages whenever selected user changes
  useEffect(() => {
    if (selectedUser?._id) getMessages(selectedUser._id);
  }, [selectedUser?._id, getMessages]);

  // ✅ Auto-scroll on new messages
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <section className="min-h-screen w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="h-20 w-20 rounded-lg border border-zinc-700 object-cover"
            />
            <button
              onClick={removeImage}
              className="bg-base-300 absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <div className="relative min-h-screen w-full bg-black">
        <div
          className="absolute inset-0 z-0"
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

        <div className="flex h-screen w-full text-white backdrop-blur-lg">
          {/* Sidebar */}
          <div className="w-76 border-r border-transparent bg-black/40 p-5 shadow-2xl shadow-purple-700/50 backdrop-blur-lg">
            {/* Sidebar Heading */}
            <div className="mb-6">
              <h2 className="mb-2 text-2xl font-bold tracking-wide text-purple-400">
                Chats
              </h2>
              <Line />
            </div>

            <div className="space-y-3">
              {usersFetching ? (
                <h1 className="text-center text-sm text-white">
                  Loading users...
                </h1>
              ) : (
                users.map((user) => (
                  <div
                    key={user._id}
                    onClick={() => setSelectedUser(user)} // ✅ FIXED — pass full user object
                    className={`group flex cursor-pointer items-center gap-4 rounded-2xl px-3 py-3 transition-all duration-300 hover:scale-[1.02] ${
                      selectedUser?._id === user._id
                        ? "bg-gradient-to-r from-purple-700/50 to-purple-900/30 shadow-lg shadow-purple-600/40"
                        : "bg-black/20 hover:bg-purple-800/30"
                    }`}
                  >
                    {/* User Avatar */}
                    <div className="relative">
                      <Image
                        src={user.profilePic || "/assets/images/avatar.webp"}
                        width={50}
                        height={50}
                        className="rounded-full border border-transparent shadow-md transition-all duration-300 group-hover:shadow-purple-500/50"
                        alt={user.firstName}
                      />
                      {/* Status Badge */}
                      <span
                        className={`absolute right-1 bottom-1 block h-3 w-3 rounded-full border border-black ${
                          user.status === "online"
                            ? "bg-green-500"
                            : "bg-gray-500"
                        }`}
                      />
                    </div>

                    {/* User Info */}
                    <div className="flex flex-col">
                      <span className="font-medium text-white">
                        {user.firstName} {user.lastName}
                      </span>
                      <span
                        className={`text-xs ${
                          user.status === "online"
                            ? "text-green-400"
                            : "text-gray-400"
                        }`}
                      >
                        {user.status === "online" ? "Online" : "Offline"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex flex-1 flex-col">
            {selectedUser ? (
              <div className="flex h-full flex-col bg-black/20 backdrop-blur-md">
                {/* Messages */}
                <div className="flex-1 space-y-4 overflow-y-auto p-6">
                  {isLoading ? (
                    <p className="text-gray-400">Loading messages...</p>
                  ) : messages.length > 0 ? (
                    messages.map((msg) => (
                      <div
                        key={msg._id}
                        className={`max-w-xs rounded-2xl px-4 py-2 text-sm shadow-lg transition-all duration-300 ${
                          msg.senderId === selectedUser._id
                            ? "self-start bg-gray-800 text-gray-200 shadow-black/40"
                            : "self-end bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-purple-600/50"
                        }`}
                      >
                        {msg.text && <p>{msg.text}</p>}
                        {msg.image && (
                          <img
                            src={msg.image}
                            alt="attachment"
                            className="mt-2 max-h-48 rounded-xl border border-purple-700/40 shadow-md"
                          />
                        )}
                        {/* ✅ Show message time */}
                        <p className="mt-1 text-right text-xs text-gray-400">
                          {formatMessageTime(msg.createdAt)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <NoMessagesPage />
                  )}
                  <div ref={messageEndRef} />
                </div>

                {/* Input Box */}
                <form
                  onSubmit={handleSendMessage}
                  className="flex items-center gap-3 border-t border-transparent bg-black/40 px-20 pt-4 pb-6 backdrop-blur-lg"
                >
                  <label
                    htmlFor="image-upload"
                    className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-gray-900/50 shadow-inner shadow-purple-700/30 transition-all duration-300 hover:bg-purple-800/30 hover:shadow-purple-600/50"
                  >
                    <ImageIcon className="h-6 w-6 text-purple-400" />
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                    />
                  </label>

                  <Input
                    type="text"
                    name="message"
                    value={text}
                    onChange={(e) => setText(e.target.value)} // ✅ FIXED controlled input
                    placeholder="Type a message..."
                    className="h-14 flex-1 rounded-full border border-transparent bg-gray-900/50 px-6 text-white placeholder-gray-400 shadow-inner shadow-purple-700/30 transition-all duration-300 focus-visible:border-purple-500 focus-visible:ring-1 focus-visible:ring-purple-600"
                  />

                  <Button
                    type="submit"
                    className="h-14 cursor-pointer rounded-full bg-gradient-to-r from-purple-600 to-purple-800 px-8 py-3 text-white shadow-lg shadow-purple-700/50 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/70"
                  >
                    Send
                  </Button>
                </form>
              </div>
            ) : (
              <NoMessagesPage />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
