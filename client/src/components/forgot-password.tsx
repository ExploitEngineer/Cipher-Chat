"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormEvent, useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState<string>("");

  const { isSendingEmail, sendEmail } = useAuthStore();

  const validateForm = () => {
    if (!email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(email)) return toast.error("Invalid email format");
    return true;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const success = validateForm();

    if (success) sendEmail(email);
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
              Recover Password
            </h1>
            <p className="text-sm text-zinc-300">
              Enter your email to receive a reset link
            </p>
          </div>

          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-zinc-200">
                Email
              </Label>
              <Input
                type="email"
                required
                disabled={isSendingEmail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                placeholder="name@example.com"
                className="border-zinc-700 bg-zinc-900 text-white placeholder:text-zinc-500 focus-visible:!border-zinc-700 focus-visible:!ring-0 focus-visible:!ring-offset-0"
              />
            </div>

            <Button
              type="submit"
              className="w-full cursor-pointer bg-purple-800 text-white shadow-lg hover:bg-purple-700"
            >
              {isSendingEmail ? (
                <>
                  <Loader2 color="white" className="size-5 animate-spin" />
                  Sending Email...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-zinc-400">
              We'll send you a link to reset your password.
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
