import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout-form";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default function CheckoutPage() {
  return (
    <div className="page space-y-6 py-8">
      <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
      <CheckoutForm />
    </div>
  );
}
