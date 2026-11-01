import type { Metadata } from "next";
import { WishlistView } from "@/components/wishlist-view";
import { getProducts } from "@/lib/api";

export const metadata: Metadata = { title: "Wishlist", robots: { index: false } };

export default async function WishlistPage() {
  return (
    <div className="page space-y-6 py-8">
      <h1 className="text-3xl font-bold tracking-tight">Wishlist</h1>
      <WishlistView products={await getProducts()} />
    </div>
  );
}
