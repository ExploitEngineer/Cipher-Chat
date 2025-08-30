"use client";

import { useEffect } from "react";
import { useChatStore } from "@/store/chat-store";
import NoMessagesPage from "./no-messages-page";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Line } from "./line";

interface Users {
  id: string;
  name: string;
  avatar: string;
  status: string;
}

const users: Users[] = [
  {
    id: "1",
    name: "John Doe",
    avatar: "/assets/images/avatar.webp",
    status: "online",
  },
  {
    id: "2",
    name: "Alice Smith",
    avatar: "/assets/images/avatar.webp",
    status: "offline",
  },
  {
    id: "3",
    name: "David Johnson",
    avatar: "/assets/images/avatar.webp",
    status: "online",
  },
];

export default function ChatLayout() {
  const {
    selectedUser,
    setSelectedUser,
    messages,
    fetchMessages,
    sendMessage,
    isLoading,
  } = useChatStore();

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser);
    }
  }, [selectedUser, fetchMessages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const input = (e.target as HTMLFormElement).message;
    if (!input.value.trim()) return;
    await sendMessage(selectedUser!, input.value);
    input.value = "";
  };

  return (
    <section className="min-h-screen w-full">
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
              {users.map((user) => (
                <div
                  key={user.id}
                  onClick={() => setSelectedUser(user.id)}
                  className={`group flex cursor-pointer items-center gap-4 rounded-2xl px-3 py-3 transition-all duration-300 hover:scale-[1.02] ${
                    selectedUser === user.id
                      ? "bg-gradient-to-r from-purple-700/50 to-purple-900/30 shadow-lg shadow-purple-600/40"
                      : "bg-black/20 hover:bg-purple-800/30"
                  }`}
                >
                  {/* User Avatar */}
                  <div className="relative">
                    <Image
                      src={user.avatar}
                      width={50}
                      height={50}
                      className="rounded-full border border-transparent shadow-md transition-all duration-300 group-hover:shadow-purple-500/50"
                      alt={user.name}
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
                    <span className="font-medium text-white">{user.name}</span>
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
              ))}
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
                          msg.senderId === "currentUserId"
                            ? "self-end bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-purple-600/50"
                            : "self-start bg-gray-800 text-gray-200 shadow-black/40"
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
                      </div>
                    ))
                  ) : (
                    <NoMessagesPage />
                  )}
                </div>

                {/* Input Box */}
                <form
                  onSubmit={handleSend}
                  className="flex gap-3 border-t border-transparent bg-black/40 px-20 pt-4 pb-6 backdrop-blur-lg"
                >
                  {/* ShadCN Input */}
                  <Input
                    type="text"
                    name="message"
                    placeholder="Type a message..."
                    className="h-14 flex-1 rounded-full border border-transparent bg-gray-900/50 px-6 text-white placeholder-gray-400 shadow-inner shadow-purple-700/30 transition-all duration-300 focus-visible:border-purple-500 focus-visible:ring-1 focus-visible:ring-purple-600"
                  />

                  {/* ShadCN Button */}
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
