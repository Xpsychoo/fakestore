import Link from "next/link";
import { formatPrice } from "@/lib/cart";
import { categoryLabel } from "@/lib/catalog";
import type { Product } from "@/lib/types";
import { ProductImage } from "./product-image";
import { Rating } from "./rating";
import { WishlistButton } from "./wishlist-button";

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  return (
    <article className="card group relative flex w-full flex-col overflow-hidden transition-shadow hover:shadow-lg hover:shadow-black/5">
      <ProductImage
        src={product.image}
        alt=""
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
        priority={priority}
        className="aspect-square transition-transform group-hover:scale-[1.02]"
      />
      <div className="absolute top-3 right-3 z-10">
        <WishlistButton id={product.id} title={product.title} />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 border-t border-line p-4">
        <p className="text-xs font-medium tracking-wide text-muted uppercase">{categoryLabel(product.category)}</p>
        <h3 className="line-clamp-2 text-sm leading-snug font-medium">
          {/* The whole card is clickable through this link's ::after overlay. */}
          <Link href={`/products/${product.id}`} className="after:absolute after:inset-0">
            {product.title}
          </Link>
        </h3>
        <Rating rate={product.rating.rate} count={product.rating.count} />
        <p className="mt-auto pt-1 text-base font-semibold">{formatPrice(product.price)}</p>
      </div>
    </article>
  );
}

export function ProductGrid({ products, priorityCount = 0 }: { products: Product[]; priorityCount?: number }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
      {products.map((p, i) => (
        <li key={p.id} className="flex">
          <ProductCard product={p} priority={i < priorityCount} />
        </li>
      ))}
    </ul>
  );
}
