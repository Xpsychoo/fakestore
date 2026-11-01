"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="page flex flex-col items-center gap-3 py-24 text-center">
      <h1 className="text-3xl font-bold tracking-tight">The store didn&apos;t load</h1>
      <p className="max-w-md text-muted">We couldn&apos;t reach the product catalogue. It&apos;s usually back within a few moments.</p>
      <button type="button" onClick={reset} className="btn-primary mt-3">
        Try again
      </button>
    </div>
  );
}
