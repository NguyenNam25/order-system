import AppContent from "@/components/layout-components/AppContent";
import NavigationBar from "@/components/layout-components/NavigationBar";
import { Suspense } from "react";

export default function PageLayout({
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
      <NavigationBar />
      <AppContent>{children}</AppContent>
    </Suspense>
  );
}
