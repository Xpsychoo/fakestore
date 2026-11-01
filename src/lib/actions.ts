"use server";

import { API_URL, getUser } from "./api";
import { validateAddress } from "./checkout";
import type { Address, CartItem, Session } from "./types";

export type LoginResult = { ok: true; session: Session } | { ok: false; error: string };

/** The token is a JWT whose `sub` claim is the user id; the API has no "current user" endpoint. */
function userIdFromToken(token: string): number | null {
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1] ?? "", "base64url").toString("utf8"));
    return Number.isInteger(payload.sub) ? payload.sub : null;
  } catch {
    return null;
  }
}

export async function login(username: string, password: string): Promise<LoginResult> {
  username = String(username).trim();
  password = String(password);
  if (!username || !password) return { ok: false, error: "Enter your username and password." };

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      cache: "no-store",
    });
    if (res.status === 401) return { ok: false, error: "That username and password don't match." };
    if (!res.ok) return { ok: false, error: "Sign-in is unavailable right now. Please try again." };

    const { token } = (await res.json()) as { token: string };
    const id = userIdFromToken(token);
    if (id === null) return { ok: false, error: "Sign-in is unavailable right now. Please try again." };
    return { ok: true, session: { token, user: await getUser(id) } };
  } catch {
    return { ok: false, error: "Couldn't reach the store. Check your connection and try again." };
  }
}

export type OrderResult = { ok: true } | { ok: false; error: string };

/**
 * Sends the order to the API's carts endpoint. Fake Store accepts it but doesn't store it
 * (every new cart gets the same id), so the client numbers orders and keeps the history.
 */
export async function placeOrder(items: CartItem[], address: Address, userId?: number): Promise<OrderResult> {
  if (!Array.isArray(items) || items.length === 0) return { ok: false, error: "Your cart is empty." };
  if (Object.keys(validateAddress(address)).length > 0) return { ok: false, error: "Check your delivery details." };

  try {
    const res = await fetch(`${API_URL}/carts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: userId ?? 1,
        products: items.map(({ id, title, price, image }) => ({ id, title, price, image, description: title, category: "order" })),
      }),
      cache: "no-store",
    });
    if (!res.ok) return { ok: false, error: "We couldn't place your order. Please try again." };
    return { ok: true };
  } catch {
    return { ok: false, error: "Couldn't reach the store. Check your connection and try again." };
  }
}
