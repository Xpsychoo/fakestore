import { ArrowRight, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import { ProductGrid } from "@/components/product-card";
import { ProductImage } from "@/components/product-image";
import { getProducts } from "@/lib/api";
import { FREE_SHIPPING_FROM, formatPrice } from "@/lib/cart";
import { applyFilters, categoryLabel, categorySlug } from "@/lib/catalog";

export default async function HomePage() {
  const products = await getProducts();
  const topRated = applyFilters(products, { sort: "rating" }).slice(0, 8);
  const heroProducts = applyFilters(products, { sort: "popular" }).slice(0, 3);

  // One cover image per category: its most-reviewed product.
  const categories = [...new Set(products.map((p) => p.category))].map((category) => ({
    category,
    count: products.filter((p) => p.category === category).length,
    cover: applyFilters(products, { category, sort: "popular" })[0]!,
  }));

  return (
    <div className="page space-y-14 py-8 sm:py-10">
      <section className="card grid items-center gap-8 overflow-hidden p-6 sm:p-10 md:grid-cols-2">
        <div className="space-y-5">
          <p className="inline-flex rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">New season picks</p>
          <h1 className="text-3xl leading-tight font-bold tracking-tight text-balance sm:text-5xl">Everyday essentials, thoughtfully picked.</h1>
          <p className="max-w-md text-muted">
            Clothing, jewellery and electronics in one place. Filter by price, compare ratings and check out in a minute.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/products" className="btn-primary">
              Shop all products <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link href="/products?sort=rating" className="btn-secondary">
              See top rated
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3" aria-hidden="true">
          {heroProducts.map((p, i) => (
            <ProductImage
              key={p.id}
              src={p.image}
              alt=""
              sizes="(min-width: 768px) 25vw, 50vw"
              priority
              className={`rounded-2xl border border-line ${i === 0 ? "row-span-2 h-full min-h-64" : "aspect-square"}`}
            />
          ))}
        </div>
      </section>

      <ul className="grid gap-3 sm:grid-cols-3">
        {[
          { Icon: Truck, title: "Free shipping", text: `On orders over ${formatPrice(FREE_SHIPPING_FROM)}` },
          { Icon: RotateCcw, title: "30-day returns", text: "Change your mind? No problem." },
          { Icon: ShieldCheck, title: "Secure checkout", text: "Demo store: no payment needed" },
        ].map(({ Icon, title, text }) => (
          <li key={title} className="card flex items-center gap-3 p-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-sm font-semibold">{title}</span>
              <span className="block text-sm text-muted">{text}</span>
            </span>
          </li>
        ))}
      </ul>

      <section aria-labelledby="categories-heading" className="space-y-5">
        <h2 id="categories-heading" className="text-2xl font-bold tracking-tight">
          Shop by category
        </h2>
        <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {categories.map(({ category, count, cover }) => (
            <li key={category}>
              <Link href={`/products?category=${categorySlug(category)}`} className="card group block overflow-hidden">
                <ProductImage
                  src={cover.image}
                  alt=""
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="aspect-[4/3] transition-transform group-hover:scale-[1.03]"
                />
                <span className="flex items-center justify-between gap-2 border-t border-line p-4">
                  <span>
                    <span className="block font-semibold">{categoryLabel(category)}</span>
                    <span className="block text-sm text-muted">{count} products</span>
                  </span>
                  <ArrowRight className="size-4 text-muted transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="top-heading" className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <h2 id="top-heading" className="text-2xl font-bold tracking-tight">
            Top rated
          </h2>
          <Link href="/products?sort=rating" className="text-sm font-semibold text-brand hover:underline">
            View all
          </Link>
        </div>
        <ProductGrid products={topRated} />
      </section>
    </div>
  );
}
