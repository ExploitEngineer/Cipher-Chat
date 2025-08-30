import { Line } from "./line";
import { MessageCircle } from "lucide-react";

export default function NoMessagesPage() {
  return (
    <div className="flex flex-1 items-center justify-center text-gray-400">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="mb-6">
          <MessageCircle size={140} strokeWidth={1.5} color="#8011d1" />
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-white">
          Welcome to Cipher Chat 💬
        </h2>
        <p className="mt-2 mb-6 text-sm leading-relaxed text-gray-400">
          Select a user from the sidebar to start chatting. Stay connected and
          enjoy a clean, modern messaging experience.
        </p>

        {/* Decorative Line */}
        <Line />
      </div>
    </div>
  );
}
