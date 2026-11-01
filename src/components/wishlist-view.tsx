"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { useWishlist } from "@/lib/store";
import type { Product } from "@/lib/types";
import { useHydrated } from "@/lib/use-hydrated";
import { ProductGrid } from "./product-card";

export function WishlistView({ products }: { products: Product[] }) {
  const ids = useWishlist();
  const hydrated = useHydrated();
  const saved = products.filter((p) => ids.includes(p.id));

  if (!hydrated) return <div className="h-64 animate-pulse rounded-2xl bg-sunken" aria-busy="true" aria-label="Loading wishlist" />;

  if (saved.length === 0) {
    return (
      <div className="card flex flex-col items-center gap-3 px-6 py-16 text-center">
        <Heart className="size-10 text-muted" aria-hidden="true" />
        <h2 className="text-lg font-semibold">Your wishlist is empty</h2>
        <p className="max-w-sm text-muted">Tap the heart on any product to save it for later.</p>
        <Link href="/products" className="btn-primary mt-2">
          Browse products
        </Link>
      </div>
    );
  }
  return <ProductGrid products={saved} />;
}
