"use client";

import { LogOut, Package, UserRound } from "lucide-react";
import Link from "next/link";
import { formatPrice, itemCount } from "@/lib/cart";
import { setSession, useOrders, useSession } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { formatDate } from "./order-view";

export function AccountView() {
  const session = useSession();
  const orders = useOrders();
  const hydrated = useHydrated();

  if (!hydrated) return <div className="h-96 animate-pulse rounded-2xl bg-sunken" aria-busy="true" aria-label="Loading account" />;

  return (
    <div className="grid gap-6 lg:grid-cols-[20rem_1fr] lg:items-start">
      <section aria-labelledby="profile-heading" className="card space-y-4 p-5">
        <h2 id="profile-heading" className="sr-only">
          Profile
        </h2>
        {session ? (
          <>
            <div className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-full bg-brand-soft text-lg font-bold text-brand" aria-hidden="true">
                {session.user.name.charAt(0)}
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold">{session.user.name}</p>
                <p className="truncate text-sm text-muted">@{session.user.username}</p>
              </div>
            </div>
            <dl className="space-y-3 border-t border-line pt-4 text-sm">
              <div>
                <dt className="text-muted">Email</dt>
                <dd>{session.user.email}</dd>
              </div>
              <div>
                <dt className="text-muted">Phone</dt>
                <dd>{session.user.phone}</dd>
              </div>
              <div>
                <dt className="text-muted">Saved address</dt>
                <dd>
                  {session.user.address.street}, {session.user.address.city} {session.user.address.zip}
                </dd>
              </div>
            </dl>
            <button type="button" onClick={() => setSession(null)} className="btn-secondary w-full">
              <LogOut className="size-4" aria-hidden="true" />
              Sign out
            </button>
          </>
        ) : (
          <div className="space-y-3 text-center">
            <UserRound className="mx-auto size-10 text-muted" aria-hidden="true" />
            <p className="font-semibold">You&apos;re not signed in</p>
            <p className="text-sm text-muted">Sign in to fill in your delivery details automatically at checkout.</p>
            <Link href="/login" className="btn-primary w-full">
              Sign in
            </Link>
          </div>
        )}
      </section>

      <section aria-labelledby="orders-heading" className="card">
        <div className="border-b border-line p-5">
          <h2 id="orders-heading" className="text-lg font-semibold">
            Your orders
          </h2>
          <p className="text-sm text-muted">Orders placed in this browser.</p>
        </div>
        {orders.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
            <Package className="size-10 text-muted" aria-hidden="true" />
            <p className="text-muted">No orders yet.</p>
            <Link href="/products" className="btn-secondary">
              Start shopping
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {orders.map((o) => (
              <li key={o.id}>
                <Link href={`/orders/${o.id}`} className="flex items-center justify-between gap-4 p-5 hover:bg-sunken">
                  <span>
                    <span className="block font-medium">Order #{o.id}</span>
                    <span className="block text-sm text-muted">
                      {formatDate(o.placedAt)} · {itemCount(o.items)} {itemCount(o.items) === 1 ? "item" : "items"}
                    </span>
                  </span>
                  <span className="font-semibold tabular-nums">{formatPrice(o.total)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
