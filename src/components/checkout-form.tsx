"use client";

import { Lock, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { placeOrder } from "@/lib/fakestore";
import { formatPrice, totals } from "@/lib/cart";
import { type AddressErrors, EMPTY_ADDRESS, validateAddress } from "@/lib/checkout";
import { setCart, setOrders, useCart, useSession } from "@/lib/store";
import type { Address } from "@/lib/types";
import { useHydrated } from "@/lib/use-hydrated";
import { OrderSummary } from "./cart-view";

const FIELDS: { name: keyof Address; label: string; type?: string; autoComplete: string; wide?: boolean }[] = [
  { name: "name", label: "Full name", autoComplete: "name", wide: true },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
  { name: "street", label: "Street address", autoComplete: "street-address", wide: true },
  { name: "city", label: "City", autoComplete: "address-level2" },
  { name: "zip", label: "Postal code", autoComplete: "postal-code" },
];

export function CheckoutForm() {
  const items = useCart();
  const session = useSession();
  const hydrated = useHydrated();
  const router = useRouter();
  const [address, setAddress] = useState<Address>(EMPTY_ADDRESS);
  const [errors, setErrors] = useState<AddressErrors>({});
  const [serverError, setServerError] = useState("");
  const [pending, startTransition] = useTransition();
  const [placed, setPlaced] = useState(false);

  // `placed` covers the moment between clearing the cart and the confirmation page loading.
  if (!hydrated || placed) return <div className="h-96 animate-pulse rounded-2xl bg-sunken" aria-busy="true" aria-label="Loading checkout" />;

  if (items.length === 0) {
    return (
      <div className="card flex flex-col items-center gap-3 px-6 py-16 text-center">
        <ShoppingBag className="size-10 text-muted" aria-hidden="true" />
        <h2 className="text-lg font-semibold">There&apos;s nothing to check out</h2>
        <p className="max-w-sm text-muted">Add a few products to your cart first.</p>
        <Link href="/products" className="btn-primary mt-2">
          Browse products
        </Link>
      </div>
    );
  }

  const sums = totals(items);

  const update = (name: keyof Address, value: string) => {
    setAddress((a) => ({ ...a, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
  };

  const fillFromAccount = () => {
    if (!session) return;
    const { name, email, phone, address: a } = session.user;
    setAddress({ name, email, phone, street: a.street, city: a.city, zip: a.zip });
    setErrors({});
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = validateAddress(address);
    setErrors(found);
    setServerError("");
    const firstInvalid = FIELDS.find((f) => found[f.name]);
    if (firstInvalid) {
      document.getElementById(`checkout-${firstInvalid.name}`)?.focus();
      return;
    }

    startTransition(async () => {
      const result = await placeOrder(items, address, session?.user.id);
      if (!result.ok) {
        setServerError(result.error);
        return;
      }
      const id = Date.now();
      setOrders((orders) => [{ id, placedAt: new Date().toISOString(), items, ...sums, address }, ...orders]);
      setPlaced(true);
      setCart([]);
      router.push(`/orders/${id}`);
    });
  };

  return (
    <form onSubmit={submit} noValidate className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-start">
      <section aria-labelledby="delivery-heading" className="card space-y-5 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="delivery-heading" className="text-lg font-semibold">
            Delivery details
          </h2>
          {session ? (
            <button type="button" onClick={fillFromAccount} className="text-sm font-semibold text-brand hover:underline">
              Use my saved address
            </button>
          ) : (
            <Link href="/login?next=/checkout" className="text-sm font-semibold text-brand hover:underline">
              Sign in to fill this in
            </Link>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {FIELDS.map((f) => (
            <div key={f.name} className={f.wide ? "sm:col-span-2" : undefined}>
              <label htmlFor={`checkout-${f.name}`} className="label">
                {f.label}
              </label>
              <input
                id={`checkout-${f.name}`}
                name={f.name}
                type={f.type ?? "text"}
                autoComplete={f.autoComplete}
                value={address[f.name]}
                onChange={(e) => update(f.name, e.target.value)}
                aria-invalid={errors[f.name] ? true : undefined}
                aria-describedby={errors[f.name] ? `checkout-${f.name}-error` : undefined}
                className="input"
              />
              {errors[f.name] && (
                <p id={`checkout-${f.name}-error`} className="mt-1.5 text-sm text-danger">
                  {errors[f.name]}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-sunken p-4 text-sm text-muted">
          <p className="font-semibold text-ink">Payment</p>
          <p className="mt-1">This is a demo store, so no payment details are needed and nothing will be charged or shipped.</p>
        </div>
      </section>

      <OrderSummary {...sums}>
        <ul className="max-h-56 space-y-2 overflow-y-auto border-t border-line pt-3 text-sm">
          {items.map((i) => (
            <li key={i.id} className="flex justify-between gap-3">
              <span className="line-clamp-1 text-muted">
                {i.quantity} × {i.title}
              </span>
              <span className="shrink-0 tabular-nums">{formatPrice(i.price * i.quantity)}</span>
            </li>
          ))}
        </ul>
        {serverError && (
          <p role="alert" className="rounded-xl bg-danger/10 p-3 text-sm text-danger">
            {serverError}
          </p>
        )}
        <button type="submit" disabled={pending} className="btn-primary w-full">
          <Lock className="size-4" aria-hidden="true" />
          {pending ? "Placing order…" : `Place order · ${formatPrice(sums.total)}`}
        </button>
      </OrderSummary>
    </form>
  );
}
