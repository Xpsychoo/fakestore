import type { MetadataRoute } from "next";
import { getCategories, getProducts } from "@/lib/api";
import { categorySlug } from "@/lib/catalog";
import { getSiteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  return [
    { url: `${base}/`, priority: 1 },
    { url: `${base}/products`, priority: 0.9 },
    ...categories.map((c) => ({ url: `${base}/products?category=${categorySlug(c)}`, priority: 0.8 })),
    ...products.map((p) => ({ url: `${base}/products/${p.id}`, priority: 0.7 })),
  ];
}
