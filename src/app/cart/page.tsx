import type { Metadata } from "next";
import { CartView } from "@/components/cart-view";

export const metadata: Metadata = { title: "Cart", robots: { index: false } };

export default function CartPage() {
  return (
    <div className="page space-y-6 py-8">
      <h1 className="text-3xl font-bold tracking-tight">Your cart</h1>
      <CartView />
    </div>
  );
}
