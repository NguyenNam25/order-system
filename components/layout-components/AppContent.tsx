import React from "react";
import NavigationBar from "./NavigationBar";

export default function AppContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="px-48 my-10 pb-5">
      {children}
    </div>
  );
}
