"use client";

import { Camera, User, Mail } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import ProtectedRoute from "./protected-route";
import { useState } from "react";
import { toast } from "react-hot-toast";

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
      } catch (err) {
        if (err instanceof Error) {
          toast.error(err.message);
        }
      }
    };
  };

  return (
    <ProtectedRoute redirectTo="/signin">
      <div className="h-screen pt-20">
        <div className="mx-auto max-w-2xl p-4 py-8">
          <Card className="space-y-8 rounded-xl p-6">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-semibold">Profile</CardTitle>
              <CardDescription>Your profile information</CardDescription>
            </CardHeader>

            <CardContent>
              {/* Avatar upload */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <img
                    src={selectedImage || authUser?.profilePic || "/avatar.png"}
                    alt="Profile"
                    className="size-32 rounded-full border-4 object-cover"
                  />

                  <label
                    htmlFor="avatar-upload"
                    className={`bg-background absolute right-0 bottom-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border shadow-md transition-all hover:scale-105 ${
                      isUpdatingProfile
                        ? "pointer-events-none animate-pulse opacity-70"
                        : ""
                    }`}
                  >
                    <Camera className="text-foreground h-5 w-5" />
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

                <p className="text-muted-foreground mb-5 text-sm">
                  {isUpdatingProfile
                    ? "Uploading..."
                    : "Click the camera icon to update your photo"}
                </p>
              </div>

              <div className="space-y-6">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <User className="size-4" />
                    Full Name
                  </div>
                  <div className="bg-muted rounded-lg border px-4 py-2.5 text-sm font-medium">
                    {authUser?.firstName} {authUser?.lastName}
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <Mail className="size-4" />
                    Email Address
                  </div>
                  <div className="bg-muted rounded-lg border px-4 py-2.5 text-sm font-medium">
                    {authUser?.email}
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div className="bg-card mt-6 rounded-xl border p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-medium">
                  Account Information
                </h2>
                <div className="space-y-3 text-sm">
                  {/* Member Since */}
                  <div className="border-border flex items-center justify-between border-b py-2">
                    <span className="text-muted-foreground">Member Since</span>
                    <span className="font-medium">
                      {authUser?.createdAt?.split("T")[0]}
                    </span>
                  </div>

                  {/* Account Status */}
                  <div className="flex items-center justify-between py-2">
                    <span className="text-muted-foreground">
                      Account Status
                    </span>
                    <span className="font-medium text-green-500">Active</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
