import { applyFilters, categoryLabel, categorySlug, filtersHref, parseFilters, relatedProducts } from "@/lib/catalog";
import { CATEGORIES, PRODUCTS } from "./fixtures";

const ids = (list: { id: number }[]) => list.map((p) => p.id);

describe("categories", () => {
  it("makes URL-friendly slugs and readable labels", () => {
    expect(categorySlug("men's clothing")).toBe("mens-clothing");
    expect(categoryLabel("men's clothing")).toBe("Men's clothing");
    expect(categoryLabel("jewelery")).toBe("Jewellery");
  });
});

describe("parseFilters", () => {
  it("reads valid params", () => {
    expect(parseFilters({ category: "mens-clothing", q: "  shirt ", sort: "price-asc", min: "10", max: "50" }, CATEGORIES)).toEqual({
      category: "men's clothing",
      q: "shirt",
      sort: "price-asc",
      min: 10,
      max: 50,
    });
  });

  it("ignores unknown or malformed values", () => {
    expect(parseFilters({ category: "toys", sort: "cheapest", min: "-5", max: "abc", q: "   " }, CATEGORIES)).toEqual({
      category: undefined,
      q: undefined,
      sort: "featured",
      min: undefined,
      max: undefined,
    });
  });

  it("uses the first value of repeated params", () => {
    expect(parseFilters({ sort: ["rating", "price-asc"] }, CATEGORIES).sort).toBe("rating");
  });
});

describe("applyFilters", () => {
  it("keeps API order by default", () => {
    expect(ids(applyFilters(PRODUCTS, { sort: "featured" }))).toEqual([1, 2, 3, 4, 5]);
  });

  it("filters by category, price range and search text", () => {
    expect(ids(applyFilters(PRODUCTS, { sort: "featured", category: "men's clothing" }))).toEqual([1, 2]);
    expect(ids(applyFilters(PRODUCTS, { sort: "featured", min: 50, max: 110 }))).toEqual([1, 4, 5]);
    expect(ids(applyFilters(PRODUCTS, { sort: "featured", q: "JACKET" }))).toEqual([5]);
    expect(ids(applyFilters(PRODUCTS, { sort: "featured", q: "electronics" }))).toEqual([4]);
  });

  it("sorts by price, rating and review count", () => {
    expect(ids(applyFilters(PRODUCTS, { sort: "price-asc" }))).toEqual([2, 5, 4, 1, 3]);
    expect(ids(applyFilters(PRODUCTS, { sort: "price-desc" }))).toEqual([3, 1, 4, 5, 2]);
    expect(ids(applyFilters(PRODUCTS, { sort: "rating" }))).toEqual([3, 2, 1, 4, 5]);
    expect(ids(applyFilters(PRODUCTS, { sort: "popular" }))).toEqual([3, 2, 5, 4, 1]);
  });

  it("does not reorder the input array", () => {
    applyFilters(PRODUCTS, { sort: "price-asc" });
    expect(ids(PRODUCTS)).toEqual([1, 2, 3, 4, 5]);
  });
});

describe("filtersHref", () => {
  it("round-trips through parseFilters", () => {
    const filters = { category: "men's clothing", q: "shirt", sort: "rating" as const, min: 5, max: 40 };
    const href = filtersHref(filters, {});
    const params = Object.fromEntries(new URL(href, "http://x").searchParams);
    expect(parseFilters(params, CATEGORIES)).toEqual(filters);
  });

  it("drops defaults and removed filters", () => {
    expect(filtersHref({ sort: "featured", q: "bag" }, { q: undefined })).toBe("/products");
  });
});

it("suggests related products from the same category", () => {
  expect(ids(relatedProducts(PRODUCTS, PRODUCTS[0]!))).toEqual([2]);
});
