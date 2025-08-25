import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";

export function SigninPage() {
  return (
    <section className="relative flex h-screen w-full items-center justify-center overflow-hidden px-4 py-16 md:py-32">
      <form className="relative w-full max-w-md rounded-lg border border-purple-800 bg-black/30 shadow-xl shadow-purple-600/20 backdrop-blur-sm">
        <div className="p-8 pb-6">
          <div>
            <h1 className="mb-2 text-2xl font-bold text-white">
              Sign In to Cipher
            </h1>
            <p className="text-sm text-zinc-300">
              Welcome back! Sign in to continue
            </p>
          </div>

          {/* Google Sign-In */}
          <div className="mt-6">
            <Button
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
              <span>Sign in with Google</span>
            </Button>
          </div>

          <hr className="my-4 border-dashed border-zinc-700" />

          {/* Sign-In Form */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-zinc-200">
                Email
              </Label>
              <Input
                type="email"
                required
                name="email"
                id="email"
                placeholder="name@example.com"
                className="border-zinc-700 bg-zinc-900 text-white placeholder:text-zinc-500 focus-visible:!border-zinc-700 focus-visible:!ring-0 focus-visible:!ring-offset-0"
              />
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="pwd" className="text-sm text-zinc-200">
                  Password
                </Label>
                <Button asChild variant="link" size="sm">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-purple-400 hover:text-purple-500"
                  >
                    Forgot your password?
                  </Link>
                </Button>
              </div>
              <Input
                type="password"
                required
                name="pwd"
                id="pwd"
                placeholder="Enter your password"
                className="border-zinc-700 bg-zinc-900 text-white placeholder:text-zinc-500 focus-visible:!border-zinc-700 focus-visible:!ring-0 focus-visible:!ring-offset-0"
              />
            </div>

            <Button className="w-full cursor-pointer bg-purple-800 text-white shadow-lg hover:bg-purple-700">
              Sign In
            </Button>
          </div>
        </div>

        {/* Sign-Up Link */}
        <div className="border-t border-zinc-700 p-4 text-center">
          <p className="text-sm text-zinc-300">
            Don't have an account?
            <Button
              asChild
              variant="link"
              className="ml-1 text-purple-400 hover:text-purple-500"
            >
              <Link href="/signup">Create account</Link>
            </Button>
          </p>
        </div>
      </form>
    </section>
  );
}
