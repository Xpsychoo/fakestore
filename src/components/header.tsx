"use client";

import { Heart, Search, ShoppingBag, Store, User } from "lucide-react";
import Form from "next/form";
import Link from "next/link";
import { itemCount } from "@/lib/cart";
import { useCart, useSession, useWishlist } from "@/lib/store";

function Badge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span className="absolute -top-1 -right-1 grid min-w-4.5 place-items-center rounded-full bg-brand px-1 text-[11px] leading-4.5 font-bold text-on-brand">
      {count > 99 ? "99+" : count}
    </span>
  );
}

const iconLink = "relative grid size-10 place-items-center rounded-xl text-ink hover:bg-sunken";

export function Header({ categories }: { categories: { slug: string; label: string }[] }) {
  const cartCount = itemCount(useCart());
  const wishlistCount = useWishlist().length;
  const session = useSession();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur">
      <div className="page flex h-16 items-center gap-3">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-lg font-bold tracking-tight">
          <span className="grid size-8 place-items-center rounded-lg bg-brand text-on-brand">
            <Store className="size-4.5" aria-hidden="true" />
          </span>
          <span className="hidden sm:inline">Shopora</span>
        </Link>

        <Form action="/products" className="relative mx-auto w-full max-w-md" role="search">
          <label htmlFor="site-search" className="sr-only">
            Search products
          </label>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input id="site-search" name="q" type="search" placeholder="Search products" className="input rounded-full bg-sunken pl-9" />
        </Form>

        <nav aria-label="Account and cart" className="flex shrink-0 items-center gap-1">
          <Link href="/wishlist" className={iconLink} aria-label={`Wishlist, ${wishlistCount} items`}>
            <Heart className="size-5" aria-hidden="true" />
            <Badge count={wishlistCount} />
          </Link>
          <Link href={session ? "/account" : "/login"} className={iconLink} aria-label={session ? `Account, ${session.user.name}` : "Sign in"}>
            <User className="size-5" aria-hidden="true" />
          </Link>
          <Link href="/cart" className={iconLink} aria-label={`Cart, ${cartCount} items`}>
            <ShoppingBag className="size-5" aria-hidden="true" />
            <Badge count={cartCount} />
          </Link>
        </nav>
      </div>

      <nav aria-label="Categories" className="page -mt-1 flex gap-1 overflow-x-auto pb-2 text-sm [scrollbar-width:none]">
        <Link href="/products" className="shrink-0 rounded-full px-3 py-1.5 text-muted hover:bg-sunken hover:text-ink">
          All products
        </Link>
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/products?category=${c.slug}`}
            className="shrink-0 rounded-full px-3 py-1.5 text-muted hover:bg-sunken hover:text-ink"
          >
            {c.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
