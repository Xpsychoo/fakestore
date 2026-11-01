export default function Loading() {
  return (
    <div className="page space-y-6 py-8" aria-busy="true" aria-label="Loading products">
      <div className="h-9 w-56 animate-pulse rounded-lg bg-sunken" />
      <div className="h-24 animate-pulse rounded-2xl bg-sunken" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-sunken" />
        ))}
      </div>
    </div>
  );
}
