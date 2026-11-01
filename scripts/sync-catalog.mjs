// Saves the Fake Store catalogue and product images into the repo.
//
// fakestoreapi.com sits behind Cloudflare, which turns away requests from cloud build
// servers such as Vercel's. The catalogue is fixed (20 products), so the app ships a copy
// instead of fetching it at build time. Run `pnpm sync-catalog` locally to refresh it.

import { mkdir, rm, writeFile } from "node:fs/promises";
import { extname } from "node:path";

const API_URL = "https://fakestoreapi.com";
const DATA_FILE = new URL("../src/data/products.json", import.meta.url);
const IMAGE_DIR = new URL("../public/images/products/", import.meta.url);
const IMAGE_PATH = "/images/products/";

async function get(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} responded ${res.status}`);
  return res;
}

const products = await (await get(`${API_URL}/products`)).json();
if (!Array.isArray(products) || products.length === 0) throw new Error("The API returned no products");

await rm(IMAGE_DIR, { recursive: true, force: true });
await mkdir(IMAGE_DIR, { recursive: true });

const saved = [];
for (const product of products) {
  const ext = extname(new URL(product.image).pathname).toLowerCase() || ".jpg";
  const file = `${product.id}${ext}`;
  await writeFile(new URL(file, IMAGE_DIR), Buffer.from(await (await get(product.image)).arrayBuffer()));
  saved.push({ ...product, title: product.title.trim(), image: `${IMAGE_PATH}${file}` });
  console.log(`✓ ${file}  ${product.title}`);
}

await writeFile(DATA_FILE, `${JSON.stringify(saved, null, 2)}\n`);
console.log(`\nSaved ${saved.length} products to src/data/products.json`);
