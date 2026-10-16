export default function ProductLoadingState() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: 10 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#111114] p-2.5 sm:p-3"
        >
          <div className="aspect-square animate-pulse rounded-xl bg-zinc-800" />
          <div className="mt-4 h-4 animate-pulse rounded bg-zinc-800" />
          <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-zinc-800" />
          <div className="mt-5 h-6 w-1/2 animate-pulse rounded bg-zinc-800" />
          <div className="mt-4 h-9 animate-pulse rounded-lg bg-zinc-800" />
        </div>
      ))}
    </div>
  );
}
