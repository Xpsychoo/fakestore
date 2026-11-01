import catalog from "@/data/products.json";
import type { Product } from "./types";

/**
 * The catalogue is a copy of the Fake Store API's products, saved by `pnpm sync-catalog`.
 * The API blocks requests from cloud build servers, and its 20 products never change, so
 * reading them from the repo keeps builds reliable. The functions stay async so a live
 * data source could replace them without touching the pages.
 */
const products = catalog as Product[];

export const getProducts = async (): Promise<Product[]> => products;

export const getCategories = async (): Promise<string[]> => [...new Set(products.map((p) => p.category))].sort();

export async function getProduct(id: number): Promise<Product | null> {
  return products.find((p) => p.id === id) ?? null;
}
