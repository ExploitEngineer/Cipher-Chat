import ChatLayout from "@/components/chat-layout";
import ProtectedRoute from "@/components/protected-route";

export default function Home() {
  return (
    <ProtectedRoute redirectTo="/signup">
      <ChatLayout />
    </ProtectedRoute>
  );
}
