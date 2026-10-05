export default function TabsBadge({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="flex min-w-5 h-5 items-center justify-center rounded-full text-xs font-medium">
      {children}
    </span>
  );
}