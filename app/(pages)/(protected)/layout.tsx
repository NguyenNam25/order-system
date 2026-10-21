import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Suspense } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#09090B] text-zinc-400">
          Đang tải trang đăng nhập...
        </div>
      }
    >
      <ProtectedRoute>{children}</ProtectedRoute>
    </Suspense>
  );
}
