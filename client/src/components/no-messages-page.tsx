import { Line } from "./line";

export default function NoMessagesPage() {
  return (
    <div className="flex flex-1 items-center justify-center text-gray-400">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-40 w-40 text-purple-600 opacity-80"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5C7.305 4.5 3.5 8.305 3.5 13c0 1.638.452 3.183 1.237 4.517L3 21l3.595-1.723A8.48 8.48 0 0012 20.5c4.695 0 8.5-3.805 8.5-8.5S16.695 4.5 12 4.5z"
            />
          </svg>
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
