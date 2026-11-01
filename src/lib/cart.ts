import type { CartItem, Product } from "./types";

export const MAX_QUANTITY = 10;
export const FREE_SHIPPING_FROM = 100;
export const SHIPPING_FEE = 9.99;

const clamp = (n: number) => Math.min(MAX_QUANTITY, Math.max(1, Math.floor(n)));

export function addItem(items: CartItem[], product: Pick<Product, "id" | "title" | "price" | "image">, quantity = 1): CartItem[] {
  const existing = items.find((i) => i.id === product.id);
  if (existing) return setQuantity(items, product.id, existing.quantity + quantity);
  const { id, title, price, image } = product;
  return [...items, { id, title, price, image, quantity: clamp(quantity) }];
}

export function setQuantity(items: CartItem[], id: number, quantity: number): CartItem[] {
  return items.map((i) => (i.id === id ? { ...i, quantity: clamp(quantity) } : i));
}

export const removeItem = (items: CartItem[], id: number) => items.filter((i) => i.id !== id);

export const itemCount = (items: CartItem[]) => items.reduce((n, i) => n + i.quantity, 0);

/** Totals are rounded to cents so floating-point noise never reaches the UI. */
const cents = (n: number) => Math.round(n * 100) / 100;

export function totals(items: CartItem[]) {
  const subtotal = cents(items.reduce((sum, i) => sum + i.price * i.quantity, 0));
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE;
  return { subtotal, shipping, total: cents(subtotal + shipping) };
}

/** Validates cart data read back from localStorage, which the user can edit. */
export function parseCart(value: unknown): CartItem[] | null {
  if (!Array.isArray(value)) return null;
  return value.filter(
    (i): i is CartItem =>
      typeof i === "object" &&
      i !== null &&
      Number.isInteger(i.id) &&
      typeof i.title === "string" &&
      typeof i.price === "number" &&
      i.price >= 0 &&
      typeof i.image === "string" &&
      i.image.startsWith("/images/products/") &&
      Number.isInteger(i.quantity) &&
      i.quantity >= 1 &&
      i.quantity <= MAX_QUANTITY,
  );
}

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export const formatPrice = (n: number) => money.format(n);
