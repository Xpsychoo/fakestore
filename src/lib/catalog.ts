import type { Product } from "./types";

export const SORTS = {
  featured: "Featured",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  rating: "Top rated",
  popular: "Most reviewed",
} as const;

export type Sort = keyof typeof SORTS;

export interface Filters {
  category?: string;
  q?: string;
  sort: Sort;
  min?: number;
  max?: number;
}

/** URL-friendly category slugs, e.g. "men's clothing" → "mens-clothing". */
export const categorySlug = (category: string) => category.toLowerCase().replace(/'/g, "").replace(/\s+/g, "-");

const LABELS: Record<string, string> = { jewelery: "Jewellery" };

export function categoryLabel(category: string) {
  return LABELS[category] ?? category.charAt(0).toUpperCase() + category.slice(1);
}

const toNumber = (v: string | undefined) => {
  if (v === undefined || v.trim() === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
};

type RawParams = Record<string, string | string[] | undefined>;

/** Reads filters from search params, ignoring anything malformed. */
export function parseFilters(params: RawParams, categories: string[]): Filters {
  const first = (key: string) => {
    const v = params[key];
    return Array.isArray(v) ? v[0] : v;
  };
  const slug = first("category");
  const sort = first("sort");
  const q = first("q")?.trim();
  return {
    category: categories.find((c) => categorySlug(c) === slug),
    q: q ? q.slice(0, 100) : undefined,
    sort: sort && sort in SORTS ? (sort as Sort) : "featured",
    min: toNumber(first("min")),
    max: toNumber(first("max")),
  };
}

/** Builds a /products URL from the current filters with some of them changed. */
export function filtersHref(filters: Filters, patch: Partial<Filters>) {
  const next = { ...filters, ...patch };
  const params = new URLSearchParams();
  if (next.category) params.set("category", categorySlug(next.category));
  if (next.q) params.set("q", next.q);
  if (next.sort !== "featured") params.set("sort", next.sort);
  if (next.min !== undefined) params.set("min", String(next.min));
  if (next.max !== undefined) params.set("max", String(next.max));
  const query = params.toString();
  return query ? `/products?${query}` : "/products";
}

export function applyFilters(products: Product[], { category, q, sort, min, max }: Filters): Product[] {
  const needle = q?.toLowerCase();
  const result = products.filter(
    (p) =>
      (!category || p.category === category) &&
      (min === undefined || p.price >= min) &&
      (max === undefined || p.price <= max) &&
      (!needle || `${p.title} ${p.description} ${p.category}`.toLowerCase().includes(needle)),
  );
  switch (sort) {
    case "price-asc":
      return result.sort((a, b) => a.price - b.price);
    case "price-desc":
      return result.sort((a, b) => b.price - a.price);
    case "rating":
      return result.sort((a, b) => b.rating.rate - a.rating.rate);
    case "popular":
      return result.sort((a, b) => b.rating.count - a.rating.count);
    default:
      return result;
  }
}

/** Other products from the same category, best rated first. */
export function relatedProducts(products: Product[], product: Product, limit = 4) {
  return products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .sort((a, b) => b.rating.rate - a.rating.rate)
    .slice(0, limit);
}
