import AppContent from "@/components/layout-components/AppContent";
import NavigationBar from "@/components/layout-components/NavigationBar";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavigationBar />
      <AppContent>{children}</AppContent>
    </>
  );
}
