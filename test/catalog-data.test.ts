import { existsSync } from "node:fs";
import { join } from "node:path";
import { getCategories, getProduct, getProducts } from "@/lib/api";

describe("bundled catalogue", () => {
  it("has every product image saved under public/", async () => {
    const products = await getProducts();
    expect(products).toHaveLength(20);
    for (const p of products) {
      expect(p.image).toMatch(/^\/images\/products\/\d+\.\w+$/);
      expect(existsSync(join(process.cwd(), "public", p.image)), p.image).toBe(true);
    }
  });

  it("looks up products and lists categories", async () => {
    expect((await getProduct(1))?.title).toMatch(/Backpack/);
    expect(await getProduct(999)).toBeNull();
    expect(await getCategories()).toEqual(["electronics", "jewelery", "men's clothing", "women's clothing"]);
  });
});
