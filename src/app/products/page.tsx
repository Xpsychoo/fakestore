import { SearchX } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { FilterBar } from "@/components/filter-bar";
import { ProductGrid } from "@/components/product-card";
import { getCategories, getProducts } from "@/lib/api";
import { formatPrice } from "@/lib/cart";
import { applyFilters, categoryLabel, filtersHref, parseFilters } from "@/lib/catalog";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const filters = parseFilters(await searchParams, await getCategories());
  return {
    title: filters.category ? categoryLabel(filters.category) : "All products",
    alternates: { canonical: filtersHref({ sort: "featured" }, { category: filters.category }) },
  };
}

export default async function ProductsPage({ searchParams }: Props) {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const filters = parseFilters(await searchParams, categories);
  const results = applyFilters(products, filters);

  const active = [
    filters.q && { label: `“${filters.q}”`, href: filtersHref(filters, { q: undefined }) },
    filters.min !== undefined && { label: `From ${formatPrice(filters.min)}`, href: filtersHref(filters, { min: undefined }) },
    filters.max !== undefined && { label: `Up to ${formatPrice(filters.max)}`, href: filtersHref(filters, { max: undefined }) },
  ].filter((x): x is { label: string; href: string } => Boolean(x));

  return (
    <div className="page space-y-6 py-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{filters.category ? categoryLabel(filters.category) : "All products"}</h1>
        <p className="mt-1 text-muted" role="status">
          {results.length} {results.length === 1 ? "product" : "products"}
        </p>
      </div>

      <FilterBar filters={filters} categories={categories} />

      {active.length > 0 && (
        <ul className="flex flex-wrap items-center gap-2 text-sm" aria-label="Active filters">
          {active.map((f) => (
            <li key={f.label}>
              <Link href={f.href} className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 font-medium text-brand hover:underline">
                {f.label} <span aria-hidden="true">×</span>
                <span className="sr-only">(remove filter)</span>
              </Link>
            </li>
          ))}
          <li>
            <Link href={filtersHref({ sort: "featured" }, { category: filters.category })} className="px-2 text-muted hover:text-ink hover:underline">
              Clear all
            </Link>
          </li>
        </ul>
      )}

      {results.length > 0 ? (
        <ProductGrid products={results} priorityCount={4} />
      ) : (
        <div className="card flex flex-col items-center gap-3 px-6 py-16 text-center">
          <SearchX className="size-10 text-muted" aria-hidden="true" />
          <h2 className="text-lg font-semibold">No products match those filters</h2>
          <p className="max-w-sm text-muted">Try a different search term, widen the price range or pick another category.</p>
          <Link href="/products" className="btn-secondary mt-2">
            Show all products
          </Link>
        </div>
      )}
    </div>
  );
}
