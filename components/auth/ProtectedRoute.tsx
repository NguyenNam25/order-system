"use client";

import { useEffect } from "react";
import {
  useRouter,
  usePathname,
  useSearchParams,
} from "next/navigation";
import { useAuth } from "./AuthContext";

type Role = "USER" | "ADMIN";

export default function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: Role[];
}) {
  const { currentUser, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const queryString = searchParams.toString();
  const currentUrl = queryString
    ? `${pathname}?${queryString}`
    : pathname;

  useEffect(() => {
    if (isLoading) return;

    if (!currentUser) {
      const redirectUrl = encodeURIComponent(currentUrl);
      router.replace(`/login?redirect=${redirectUrl}`);
      return;
    }

    if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
      router.replace("/");
    }
  }, [
    currentUser,
    isLoading,
    router,
    allowedRoles,
    currentUrl,
  ]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return null;
  }

  return <>{children}</>;
}