import "server-only";
import type { Product, User } from "./types";

export const API_URL = "https://fakestoreapi.com";

/** The catalogue rarely changes, so responses are cached and refreshed hourly. */
const REVALIDATE_SECONDS = 3600;

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { next: { revalidate: REVALIDATE_SECONDS } });
  if (!res.ok) throw new Error(`Fake Store API ${path} responded ${res.status}`);
  return (await res.json()) as T;
}

export const getProducts = () => get<Product[]>("/products");

export const getCategories = () => get<string[]>("/products/categories");

/** Returns null for unknown ids. The API answers those with an empty 200 body. */
export async function getProduct(id: number): Promise<Product | null> {
  if (!Number.isInteger(id) || id < 1) return null;
  const res = await fetch(`${API_URL}/products/${id}`, { next: { revalidate: REVALIDATE_SECONDS } });
  if (!res.ok) throw new Error(`Fake Store API /products/${id} responded ${res.status}`);
  const text = await res.text();
  return text ? (JSON.parse(text) as Product) : null;
}

interface ApiUser {
  id: number;
  username: string;
  email: string;
  phone: string;
  name: { firstname: string; lastname: string };
  address: { street: string; number: number; city: string; zipcode: string };
}

const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export async function getUser(id: number): Promise<User> {
  const u = await fetch(`${API_URL}/users/${id}`, { cache: "no-store" }).then((r) => {
    if (!r.ok) throw new Error(`Fake Store API /users/${id} responded ${r.status}`);
    return r.json() as Promise<ApiUser>;
  });
  return {
    id: u.id,
    username: u.username,
    email: u.email,
    phone: u.phone,
    name: `${capitalise(u.name.firstname)} ${capitalise(u.name.lastname)}`,
    address: {
      street: `${u.address.number} ${u.address.street.split(" ").map(capitalise).join(" ")}`,
      city: capitalise(u.address.city),
      zip: u.address.zipcode,
    },
  };
}
