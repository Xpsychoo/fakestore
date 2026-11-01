"use client";

import { Check, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { addItem, MAX_QUANTITY } from "@/lib/cart";
import { setCart, useCart } from "@/lib/store";
import type { Product } from "@/lib/types";
import { QuantityStepper } from "./quantity-stepper";

export function AddToCart({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const inCart = useCart().find((i) => i.id === product.id)?.quantity ?? 0;
  const atLimit = inCart >= MAX_QUANTITY;

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 2500);
    return () => clearTimeout(t);
  }, [added]);

  const add = () => {
    setCart((items) => addItem(items, product, quantity));
    setAdded(true);
    setQuantity(1);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <QuantityStepper value={quantity} onChange={setQuantity} label="Quantity" />
        <button type="button" onClick={add} disabled={atLimit} className="btn-primary min-w-44 flex-1 sm:flex-none">
          {added ? <Check className="size-4.5" aria-hidden="true" /> : <ShoppingBag className="size-4.5" aria-hidden="true" />}
          {added ? "Added to cart" : "Add to cart"}
        </button>
      </div>
      <p className="min-h-5 text-sm text-muted" role="status">
        {atLimit ? (
          `You have the maximum of ${MAX_QUANTITY} in your cart.`
        ) : inCart > 0 ? (
          <>
            {inCart} in your cart ·{" "}
            <Link href="/cart" className="font-medium text-brand hover:underline">
              View cart
            </Link>
          </>
        ) : null}
      </p>
    </div>
  );
}
