"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

export function ResetPasswordPage() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const { reset, isPasswordResetting } = useAuthStore();

  const validateForm = () => {
    if (!formData.password || !formData.confirmPassword)
      return toast.error("Password is required");
    if (formData.password.length < 6 && formData.confirmPassword.length < 6)
      return toast.error("Password must be at least 6 characters");

    if (formData.password !== formData.confirmPassword) {
      return toast.error("password didn't match!");
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const success = validateForm();

    if (success) {
      await reset({ password: formData.password, token: token! });
      router.push("/");
    }
  };

  return (
    <section className="relative flex h-screen w-full items-center justify-center overflow-hidden px-4 py-16 md:py-32">
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md rounded-lg border border-purple-800 bg-black/30 shadow-xl shadow-purple-600/20 backdrop-blur-sm"
      >
        <div className="p-8 pb-6">
          <div>
            <h1 className="mb-2 text-2xl font-bold text-white">
              Reset Password
            </h1>
            <p className="text-sm text-zinc-300">
              Enter your new password below
            </p>
          </div>

          <div className="mt-6 space-y-6">
            {/* New Password with eye toggle */}
            <div className="relative space-y-2">
              <Label htmlFor="new-password" className="text-sm text-zinc-200">
                New Password
              </Label>
              <div className="flex items-center justify-between rounded-md border border-zinc-700 bg-zinc-900 px-3">
                <Input
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  type={showPassword ? "text" : "password"}
                  required
                  id="pwd"
                  value={formData.password}
                  placeholder="Enter your password"
                  className="flex-1 border-none bg-transparent text-white placeholder:text-zinc-500 focus-visible:!border-none focus-visible:!ring-0 focus-visible:!ring-offset-0"
                />
                <button
                  className="cursor-pointer"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} color="white" />
                  ) : (
                    <Eye size={20} color="white" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label
                htmlFor="confirm-password"
                className="text-sm text-zinc-200"
              >
                Confirm Password
              </Label>
              <Input
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                type="password"
                required
                value={formData.confirmPassword}
                id="confirm-password"
                placeholder="Confirm new password"
                className="border-zinc-700 bg-zinc-900 text-white placeholder:text-zinc-500 focus-visible:!border-zinc-700 focus-visible:!ring-0 focus-visible:!ring-offset-0"
              />
            </div>

            <Button
              disabled={isPasswordResetting}
              className="w-full cursor-pointer bg-purple-800 text-white shadow-lg hover:bg-purple-700"
            >
              {isPasswordResetting ? (
                <>
                  <Loader2 color="white" className="size-5 animate-spin" />
                  Resetting Password ...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-zinc-400">
              Make sure your password is strong and matches in both fields.
            </p>
          </div>
        </div>

        <div className="border-t border-zinc-700 p-4 text-center">
          <p className="text-sm text-zinc-300">
            Remembered your password?
            <Button
              asChild
              variant="link"
              className="ml-1 text-purple-400 hover:text-purple-500"
            >
              <Link href="/signin">Sign in</Link>
            </Button>
          </p>
        </div>
      </form>
    </section>
  );
}
