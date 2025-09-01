"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth-store";
import { useState } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";

export function SignupPage() {
  const router = useRouter();

  interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.firstName.trim())
      return toast.error("first name is required");
    if (!formData.lastName.trim()) return toast.error("last name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) return;

    const result = await signup(formData);

    if (result.success) {
      router.push("/");
    }
  };

  return (
    <section className="relative flex h-screen w-full items-center justify-center overflow-hidden px-4 py-16 md:py-32">
      <form
        onSubmit={handleSubmit}
        className="relative min-h-[500px] w-full max-w-md rounded-lg border border-purple-800 bg-black/30 shadow-xl shadow-purple-600/20 backdrop-blur-sm"
      >
        <div className="p-8 pb-6">
          <div>
            <h1 className="mb-2 text-2xl font-bold text-white">
              Create a Cipher Account
            </h1>
            <p className="text-sm text-zinc-300">
              Welcome! Create an account to get started
            </p>
          </div>

          {/* Google Sign-Up*/}
          <div className="mt-6">
            <Button
              onClick={() => {
                window.location.href = `${process.env.NEXT_PUBLIC_URL}/api/auth/google`;
              }}
              type="button"
              variant="outline"
              className="flex w-full cursor-pointer items-center justify-center gap-2 border-zinc-700 bg-zinc-900 text-white shadow-lg hover:bg-zinc-800 hover:text-white"
            >
              <Image
                src="/assets/images/google.svg"
                width={16}
                height={16}
                alt="google"
              />
              <span>Sign up with Google</span>
            </Button>
          </div>

          <hr className="my-4 border-dashed border-zinc-700" />

          {/* Signup Form */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstname" className="text-sm text-zinc-200">
                  Firstname
                </Label>
                <Input
                  type="text"
                  required
                  name="firstName"
                  id="firstname"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className="border-zinc-700 bg-zinc-900 text-white placeholder:text-zinc-500 focus-visible:!border-zinc-700 focus-visible:!ring-0 focus-visible:!ring-offset-0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastname" className="text-sm text-zinc-200">
                  Lastname
                </Label>
                <Input
                  type="text"
                  id="lastname"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="border-zinc-700 bg-zinc-900 text-white placeholder:text-zinc-500 focus-visible:!border-zinc-700 focus-visible:!ring-0 focus-visible:!ring-offset-0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-zinc-200">
                Email
              </Label>
              <Input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                id="email"
                placeholder="name@example.com"
                className="border-zinc-700 bg-zinc-900 text-white placeholder:text-zinc-500 focus-visible:!border-zinc-700 focus-visible:!ring-0 focus-visible:!ring-offset-0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pwd" className="text-sm text-zinc-200">
                Password
              </Label>
              <div className="flex items-center justify-between rounded-md border border-zinc-700 bg-zinc-900 px-3">
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  id="pwd"
                  placeholder="Enter your password"
                  className="flex-1 border-none bg-transparent text-white placeholder:text-zinc-500 focus-visible:!border-none focus-visible:!ring-0 focus-visible:!ring-offset-0"
                />
                <button
                  className="cursor-pointer"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={18} color="white" />
                  ) : (
                    <Eye size={18} color="white" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSigningUp}
              className="w-full cursor-pointer bg-purple-800 text-white shadow-lg hover:bg-purple-700"
            >
              {isSigningUp ? (
                <>
                  <Loader2 color="white" className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </div>
        </div>

        {/* Sign-In Link */}
        <div className="border-t border-zinc-700 p-4 text-center">
          <p className="text-sm text-zinc-300">
            Already have an account?
            <Button
              asChild
              variant="link"
              className="ml-1 text-purple-400 hover:text-purple-500"
            >
              <Link href="/signin">Sign In</Link>
            </Button>
          </p>
        </div>
      </form>
    </section>
  );
}
