"use client";

import { ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import { FREE_SHIPPING_FROM, formatPrice, itemCount, removeItem, setQuantity, totals } from "@/lib/cart";
import { setCart, useCart } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { ProductImage } from "./product-image";
import { QuantityStepper } from "./quantity-stepper";

export function OrderSummary({ subtotal, shipping, total, children }: ReturnType<typeof totals> & { children?: React.ReactNode }) {
  return (
    <section aria-labelledby="summary-heading" className="card space-y-4 p-5 lg:sticky lg:top-32">
      <h2 id="summary-heading" className="text-lg font-semibold">
        Order summary
      </h2>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">Subtotal</dt>
          <dd className="font-medium tabular-nums">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Shipping</dt>
          <dd className="font-medium tabular-nums">{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
        </div>
        <div className="flex justify-between border-t border-line pt-3 text-base">
          <dt className="font-semibold">Total</dt>
          <dd className="font-bold tabular-nums">{formatPrice(total)}</dd>
        </div>
      </dl>
      {children}
    </section>
  );
}

export function CartView() {
  const items = useCart();
  const hydrated = useHydrated();

  if (!hydrated) return <div className="h-64 animate-pulse rounded-2xl bg-sunken" aria-busy="true" aria-label="Loading cart" />;

  if (items.length === 0) {
    return (
      <div className="card flex flex-col items-center gap-3 px-6 py-16 text-center">
        <ShoppingBag className="size-10 text-muted" aria-hidden="true" />
        <h2 className="text-lg font-semibold">Your cart is empty</h2>
        <p className="max-w-sm text-muted">Find something you love and it will show up here.</p>
        <Link href="/products" className="btn-primary mt-2">
          Start shopping
        </Link>
      </div>
    );
  }

  const sums = totals(items);
  const toFreeShipping = FREE_SHIPPING_FROM - sums.subtotal;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-start">
      <div className="space-y-3">
        <p className="text-sm text-muted">
          {itemCount(items)} {itemCount(items) === 1 ? "item" : "items"}
        </p>
        <ul className="card divide-y divide-line">
          {items.map((item) => (
            <li key={item.id} className="flex gap-4 p-4">
              <ProductImage src={item.image} alt="" sizes="96px" className="size-20 shrink-0 rounded-xl border border-line sm:size-24" />
              <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 space-y-1">
                  <Link href={`/products/${item.id}`} className="line-clamp-2 text-sm font-medium hover:underline">
                    {item.title}
                  </Link>
                  <p className="text-sm text-muted">{formatPrice(item.price)} each</p>
                </div>
                <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                  <p className="font-semibold tabular-nums sm:order-first">{formatPrice(item.price * item.quantity)}</p>
                  <div className="ml-auto flex items-center gap-1 sm:ml-0">
                    <QuantityStepper
                      value={item.quantity}
                      onChange={(n) => setCart((list) => setQuantity(list, item.id, n))}
                      label={`Quantity of ${item.title}`}
                    />
                    <button
                      type="button"
                      onClick={() => setCart((list) => removeItem(list, item.id))}
                      className="grid size-9 place-items-center rounded-xl text-muted hover:bg-sunken hover:text-danger"
                      aria-label={`Remove ${item.title}`}
                    >
                      <Trash2 className="size-4.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <OrderSummary {...sums}>
        {toFreeShipping > 0 ? (
          <div className="space-y-2">
            <p className="text-sm text-muted">
              Add <strong className="text-ink">{formatPrice(toFreeShipping)}</strong> more for free shipping.
            </p>
            <div className="h-1.5 overflow-hidden rounded-full bg-sunken" aria-hidden="true">
              <div className="h-full rounded-full bg-brand" style={{ width: `${(sums.subtotal / FREE_SHIPPING_FROM) * 100}%` }} />
            </div>
          </div>
        ) : (
          <p className="text-sm font-medium text-brand">You&apos;ve unlocked free shipping.</p>
        )}
        <Link href="/checkout" className="btn-primary w-full">
          Go to checkout
        </Link>
        <Link href="/products" className="block text-center text-sm font-medium text-brand hover:underline">
          Continue shopping
        </Link>
      </OrderSummary>
    </div>
  );
}
