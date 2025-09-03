export function formatLastSeen(date: Date | string) {
  if (!date) return "Unknown";
  const lastSeen = new Date(date);
  const now = new Date();
  const diff = Math.floor((now.getTime() - lastSeen.getTime()) / 1000);

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;

  return lastSeen.toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
