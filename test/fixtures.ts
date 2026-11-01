import type { Product } from "@/lib/types";

const product = (id: number, category: string, price: number, rate: number, count: number, title = `Product ${id}`): Product => ({
  id,
  title,
  price,
  description: `Description of ${title}`,
  category,
  image: `https://fakestoreapi.com/img/${id}.png`,
  rating: { rate, count },
});

export const PRODUCTS: Product[] = [
  product(1, "men's clothing", 109.95, 3.9, 120, "Fjallraven Backpack"),
  product(2, "men's clothing", 22.3, 4.1, 259, "Slim Fit T-Shirt"),
  product(3, "jewelery", 695, 4.6, 400, "Dragon Bracelet"),
  product(4, "electronics", 64, 3.3, 203, "Portable SSD"),
  product(5, "women's clothing", 56.99, 2.6, 235, "Snowboard Jacket"),
];

export const CATEGORIES = ["electronics", "jewelery", "men's clothing", "women's clothing"];
