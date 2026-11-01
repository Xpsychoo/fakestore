import { validateAddress } from "./checkout";
import type { Address, CartItem, Session, User } from "./types";

/**
 * Sign-in and checkout talk to the Fake Store API straight from the browser. The API allows
 * cross-origin requests, and it blocks traffic from cloud servers, so routing these calls
 * through our own server (e.g. server actions on Vercel) would fail.
 */
export const API_URL = "https://fakestoreapi.com";

export type LoginResult = { ok: true; session: Session } | { ok: false; error: string };

const UNAVAILABLE = "Sign-in is unavailable right now. Please try again.";
const OFFLINE = "Couldn't reach the store. Check your connection and try again.";

/** The token is a JWT whose `sub` claim is the user id; the API has no "current user" endpoint. */
export function userIdFromToken(token: string): number | null {
  try {
    const part = (token.split(".")[1] ?? "").replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(part.padEnd(Math.ceil(part.length / 4) * 4, "=")));
    return Number.isInteger(payload.sub) ? payload.sub : null;
  } catch {
    return null;
  }
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

export function toUser(u: ApiUser): User {
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

export async function login(username: string, password: string): Promise<LoginResult> {
  username = username.trim();
  if (!username || !password) return { ok: false, error: "Enter your username and password." };

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (res.status === 401) return { ok: false, error: "That username and password don't match." };
    if (!res.ok) return { ok: false, error: UNAVAILABLE };

    const { token } = (await res.json()) as { token: string };
    const id = userIdFromToken(token);
    if (id === null) return { ok: false, error: UNAVAILABLE };

    const userRes = await fetch(`${API_URL}/users/${id}`);
    if (!userRes.ok) return { ok: false, error: UNAVAILABLE };
    return { ok: true, session: { token, user: toUser((await userRes.json()) as ApiUser) } };
  } catch {
    return { ok: false, error: OFFLINE };
  }
}

export type OrderResult = { ok: true } | { ok: false; error: string };

/**
 * Sends the order to the API's carts endpoint. Fake Store accepts it but doesn't store it
 * (every new cart gets the same id), so the client numbers orders and keeps the history.
 */
export async function placeOrder(items: CartItem[], address: Address, userId?: number): Promise<OrderResult> {
  if (items.length === 0) return { ok: false, error: "Your cart is empty." };
  if (Object.keys(validateAddress(address)).length > 0) return { ok: false, error: "Check your delivery details." };

  try {
    const res = await fetch(`${API_URL}/carts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: userId ?? 1,
        products: items.map(({ id, title, price, image }) => ({
          id,
          title,
          price,
          description: title,
          category: "order",
          image: new URL(image, location.origin).href,
        })),
      }),
    });
    if (!res.ok) return { ok: false, error: "We couldn't place your order. Please try again." };
    return { ok: true };
  } catch {
    return { ok: false, error: OFFLINE };
  }
}
