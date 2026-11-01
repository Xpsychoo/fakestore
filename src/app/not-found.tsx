import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page flex flex-col items-center gap-3 py-24 text-center">
      <p className="text-sm font-semibold text-brand">404</p>
      <h1 className="text-3xl font-bold tracking-tight">We couldn&apos;t find that page</h1>
      <p className="max-w-md text-muted">The product may no longer be available, or the link might be mistyped.</p>
      <Link href="/products" className="btn-primary mt-3">
        Browse products
      </Link>
    </div>
  );
}
