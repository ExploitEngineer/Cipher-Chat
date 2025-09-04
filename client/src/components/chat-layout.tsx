"use client";

import { useState, useEffect, useRef, ChangeEvent, FormEvent } from "react";
import { useChatStore } from "@/store/chat-store";
import { useAuthStore } from "@/store/auth-store";
import NoMessagesPage from "./no-messages-page";
import Image from "next/image";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Line } from "./line";
import Link from "next/link";
import {
  Image as ImageIcon,
  Settings,
  Check,
  CheckCheck,
  ChevronDown,
  Trash,
  Pencil,
  X,
  AlertTriangle,
} from "lucide-react";
import { formatMessageTime } from "@/lib/format-time";
import { formatLastSeen } from "@/lib/format-last-seen";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ChatLayout() {
  const {
    selectedUser,
    setSelectedUser,
    messages,
    getMessages,
    sendMessage,
    usersFetching,
    fetchUsers,
    users,
    isLoading,
    editMessage,
  } = useChatStore();

  const { authUser, onlineUsers } = useAuthStore();

  const [text, setText] = useState<string>("");
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    useChatStore.getState().subscribeToMessages();
    return () => {
      useChatStore.getState().unsubscribeFromMessages();
    };
  }, []);

  // Handle image preview
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

  // Handle message sending
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

  // Fetch users initially
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Fetch messages whenever selected user changes
  useEffect(() => {
    if (selectedUser?._id) getMessages(selectedUser._id);
  }, [selectedUser?._id, getMessages]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
            {/* Sidebar Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="mb-2 text-2xl font-bold tracking-wide text-purple-400">
                  Chats
                </h2>
                <Line />
              </div>
              <Link href="/profile">
                <button className="me-4 cursor-pointer rounded-full p-2 transition-all duration-300 hover:scale-110 hover:bg-purple-700/30">
                  <Settings className="h-5 w-5 text-purple-400 hover:text-purple-300" />
                </button>
              </Link>
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
                    onClick={() => setSelectedUser(user)}
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
                          onlineUsers.includes(user?._id)
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
                          onlineUsers.includes(user._id)
                            ? "text-green-400"
                            : "text-gray-400"
                        }`}
                      >
                        {onlineUsers.includes(user._id) ? (
                          <span className="text-xs text-green-400">Online</span>
                        ) : (
                          <span className="text-xs text-gray-400">
                            Last seen: {formatLastSeen(user.lastSeen)}
                          </span>
                        )}
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
                {/* Chat Header */}
                <Link href="/user-profile">
                  <div className="flex items-center gap-4 p-4 shadow-lg shadow-purple-700/40">
                    <Image
                      src={
                        selectedUser.profilePic || "/assets/images/avatar.webp"
                      }
                      width={45}
                      height={45}
                      className="rounded-full border border-transparent shadow-md"
                      alt={selectedUser.firstName}
                    />
                    <div>
                      <h2 className="text-lg font-semibold text-white">
                        {selectedUser.firstName} {selectedUser.lastName}
                      </h2>
                      {onlineUsers.includes(selectedUser._id) ? (
                        <p className="text-sm text-green-400">Online</p>
                      ) : (
                        <p className="text-sm text-gray-400">
                          Last seen: {formatLastSeen(selectedUser.lastSeen)}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
                {/* Messages */}
                <div className="custom-scrollbar flex flex-1 flex-col space-y-3 overflow-y-auto p-6">
                  {isLoading ? (
                    <p className="text-gray-400">Loading messages...</p>
                  ) : messages.length > 0 ? (
                    messages.map((msg) => (
                      <div
                        key={msg._id}
                        className={`flex w-full ${
                          msg.senderId === authUser?._id
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`group relative max-w-[60%] min-w-[130px] space-y-3 rounded-2xl px-4 py-2 text-sm break-words shadow-lg transition-all duration-300 ${
                            msg.senderId === authUser?._id
                              ? "bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-purple-600/50"
                              : "bg-gray-800 text-gray-200 shadow-black/40"
                          }`}
                        >
                          {msg.senderId === authUser?._id ? (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                {isEditing ? null : (
                                  <button
                                    className={`pointer-events-none absolute top-2 right-2 cursor-pointer rounded-full p-1 opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100`}
                                    type="button"
                                  >
                                    <ChevronDown
                                      size={16}
                                      className="text-gray-400 transition hover:text-white"
                                    />
                                  </button>
                                )}
                              </DropdownMenuTrigger>

                              <DropdownMenuContent
                                className="w-40 rounded-md border border-gray-700 bg-gray-900 text-white shadow-lg"
                                side="right"
                                align="start"
                                sideOffset={6}
                              >
                                <DropdownMenuGroup>
                                  <DropdownMenuItem
                                    className="cursor-pointer transition hover:bg-purple-600/30"
                                    onClick={() => {
                                      setIsEditing(msg._id);
                                      setEditText(msg.text || "");
                                    }}
                                  >
                                    Edit
                                    <DropdownMenuShortcut>
                                      <Pencil />
                                    </DropdownMenuShortcut>
                                  </DropdownMenuItem>

                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <DropdownMenuItem
                                        onSelect={(e) => {
                                          e.preventDefault();
                                        }}
                                        className="cursor-pointer transition hover:bg-purple-600/30"
                                      >
                                        Delete
                                        <DropdownMenuShortcut>
                                          <Trash className="h-4 w-4" />
                                        </DropdownMenuShortcut>
                                      </DropdownMenuItem>
                                    </DialogTrigger>

                                    <DialogContent
                                      showCloseButton={false}
                                      className="w-full rounded-2xl border border-purple-700/40 bg-gradient-to-b from-purple-950 via-gray-950 to-purple-950 shadow-2xl shadow-purple-800/80 backdrop-blur-xl sm:max-w-md"
                                    >
                                      <DialogClose asChild>
                                        <button className="absolute top-4 right-4 cursor-pointer rounded-full p-1 text-white transition-colors hover:text-white">
                                          <X className="h-5 w-5" />
                                        </button>
                                      </DialogClose>

                                      <DialogHeader className="flex gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center self-center rounded-full border border-red-500/30 bg-red-600/20 shadow-md">
                                          <AlertTriangle className="h-5 w-5 text-red-400" />
                                        </div>
                                        <div>
                                          <DialogTitle className="text-xl font-bold text-white">
                                            Delete Message
                                          </DialogTitle>
                                          <DialogDescription className="text-sm text-gray-400">
                                            Are you sure you want to delete this
                                            message?
                                            <span className="mt-1 block font-semibold text-red-400">
                                              This action cannot be undone.
                                            </span>
                                          </DialogDescription>
                                        </div>
                                      </DialogHeader>

                                      <div className="mt-5 flex flex-col gap-2">
                                        <label
                                          htmlFor="confirm"
                                          className="text-sm text-gray-400"
                                        >
                                          Type{" "}
                                          <span className="font-semibold text-red-400">
                                            DELETE
                                          </span>{" "}
                                          to confirm:
                                        </label>
                                        <Input
                                          id="confirm"
                                          placeholder="Type DELETE here"
                                          className="rounded-lg border border-purple-700/50 bg-gray-800/80 text-white placeholder-gray-500 shadow-inner shadow-purple-700/30 focus-visible:border-purple-500 focus-visible:ring-1 focus-visible:ring-purple-500"
                                        />
                                      </div>

                                      <DialogFooter className="mt-6 flex justify-end gap-3">
                                        <DialogClose asChild>
                                          <Button
                                            type="button"
                                            variant="secondary"
                                            className="cursor-pointer rounded-lg bg-gray-700 px-5 py-2 text-white shadow-md transition-all duration-300 hover:bg-gray-600 hover:shadow-gray-500/30"
                                          >
                                            Cancel
                                          </Button>
                                        </DialogClose>

                                        <Button
                                          type="button"
                                          className="cursor-pointer rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-5 py-2 text-white shadow-md shadow-red-800/50 transition-all duration-300 hover:scale-105 hover:shadow-red-600/70"
                                        >
                                          Delete
                                        </Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                </DropdownMenuGroup>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          ) : null}

                          {isEditing === msg._id ? (
                            <form
                              onSubmit={async (e) => {
                                e.preventDefault();
                                if (
                                  editText.trim() === msg.text ||
                                  editText.trim() === ""
                                ) {
                                  setIsEditing(null);
                                  return;
                                }
                                await editMessage(msg._id, editText);
                                setIsEditing(null);
                                setEditText("");
                              }}
                              className="flex flex-col gap-2"
                            >
                              <textarea
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    e.currentTarget.form?.requestSubmit();
                                  }
                                  if (e.key === "Escape") {
                                    setIsEditing(null);
                                    setEditText("");
                                  }
                                }}
                                autoFocus
                                className="flex-1 overflow-y-hidden rounded-lg bg-gray-700 px-3 py-2 text-white placeholder-gray-400 shadow-md transition-all duration-300 outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Edit your message..."
                              />

                              <div className="flex items-center gap-2">
                                <Button
                                  type="submit"
                                  size="sm"
                                  className="cursor-pointer rounded-lg bg-blue-600/80 px-3 py-1 text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-purple-800"
                                >
                                  Save
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  className="cursor-pointer rounded-lg bg-gray-600 px-3 py-1 text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-gray-700"
                                  onClick={() => {
                                    setIsEditing(null);
                                    setEditText("");
                                  }}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </form>
                          ) : (
                            <div className="me-5 flex items-center gap-2">
                              <p className="break-words">{msg?.text}</p>
                              {msg?.isEdited && (
                                <span className="text-xs text-gray-400 italic">
                                  (edited)
                                </span>
                              )}
                            </div>
                          )}

                          {msg.image && (
                            <img
                              src={msg.image}
                              alt="attachment"
                              className="mt-2 max-w-full rounded-xl border border-purple-700/40 shadow-md"
                            />
                          )}
                          <p className="mt-1 text-right text-[11px] font-medium text-gray-400">
                            <span className="flex items-center justify-end">
                              {formatMessageTime(msg.createdAt)}
                              {msg.senderId === authUser?._id && (
                                <span className="ml-1 flex items-center">
                                  {onlineUsers.includes(selectedUser?._id) ? (
                                    <CheckCheck color="white" size={15} />
                                  ) : (
                                    <Check color="white" size={15} />
                                  )}
                                </span>
                              )}
                            </span>
                          </p>
                        </div>
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
                    onChange={(e) => setText(e.target.value)}
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
