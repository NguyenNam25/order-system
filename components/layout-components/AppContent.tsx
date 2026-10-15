import React from "react";
import NavigationBar from "./NavigationBar";

export default function AppContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#09090B] px-4 py-6 text-zinc-100 sm:px-6 sm:py-8 lg:px-10 xl:px-14 2xl:px-20">
      <div className="mx-auto my-4 w-full max-w-[1600px] pb-8">
        {children}
      </div>
    </main>
  );
}
