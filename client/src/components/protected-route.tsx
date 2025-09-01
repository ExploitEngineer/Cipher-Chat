"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const router = useRouter();
  const { authUser, isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!isCheckingAuth && !authUser) {
      router.replace(redirectTo);
    }
  }, [authUser, isCheckingAuth, router, redirectTo]);

  if (isCheckingAuth) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return <>{children}</>;
}
