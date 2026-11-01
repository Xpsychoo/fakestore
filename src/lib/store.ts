"use client";

import { useSyncExternalStore } from "react";
import { parseCart } from "./cart";
import type { CartItem, Order, Session } from "./types";

type Updater<T> = T | ((prev: T) => T);

/**
 * A tiny localStorage-backed store. The server render and the first client render use
 * `initial`, then React swaps in the saved value, so there are no hydration mismatches.
 * Changes made in another tab are picked up through the `storage` event.
 */
function createStore<T>(key: string, initial: T, parse: (value: unknown) => T | null) {
  let state = initial;
  let loaded = false;
  const listeners = new Set<() => void>();

  const load = () => {
    if (loaded || typeof window === "undefined") return;
    loaded = true;
    try {
      const raw = localStorage.getItem(key);
      state = (raw && parse(JSON.parse(raw))) || initial;
    } catch {
      state = initial;
    }
  };

  const notify = () => listeners.forEach((l) => l());

  const onStorage = (e: StorageEvent) => {
    if (e.key !== key && e.key !== null) return;
    loaded = false;
    load();
    notify();
  };

  const store = {
    get: () => {
      load();
      return state;
    },
    set: (next: Updater<T>) => {
      load();
      state = typeof next === "function" ? (next as (prev: T) => T)(state) : next;
      try {
        localStorage.setItem(key, JSON.stringify(state));
      } catch {
        // Storage can be full or blocked (private mode); keep working in memory.
      }
      notify();
    },
    subscribe: (listener: () => void) => {
      if (listeners.size === 0) window.addEventListener("storage", onStorage);
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) window.removeEventListener("storage", onStorage);
      };
    },
  };

  const useValue = () => useSyncExternalStore(store.subscribe, store.get, () => initial);
  return [useValue, store.set] as const;
}

const EMPTY_CART: CartItem[] = [];
const EMPTY_IDS: number[] = [];
const NO_ORDERS: Order[] = [];

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;

export const [useCart, setCart] = createStore("shopora.cart", EMPTY_CART, parseCart);

export const [useWishlist, setWishlist] = createStore("shopora.wishlist", EMPTY_IDS, (v) =>
  Array.isArray(v) ? v.filter(Number.isInteger) : null,
);

export const [useOrders, setOrders] = createStore("shopora.orders", NO_ORDERS, (v) =>
  Array.isArray(v) ? (v.filter((o) => isObject(o) && Number.isInteger(o.id) && Array.isArray(o.items)) as Order[]) : null,
);

export const [useSession, setSession] = createStore<Session | null>("shopora.session", null, (v) =>
  isObject(v) && typeof v.token === "string" && isObject(v.user) ? (v as unknown as Session) : null,
);
