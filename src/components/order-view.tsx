"use client";

import { CircleCheck } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/cart";
import { useOrders } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { OrderSummary } from "./cart-view";
import { ProductImage } from "./product-image";

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });

export function OrderView({ id }: { id: number }) {
  const order = useOrders().find((o) => o.id === id);
  const hydrated = useHydrated();

  if (!hydrated) return <div className="h-96 animate-pulse rounded-2xl bg-sunken" aria-busy="true" aria-label="Loading order" />;

  if (!order) {
    return (
      <div className="card space-y-3 px-6 py-16 text-center">
        <h1 className="text-xl font-semibold">Order not found</h1>
        <p className="text-muted">Orders are saved in the browser they were placed in. This one isn&apos;t here.</p>
        <Link href="/account" className="btn-secondary mt-2">
          See your orders
        </Link>
      </div>
    );
  }

  const { address: a } = order;

  return (
    <div className="space-y-6">
      <div className="card flex flex-col items-center gap-3 px-6 py-10 text-center">
        <CircleCheck className="size-12 text-brand" aria-hidden="true" />
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Thanks, {a.name.split(" ")[0]}! Your order is placed.</h1>
        <p className="text-muted">
          Order #{order.id} · {formatDate(order.placedAt)}
        </p>
        <p className="max-w-md text-sm text-muted">This is a demo store, so nothing will be charged or shipped.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-start">
        <div className="space-y-6">
          <section aria-labelledby="items-heading" className="card">
            <h2 id="items-heading" className="border-b border-line p-5 text-lg font-semibold">
              Items
            </h2>
            <ul className="divide-y divide-line">
              {order.items.map((i) => (
                <li key={i.id} className="flex items-center gap-4 p-4">
                  <ProductImage src={i.image} alt="" sizes="64px" className="size-16 shrink-0 rounded-xl border border-line" />
                  <div className="min-w-0 flex-1">
                    <Link href={`/products/${i.id}`} className="line-clamp-2 text-sm font-medium hover:underline">
                      {i.title}
                    </Link>
                    <p className="text-sm text-muted">Qty {i.quantity}</p>
                  </div>
                  <p className="font-semibold tabular-nums">{formatPrice(i.price * i.quantity)}</p>
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="ship-heading" className="card space-y-1 p-5 text-sm">
            <h2 id="ship-heading" className="mb-2 text-lg font-semibold">
              Delivering to
            </h2>
            <p className="font-medium">{a.name}</p>
            <p className="text-muted">{a.street}</p>
            <p className="text-muted">
              {a.city} {a.zip}
            </p>
            <p className="text-muted">
              {a.email} · {a.phone}
            </p>
          </section>
        </div>

        <OrderSummary subtotal={order.subtotal} shipping={order.shipping} total={order.total}>
          <Link href="/products" className="btn-primary w-full">
            Keep shopping
          </Link>
        </OrderSummary>
      </div>
    </div>
  );
}
